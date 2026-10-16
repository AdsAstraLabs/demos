#!/usr/bin/env node
// St. Clement Parish site + editor. Zero dependencies (Node 18+).
//   Public:  /  (the page, rebuilt from the content files),  /img/ /fonts/ /files/ /content/*.json
//   Editor:  /admin/  (password login; editors come from ADMIN_USERS), JSON API under /admin/api/
// Environment: PORT, DATA_DIR (persistent volume, e.g. /data), ADMIN_USERS, SESSION_SECRET. See RAILWAY.md.
import http from 'node:http';
import { promises as fsp, readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync, renameSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, sep, extname, basename } from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { buildPage, ROOT, torontoToday } from './cms/build.mjs';
import { FILES, NAMES, fill } from './admin/schema.js';
import { checkTags, typo, clean } from './admin/text.js';
import { imageSize, sniff } from './cms/imgsize.mjs';

const PORT = +process.env.PORT || 8080;
const DATA = resolve(process.env.DATA_DIR || join(ROOT, '.data'));
const D = { content: join(DATA, 'content'), img: join(DATA, 'uploads', 'img'), files: join(DATA, 'uploads', 'files'), history: join(DATA, 'history') };
const KEEP = 50, MAX_UPLOAD = 15 * 1024 * 1024, MAX_JSON = 2 * 1024 * 1024, SESSION_H = 12;
const log = (...a) => console.log(new Date().toISOString(), ...a);

// ───────────────────────── data directory (seeded from the repository on first boot)
for (const d of Object.values(D)) mkdirSync(d, { recursive: true });
for (const n of NAMES) {
  const f = join(D.content, n + '.json');
  if (!existsSync(f)) { copyFileSync(join(ROOT, 'content', n + '.json'), f); log('seeded content/' + n + '.json'); }
}

// ───────────────────────── page build
let page = null, builtFor = '';
function rebuild(why) {
  const today = process.env.CMS_TODAY || torontoToday();
  const html = buildPage(D.content, today);
  page = { body: Buffer.from(html), gz: zlib.gzipSync(html), etag: '"' + crypto.createHash('sha1').update(html).digest('base64url').slice(0, 20) + '"' };
  builtFor = today;
  log('page built (' + why + ', ' + today + ')');
}
rebuild('start');
setInterval(() => { const t = process.env.CMS_TODAY || torontoToday(); if (t !== builtFor) try { rebuild('new day'); } catch (e) { log('rebuild failed', e.message); } }, 10 * 60 * 1000).unref();

// ───────────────────────── editors and sessions
const SECRET = process.env.SESSION_SECRET || (log('WARNING: SESSION_SECRET is not set; editors will be logged out on every restart'), crypto.randomBytes(32).toString('hex'));
const scrypt = (pw, salt, N = 16384) => new Promise((ok, no) => crypto.scrypt(String(pw), salt, 32, { N, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (e, k) => e ? no(e) : ok(k)));
const USERS = new Map();
async function loadUsers() {
  const raw = String(process.env.ADMIN_USERS || '').split(/[;\n]+/).map(s => s.trim()).filter(Boolean);
  for (const entry of raw) {
    const i = entry.indexOf(':');
    if (i < 1) { log('ADMIN_USERS: ignoring an entry without “email:password”'); continue; }
    const email = entry.slice(0, i).trim().toLowerCase(), pw = entry.slice(i + 1);
    const m = /^scrypt\$(\d+)\$([A-Za-z0-9+/=_-]+)\$([A-Za-z0-9+/=_-]+)$/.exec(pw);   // from tools/hash-password.mjs
    if (m) USERS.set(email, { N: +m[1], salt: Buffer.from(m[2], 'base64'), hash: Buffer.from(m[3], 'base64') });
    else { const salt = crypto.randomBytes(16); USERS.set(email, { N: 16384, salt, hash: await scrypt(pw, salt) }); }
  }
  log(USERS.size ? USERS.size + ' editor account(s) configured' : 'WARNING: ADMIN_USERS is empty; nobody can log in to /admin/');
}
const DUMMY = { N: 16384, salt: crypto.randomBytes(16), hash: crypto.randomBytes(32) };
async function checkPassword(email, pw) {
  const u = USERS.get(email), r = u || DUMMY;                  // same work for unknown e-mails
  const k = await scrypt(pw, r.salt, r.N);
  return !!u && k.length === r.hash.length && crypto.timingSafeEqual(k, r.hash);
}

const SESS_FILE = join(DATA, '.sessions.json');
const sessions = new Map();                                     // sha256(id) → { u, exp, csrf }
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const sign = s => crypto.createHmac('sha256', SECRET).update(s).digest('base64url');
try { for (const [k, v] of Object.entries(JSON.parse(readFileSync(SESS_FILE, 'utf8')))) if (v.exp > Date.now()) sessions.set(k, v); } catch {}
const saveSessions = () => { try { writeFileSync(SESS_FILE + '.tmp', JSON.stringify(Object.fromEntries(sessions))); renameSync(SESS_FILE + '.tmp', SESS_FILE); } catch (e) { log('could not save sessions', e.message); } };
function newSession(u) {
  const id = crypto.randomBytes(32).toString('base64url'), csrf = crypto.randomBytes(24).toString('base64url');
  sessions.set(sha(id), { u, exp: Date.now() + SESSION_H * 3600e3, csrf }); saveSessions();
  return id + '.' + sign(id);
}
function getSession(req) {
  const c = /(?:^|;\s*)sc_admin=([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/.exec(req.headers.cookie || '');
  if (!c) return null;
  const good = Buffer.from(sign(c[1])), got = Buffer.from(c[2]);
  if (good.length !== got.length || !crypto.timingSafeEqual(good, got)) return null;
  const k = sha(c[1]), s = sessions.get(k);
  if (!s || s.exp < Date.now() || !USERS.has(s.u)) { if (s) { sessions.delete(k); saveSessions(); } return null; }
  return { ...s, key: k };
}
const cookie = (v, age) => 'sc_admin=' + v + '; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=' + age;

// Failed logins: at most 5 per e-mail and 20 per address in 15 minutes.
const fails = new Map();
const WINDOW = 15 * 60e3;
const tooMany = (key, max) => { const f = fails.get(key); return f && f.n >= max && Date.now() - f.t < WINDOW ? Math.ceil((WINDOW - (Date.now() - f.t)) / 60e3) : 0; };
const fail = key => { const f = fails.get(key); if (!f || Date.now() - f.t >= WINDOW) fails.set(key, { n: 1, t: Date.now() }); else f.n++; };
setInterval(() => { for (const [k, f] of fails) if (Date.now() - f.t >= WINDOW) fails.delete(k); for (const [k, s] of sessions) if (s.exp < Date.now()) sessions.delete(k); }, 60e3).unref();
const clientIp = req => { const x = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean); return x.length ? x[x.length - 1] : req.socket.remoteAddress; };
const hostOf = req => String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return req.headers['sec-fetch-site'] ? req.headers['sec-fetch-site'] === 'same-origin' : true;
  try { return new URL(o).host.toLowerCase() === hostOf(req); } catch { return false; }
}

// ───────────────────────── static files
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.yml': 'text/yaml; charset=utf-8', '.yaml': 'text/yaml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};
const TEXT = /^(text\/|application\/(json|xml|manifest)|image\/svg)/;

// Rules from _headers (Netlify / Cloudflare Pages format): a path pattern line, then indented "Name: value" lines.
const RULES = [];
try {
  let cur = null;
  for (const line of readFileSync(join(ROOT, '_headers'), 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { re: new RegExp('^' + line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'), h: [] }; RULES.push(cur); }
    else if (cur) { const i = line.indexOf(':'); if (i > 0) cur.h.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  }
} catch {}
const BASE = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
const ADMIN_H = {
  'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
};
function headersFor(path, extra = {}) {
  const h = { ...BASE };
  for (const r of RULES) if (r.re.test(path) || (path.endsWith('/') && r.re.test(path + 'index.html'))) for (const [k, v] of r.h) h[k] = v;
  if (path.startsWith('/admin')) Object.assign(h, ADMIN_H);
  return Object.assign(h, extra);
}

// Map a URL path to a file inside one of the allowed folders, or null. Nothing else is ever served: no tools/,
// cms/, package.json, server.mjs, dotfiles, or anything outside the site folder.
const PUBLIC = [
  ['/img/uploads/', [D.img, join(ROOT, 'img', 'uploads')]],
  ['/img/', [join(ROOT, 'img')]],
  ['/fonts/', [join(ROOT, 'fonts')]],
  ['/files/', [D.files]],
];
function safeJoin(dir, rel) {
  if (!rel || rel.split('/').some(s => !s || s.startsWith('.') || s.includes('\\') || s.includes('\0'))) return null;
  const f = resolve(dir, rel);
  return f.startsWith(resolve(dir) + sep) ? f : null;
}
async function fileFor(path) {
  for (const [prefix, dirs] of PUBLIC) {
    if (!path.startsWith(prefix)) continue;
    for (const dir of dirs) {
      const f = safeJoin(dir, path.slice(prefix.length));
      if (!f) return null;
      try { const st = await fsp.stat(f); if (st.isFile()) return { f, st }; } catch {}
    }
    return null;
  }
  return null;
}

function send(req, res, status, body, type, extra = {}) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
  const h = { 'Content-Type': type, ...extra };
  if (TEXT.test(type) && buf.length > 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    const gz = zlib.gzipSync(buf); h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding'; h['Content-Length'] = gz.length;
    res.writeHead(status, h); res.end(req.method === 'HEAD' ? undefined : gz); return;
  }
  h['Content-Length'] = buf.length;
  res.writeHead(status, h); res.end(req.method === 'HEAD' ? undefined : buf);
}
const json = (req, res, status, obj, extra) => send(req, res, status, JSON.stringify(obj), 'application/json; charset=utf-8', { 'Cache-Control': 'no-store', ...headersFor('/admin/api/'), ...extra });
const NOT_FOUND = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title><style>body{font:18px/1.5 Georgia,serif;max-width:32rem;margin:15vh auto;padding:0 1.5rem;color:#2a0a10}a{color:#8a1c2b}</style><h1>Page not found</h1><p>Sorry, there is nothing at this address. <a href="/">Go to the St. Clement Parish home page</a>.</p>';
const notFound = (req, res) => send(req, res, 404, NOT_FOUND, 'text/html; charset=utf-8', headersFor('/404', { 'Cache-Control': 'no-cache' }));

async function serveFile(req, res, path, hit, extra = {}) {
  const type = MIME[extname(hit.f).toLowerCase()] || 'application/octet-stream';
  const etag = '"' + hit.st.size.toString(36) + '-' + Math.floor(hit.st.mtimeMs).toString(36) + '"';
  const h = headersFor(path, { ETag: etag, 'Last-Modified': hit.st.mtime.toUTCString(), ...extra });
  if (!h['Cache-Control']) h['Cache-Control'] = path.startsWith('/fonts/') ? 'public, max-age=2592000' : 'public, max-age=86400';
  if (type === 'application/pdf') h['Content-Disposition'] = 'inline';
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, h); res.end(); return; }
  send(req, res, 200, await fsp.readFile(hit.f), type, h);
}

// ───────────────────────── content, history, media
const contentFile = n => join(D.content, n + '.json');
const version = buf => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
const readContent = async n => { const buf = await fsp.readFile(contentFile(n)); return { data: JSON.parse(buf), version: version(buf) }; };
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');
const slugUser = u => u.replace(/[^a-z0-9@._-]/gi, '_').slice(0, 60);
async function backup(n, user, note) {
  const dir = join(D.history, n); await fsp.mkdir(dir, { recursive: true });
  await fsp.copyFile(contentFile(n), join(dir, stamp() + '~' + slugUser(user) + (note ? '~' + note : '') + '.json'));
  const all = (await fsp.readdir(dir)).filter(f => f.endsWith('.json')).sort();
  for (const f of all.slice(0, Math.max(0, all.length - KEEP))) await fsp.unlink(join(dir, f)).catch(() => {});
}
async function writeAtomic(f, data) { const tmp = f + '.' + process.pid + '.tmp'; await fsp.writeFile(tmp, data); await fsp.rename(tmp, f); }

// Per-file queue so two saves never interleave.
const queues = new Map();
const serial = (n, fn) => { const p = (queues.get(n) || Promise.resolve()).then(fn, fn); queues.set(n, p.catch(() => {})); return p; };

const URL_OK = /^(https?:\/\/|mailto:|tel:|#|\/?(img|files|fonts)\/|$)/i;
// Clean what an editor sent: complete it against the schema, sanitise HTML, check that tags are closed, add
// typography (times kept with am/pm, no single last word) to text that changed, and refuse unsafe links.
function prepare(name, data, prev) {
  const errors = [];
  const walk = (fields, v, p, old) => {
    for (const f of fields) {
      const path = p + f.key;
      if (f.type === 'pair') {
        for (const l of ['en', 'fr']) { const k = f.key + '_' + l; v[k] = text(f, v[k], old && old[k], path + '_' + l); }
        continue;
      }
      v[f.key] = value(f, v[f.key], old && old[f.key], path);
    }
    return v;
  };
  const text = (f, s, o, path) => {
    s = String(s ?? '');
    if (s === o) return s;
    s = clean(s).replace(/\r\n?/g, '\n');
    if (!f.long) s = s.replace(/\n/g, ' ');
    if (f.plain) s = s.replace(/<[^>]*>/g, '');
    const bad = checkTags(s); if (bad) errors.push({ path, message: bad });
    return f.plain || f.notypo ? s : typo(s);
  };
  const value = (f, x, o, path) => {
    switch (f.type) {
      case 'bi': return { en: text(f, x.en, o && o.en, path + '.en'), fr: text(f, x.fr, o && o.fr, path + '.fr') };
      case 'obj': return walk(f.fields, x, path + '.', o);
      case 'list': return x.map((it, i) => { const oi = Array.isArray(o) ? o[i] : undefined;
        return f.of ? value(f.of, it, oi, path + '.' + i) : walk(f.fields, it, path + '.' + i + '.', oi); });
      case 'image':
        if (x.src && !URL_OK.test(x.src)) errors.push({ path: path + '.src', message: 'unsupported image address' });
        if (f.noalt) return x;
        x.alt = { en: text({ plain: true }, x.alt.en, o && o.alt && o.alt.en, path + '.alt.en'), fr: text({ plain: true }, x.alt.fr, o && o.alt && o.alt.fr, path + '.alt.fr') };
        return x;
      case 'url': case 'file': x = String(x).trim(); if (!URL_OK.test(x)) errors.push({ path, message: 'links must start with https://, mailto:, tel:, # or a site path' }); return x;
      case 'tel': x = String(x).replace(/[^\d+]/g, ''); return x;
      case 'email': x = String(x).trim(); if (x && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(x)) errors.push({ path, message: 'not an e-mail address' }); return x;
      case 'time': x = String(x).trim(); if (x && !/^\d{2}:\d{2}$/.test(x)) errors.push({ path, message: 'use HH:MM, e.g. 07:30 or 19:30' }); return x;
      case 'date': x = String(x).trim(); if (x && !/^\d{4}-\d{2}-\d{2}$/.test(x)) errors.push({ path, message: 'use YYYY-MM-DD' }); return x;
      case 'num': return x === '' ? '' : String(Math.max(f.min ?? -Infinity, Math.min(f.max ?? Infinity, +x || 0)));
      case 'select': return f.options.some(([k]) => k === x) ? x : (f.def ?? f.options[0][0]);
      case 'str': case 'text': {
        const t = text({ ...f, long: f.type === 'text', plain: !f.html, notypo: true }, x, o, path);
        return f.html ? t : t.replace(/</g, '');
      }
      default: return x;
    }
  };
  const out = walk(FILES[name], fill(FILES[name], data), '', prev);
  return { out, errors };
}

async function mediaList() {
  const out = [];
  const add = async (dir, urlBase, uploaded) => {
    let names = []; try { names = await fsp.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const d of names) {
      if (d.name.startsWith('.')) continue;
      if (d.isDirectory()) { if (!uploaded && d.name !== 'uploads' && d.name !== 'brand') await add(join(dir, d.name), urlBase + d.name + '/', uploaded); continue; }
      const ext = extname(d.name).toLowerCase(); if (!['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext)) continue;
      const f = join(dir, d.name), st = await fsp.stat(f);
      let w = '', h = '';
      if (ext !== '.pdf') { const fh = await fsp.open(f, 'r'); const b = Buffer.alloc(Math.min(st.size, 65536)); await fh.read(b, 0, b.length, 0); await fh.close(); const s = imageSize(b); if (s) { w = s.w; h = s.h; } }
      out.push({ url: urlBase + d.name, name: d.name, type: ext === '.pdf' ? 'pdf' : 'image', size: st.size, w, h, uploaded, time: st.mtimeMs });
    }
  };
  await add(D.img, 'img/uploads/', true); await add(D.files, 'files/', true);
  await add(join(ROOT, 'img', 'uploads'), 'img/uploads/', true);
  await add(join(ROOT, 'img'), 'img/', false);
  const seen = new Set();
  return out.filter(m => !seen.has(m.url) && seen.add(m.url)).sort((a, b) => (b.uploaded - a.uploaded) || (b.time - a.time));
}

function safeName(raw, ext) {
  let s = String(raw || '').replace(/\.[^.]*$/, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return (s || 'file') + '.' + ext;
}

// ───────────────────────── request body helpers
function readBody(req, max) {
  return new Promise((ok, no) => {
    const len = +req.headers['content-length'];
    if (len > max) { no(Object.assign(new Error('too large'), { status: 413 })); req.resume(); return; }
    const chunks = []; let n = 0;
    const onData = c => {
      n += c.length;
      if (n <= max) { chunks.push(c); return; }
      req.off('data', onData); chunks.length = 0; req.resume();         // discard the rest, then answer 413
      no(Object.assign(new Error('too large'), { status: 413 }));
    };
    req.on('data', onData);
    req.on('end', () => ok(Buffer.concat(chunks))); req.on('error', no);
  });
}

// ───────────────────────── login page (no JavaScript needed)
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const loginPage = (msg = '', email = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Sign in · St. Clement Parish editor</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f6f1ea;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#2a1a1c}
form{background:#fff;padding:2rem;border-radius:14px;box-shadow:0 10px 40px rgba(42,10,16,.12);width:min(24rem,92vw)}h1{font:600 1.5rem Georgia,serif;margin:0 0 .3rem;color:#5a1020}p{margin:0 0 1.2rem;color:#6b5b5d}
label{display:block;font-weight:600;margin:.9rem 0 .3rem}input{width:100%;padding:.7rem .8rem;border:1px solid #cdbfb9;border-radius:8px;font:inherit}input:focus{outline:2px solid #b58a2a;border-color:#b58a2a}
button{margin-top:1.4rem;width:100%;padding:.8rem;border:0;border-radius:8px;background:#5a1020;color:#fff;font:600 1rem system-ui,sans-serif;cursor:pointer}button:hover{background:#7a1a2c}
.err{background:#fdecec;color:#8a1020;border-radius:8px;padding:.6rem .8rem;margin:0 0 1rem}</style></head><body>
<form method="post" action="/admin/login"><h1>St. Clement Parish</h1><p>Sign in to edit the website.</p>${msg ? `<div class="err" role="alert">${esc(msg)}</div>` : ''}
<label for="e">E-mail</label><input id="e" name="email" type="email" autocomplete="username" required value="${esc(email)}" autofocus>
<label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password" required>
<button type="submit">Sign in</button></form></body></html>`;

// ───────────────────────── admin routes
const ADMIN_FILES = { 'index.html': 'index.html', 'admin.js': 'admin.js', 'admin.css': 'admin.css', 'schema.js': 'schema.js', 'text.js': 'text.js' };

async function admin(req, res, path) {
  const method = req.method;
  if (path === '/admin') { res.writeHead(301, headersFor('/admin/', { Location: '/admin/' })); res.end(); return; }

  if (path === '/admin/login' && method === 'POST') {
    if (!sameOrigin(req)) { send(req, res, 403, loginPage('Please sign in from this page.'), 'text/html; charset=utf-8', headersFor('/admin/')); return; }
    let email = '', pw = '';
    try { const q = new URLSearchParams((await readBody(req, 8192)).toString()); email = String(q.get('email') || '').trim().toLowerCase().slice(0, 200); pw = String(q.get('password') || '').slice(0, 500); }
    catch { send(req, res, 413, loginPage('That request was too large.'), 'text/html; charset=utf-8', headersFor('/admin/')); return; }
    const ip = clientIp(req), wait = tooMany('ip:' + ip, 20) || tooMany('u:' + email, 5);
    if (wait) { log('login blocked (rate limit)', email, ip); send(req, res, 429, loginPage(`Too many failed attempts. Please wait ${wait} minute${wait > 1 ? 's' : ''} and try again.`, email), 'text/html; charset=utf-8', headersFor('/admin/', { 'Retry-After': String(wait * 60) })); return; }
    if (email && pw && await checkPassword(email, pw)) {
      fails.delete('u:' + email);
      log('login', email);
      res.writeHead(303, headersFor('/admin/', { Location: '/admin/', 'Set-Cookie': cookie(newSession(email), SESSION_H * 3600) })); res.end(); return;
    }
    fail('ip:' + ip); fail('u:' + email);
    log('login failed', email, ip);
    send(req, res, 401, loginPage('That e-mail and password do not match.', email), 'text/html; charset=utf-8', headersFor('/admin/')); return;
  }

  const s = getSession(req);
  if (path === '/admin/logout' && method === 'POST') {
    if (s && sameOrigin(req)) { sessions.delete(s.key); saveSessions(); log('logout', s.u); }
    res.writeHead(303, headersFor('/admin/', { Location: '/admin/', 'Set-Cookie': cookie('', 0) })); res.end(); return;
  }

  if (!path.startsWith('/admin/api/')) {
    if (method !== 'GET' && method !== 'HEAD') { send(req, res, 405, 'Method not allowed', 'text/plain; charset=utf-8', headersFor('/admin/')); return; }
    if (!s) { if (path === '/admin/' || path === '/admin/index.html') send(req, res, 200, loginPage(), 'text/html; charset=utf-8', headersFor('/admin/')); else send(req, res, 401, 'Please sign in at /admin/', 'text/plain; charset=utf-8', headersFor('/admin/')); return; }
    const name = path === '/admin/' ? 'index.html' : ADMIN_FILES[path.slice(7)];
    if (!name) { notFound(req, res); return; }
    const f = join(ROOT, 'admin', name);
    send(req, res, 200, await fsp.readFile(f), MIME[extname(f)], headersFor('/admin/')); return;
  }

  // JSON API: always needs a session; anything that changes data also needs the CSRF token and a same-origin request.
  if (!s) { json(req, res, 401, { error: 'Your session has ended. Please sign in again.' }); return; }
  if (method !== 'GET' && method !== 'HEAD') {
    const t = Buffer.from(String(req.headers['x-csrf-token'] || '')), want = Buffer.from(s.csrf);
    if (!sameOrigin(req) || t.length !== want.length || !crypto.timingSafeEqual(t, want)) { json(req, res, 403, { error: 'Security check failed. Reload the editor and try again.' }); return; }
  }
  const api = path.slice('/admin/api/'.length).split('/');
  const nameOk = n => NAMES.includes(n);

  if (api[0] === 'session' && method === 'GET') { json(req, res, 200, { user: s.u, csrf: s.csrf, expires: s.exp }); return; }

  if (api[0] === 'content' && nameOk(api[1]) && api.length === 2) {
    const n = api[1];
    if (method === 'GET') { const c = await readContent(n); json(req, res, 200, { data: fill(FILES[n], c.data), version: c.version }); return; }
    if (method === 'PUT') {
      let body; try { body = JSON.parse(await readBody(req, MAX_JSON)); } catch (e) { json(req, res, e.status || 400, { error: e.status === 413 ? 'Too much data.' : 'Invalid data.' }); return; }
      if (!body || typeof body.data !== 'object' || Array.isArray(body.data)) { json(req, res, 400, { error: 'Invalid data.' }); return; }
      await serial(n, async () => {
        const cur = await readContent(n);
        if (body.baseVersion !== cur.version) { json(req, res, 409, { error: 'Someone else saved this section after you opened it. Reload to see their changes, then make yours again.', version: cur.version }); return; }
        const { out, errors } = prepare(n, body.data, fill(FILES[n], cur.data));
        if (errors.length) { json(req, res, 422, { error: 'Please fix the highlighted fields.', errors }); return; }
        const buf = Buffer.from(JSON.stringify(out, null, 2) + '\n');
        if (version(buf) === cur.version) { json(req, res, 200, { data: out, version: cur.version, unchanged: true }); return; }
        await backup(n, s.u);
        await writeAtomic(contentFile(n), buf);
        try { rebuild('saved ' + n + ' by ' + s.u); }
        catch (e) { await writeAtomic(contentFile(n), JSON.stringify(cur.data, null, 2) + '\n'); rebuild('rolled back'); log('build failed, change rolled back', e.stack); json(req, res, 500, { error: 'The page could not be built with this change, so it was not saved.' }); return; }
        log('saved', n, 'by', s.u);
        json(req, res, 200, { data: out, version: version(buf) });
      });
      return;
    }
  }

  if (api[0] === 'history' && nameOk(api[1]) && method === 'GET') {
    const dir = join(D.history, api[1]);
    if (api.length === 2) {
      let files = []; try { files = (await fsp.readdir(dir)).filter(f => f.endsWith('.json')).sort().reverse(); } catch {}
      json(req, res, 200, { items: files.map(f => { const [t, u, note] = f.slice(0, -5).split('~'); return { id: f.slice(0, -5), time: t.replace(/^(\d{4}-\d\d-\d\d)T(\d\d)-(\d\d)-(\d\d)-(\d+)Z$/, '$1T$2:$3:$4.$5Z'), user: u, note: note || '' }; }) }); return;
    }
    const f = safeJoin(dir, api[2] + '.json');
    if (api.length === 3 && f && existsSync(f)) { json(req, res, 200, { data: fill(FILES[api[1]], JSON.parse(await fsp.readFile(f))) }); return; }
    json(req, res, 404, { error: 'Not found.' }); return;
  }

  if (api[0] === 'restore' && nameOk(api[1]) && api.length === 2 && method === 'POST') {
    const n = api[1];
    let body; try { body = JSON.parse(await readBody(req, 4096)); } catch { json(req, res, 400, { error: 'Invalid data.' }); return; }
    const f = safeJoin(join(D.history, n), String(body.id || '') + '.json');
    if (!f || !existsSync(f)) { json(req, res, 404, { error: 'That version no longer exists.' }); return; }
    await serial(n, async () => {
      const cur = await readContent(n);
      await backup(n, s.u, 'before-restore');
      await fsp.copyFile(f, contentFile(n));
      try { rebuild('restored ' + n + ' by ' + s.u); }
      catch (e) { await writeAtomic(contentFile(n), JSON.stringify(cur.data, null, 2) + '\n'); rebuild('rolled back'); json(req, res, 500, { error: 'That version could not be built, so it was not restored.' }); return; }
      log('restored', n, body.id, 'by', s.u);
      const c = await readContent(n);
      json(req, res, 200, { data: fill(FILES[n], c.data), version: c.version });
    });
    return;
  }

  if (api[0] === 'media' && api.length === 1 && method === 'GET') { json(req, res, 200, { items: await mediaList() }); return; }

  if (api[0] === 'upload' && api.length === 1 && method === 'POST') {
    let buf; try { buf = await readBody(req, MAX_UPLOAD); } catch (e) { json(req, res, e.status || 400, { error: e.status === 413 ? 'Files can be at most 15 MB.' : 'Upload failed.' }); return; }
    const kind = sniff(buf);
    if (!kind) { json(req, res, 415, { error: 'Only JPG, PNG, WebP images and PDF files can be uploaded.' }); return; }
    const dir = kind === 'pdf' ? D.files : D.img, urlBase = kind === 'pdf' ? 'files/' : 'img/uploads/';
    let raw = ''; try { raw = decodeURIComponent(String(req.headers['x-filename'] || '')); } catch {}
    let name = safeName(basename(raw), kind === 'jpg' ? 'jpg' : kind);
    for (let i = 2; existsSync(join(dir, name)) || existsSync(join(ROOT, 'img', 'uploads', name)); i++) name = name.replace(/(-\d+)?\.(\w+)$/, '-' + i + '.$2');
    await writeAtomic(join(dir, name), buf);
    const dim = kind === 'pdf' ? null : imageSize(buf);
    log('upload', urlBase + name, buf.length, 'bytes by', s.u);
    json(req, res, 201, { url: urlBase + name, name, type: kind === 'pdf' ? 'pdf' : 'image', w: dim ? dim.w : '', h: dim ? dim.h : '', size: buf.length }); return;
  }

  json(req, res, 404, { error: 'Not found.' });
}

// ───────────────────────── server
const server = http.createServer(async (req, res) => {
  let path;
  try {
    const u = new URL(req.url, 'http://x');
    path = decodeURIComponent(u.pathname);
    if (path.includes('\0') || path.includes('\\')) throw 0;
  } catch { send(req, res, 400, 'Bad request', 'text/plain; charset=utf-8', BASE); return; }
  try {
    if (path === '/healthz') { send(req, res, 200, 'ok', 'text/plain; charset=utf-8', { 'Cache-Control': 'no-store' }); return; }
    if (path === '/admin' || path.startsWith('/admin/')) { await admin(req, res, path); return; }
    if (req.method !== 'GET' && req.method !== 'HEAD') { send(req, res, 405, 'Method not allowed', 'text/plain; charset=utf-8', { ...BASE, Allow: 'GET, HEAD' }); return; }
    if (path === '/' || path === '/index.html') {
      const h = headersFor('/', { ETag: page.etag, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding' });
      if (req.headers['if-none-match'] === page.etag) { res.writeHead(304, h); res.end(); return; }
      const gz = /\bgzip\b/.test(req.headers['accept-encoding'] || ''), body = gz ? page.gz : page.body;
      if (gz) h['Content-Encoding'] = 'gzip';
      res.writeHead(200, { ...h, 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length }); res.end(req.method === 'HEAD' ? undefined : body); return;
    }
    const m = /^\/content\/([a-z]+)\.json$/.exec(path);
    if (m && NAMES.includes(m[1])) { const f = contentFile(m[1]); await serveFile(req, res, path, { f, st: statSync(f) }, { 'Cache-Control': 'no-cache' }); return; }
    const hit = await fileFor(path);
    if (hit) { await serveFile(req, res, path, hit); return; }
    notFound(req, res);
  } catch (e) {
    log('error', req.method, path, e.stack || e);
    if (!res.headersSent) send(req, res, 500, 'Something went wrong.', 'text/plain; charset=utf-8', BASE); else res.end();
  }
});
server.requestTimeout = 120e3; server.headersTimeout = 30e3;

await loadUsers();
// Sessions of editors removed from ADMIN_USERS stop working at once.
for (const [k, v] of sessions) if (!USERS.has(v.u)) sessions.delete(k);
server.listen(PORT, () => log(`St. Clement site on http://localhost:${PORT}  (data: ${DATA})`));
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { log('shutting down'); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 3000).unref(); });
