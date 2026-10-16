// St. Clement Parish website editor. Plain browser JavaScript, no libraries; the fields come from schema.js.
import { FILES, NAV, empty, fill, norm } from './schema.js';
import { checkTags } from './text.js';

const $ = (sel, el = document) => el.querySelector(sel);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'class') e.className = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k instanceof Node ? k : String(k));
  return e;
};
const ANCHOR = { seo: '', contactinfo: '#contact', header: '#top', hero: '#top', new: '#new', gallery: '#gallery', reviews: '#reviews', band1: '#reviews',
  mass: '#mass', schedule: '#mass', week: '#mass', watch: '#watch', visit: '#visit', sacraments: '#sacraments', life: '#life', events: '#life',
  clergy: '#clergy', history: '#history', band2: '#give', give: '#give', news: '#bulletin', bulletins: '#bulletin', contact: '#contact', footer: '#contact', misc: '' };

let S = null;                       // session: { user, csrf }
const cache = {};                   // file name → { data, version, dirty }
let view = null, fieldEls = new Map(), media = null;

// ───────────────────────── server calls
async function api(path, opt = {}) {
  const o = { method: opt.method || 'GET', headers: { ...(opt.headers || {}) }, credentials: 'same-origin' };
  if (o.method !== 'GET') o.headers['X-CSRF-Token'] = S ? S.csrf : '';
  if (opt.json !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(opt.json); }
  else if (opt.body) o.body = opt.body;
  let r;
  try { r = await fetch('/admin/api/' + path, o); } catch { throw Object.assign(new Error('No connection to the server. Check your internet connection and try again.'), { status: 0 }); }
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) { toast('Your session has ended. Please sign in again.', 'err'); setTimeout(() => location.reload(), 1500); }
  if (!r.ok) throw Object.assign(new Error(j.error || 'Something went wrong (' + r.status + ').'), { status: r.status, body: j });
  return j;
}

let tt = 0;
function toast(msg, kind = '') {
  const t = $('#toast'); t.textContent = msg; t.className = 'on ' + kind;
  clearTimeout(tt); tt = setTimeout(() => t.className = '', kind === 'err' ? 7000 : 3500);
}

// ───────────────────────── sidebar and routing
function sidebar() {
  const nav = $('#side'); nav.textContent = '';
  for (const n of NAV) {
    if (n.group) { nav.append(h('h2', {}, n.group)); continue; }
    const c = cache[n.file];
    nav.append(h('a', { href: '#' + n.id, class: (n.sub ? 'sub ' : '') + (view && view.id === n.id ? 'on' : ''), 'aria-current': view && view.id === n.id ? 'page' : null },
      n.label, c && c.dirty ? h('i', { title: 'Unsaved changes' }, ' ●') : null));
  }
}
async function route() {
  const id = location.hash.slice(1), v = NAV.find(n => n.id === id);
  if (!v) { view = null; sidebar(); return; }
  view = v; sidebar();
  const main = $('#main');
  if (!cache[v.file]) {
    main.textContent = ''; main.append(h('p', { class: 'loading' }, 'Loading…'));
    try { const r = await api('content/' + v.file); cache[v.file] = { data: r.data, version: r.version, dirty: false }; }
    catch (e) { main.textContent = ''; main.append(h('p', { class: 'msg err' }, e.message)); return; }
    if (view !== v) return;
  }
  draw();
}

// ───────────────────────── the form
const fieldsOf = v => FILES[v.file].filter(f => !v.keys || v.keys.includes(f.key));
function draw() {
  const v = view, c = cache[v.file], main = $('#main');
  fieldEls = new Map();
  main.textContent = '';
  const a = ANCHOR[v.id];
  main.append(
    h('div', { class: 'bar' },
      h('h1', {}, v.label),
      a !== '' && a != null ? h('a', { class: 'tb', href: '/' + a, target: '_blank', rel: 'noopener' }, 'Show on the page ↗') : null,
      h('span', { class: 'sp' }),
      h('button', { class: 'tb', type: 'button', onclick: () => history(v.file) }, 'History'),
      h('button', { class: 'save', type: 'button', id: 'save', disabled: !c.dirty, onclick: save }, c.dirty ? 'Save' : 'Saved')),
    h('div', { class: 'form' }, fieldsOf(v).map(f => field(f, c.data, f.key))));
  main.focus({ preventScroll: true });
}
function changed() {
  const c = cache[view.file];
  if (!c.dirty) { c.dirty = true; sidebar(); }
  const b = $('#save'); if (b) { b.disabled = false; b.textContent = 'Save'; }
}
const help = f => f.help ? h('p', { class: 'help' }, f.help) : null;
const reg = (path, el) => { fieldEls.set(path, el); return el; };

// One field. `o[k]` is the value; `path` names it for error messages from the server.
function field(f, o, k, path = k) {
  if (f.type === 'hidden') return null;
  const wrap = (body, cls = '') => h('div', { class: 'f ' + cls + (f.adv ? ' adv' : '') }, f.label ? h('label', { class: 'l' }, f.label) : null, body, help(f));
  switch (f.type) {
    case 'bi': {
      if (!o[k] || typeof o[k] !== 'object') o[k] = norm(f, o[k]);
      return wrap(h('div', { class: 'two' }, lang(f, o[k], 'en', path + '.en'), lang(f, o[k], 'fr', path + '.fr')), 'bi');
    }
    case 'pair':
      return wrap(h('div', { class: 'two' }, lang(f, o, 'en', path + '_en', k + '_en'), lang(f, o, 'fr', path + '_fr', k + '_fr')), 'bi');
    case 'obj':
      if (!o[k] || typeof o[k] !== 'object') o[k] = empty(f);
      return h('fieldset', { class: 'obj' + (f.adv ? ' adv' : '') }, h('legend', {}, f.label), help(f), f.fields.map(g => field(g, o[k], g.key, path + '.' + g.key)));
    case 'list': return list(f, o, k, path);
    case 'image': return wrap(image(f, o, k, path), 'img');
    case 'file': return wrap(fileField(f, o, k, path));
    case 'bool': {
      const i = h('input', { type: 'checkbox', checked: !!o[k], onchange: e => { o[k] = e.target.checked; changed(); } });
      return h('div', { class: 'f chk' + (f.adv ? ' adv' : '') }, h('label', {}, i, ' ', f.label), help(f));
    }
    case 'select': {
      const s = h('select', { onchange: e => { o[k] = e.target.value; changed(); } }, f.options.map(([val, lab]) => h('option', { value: val, selected: o[k] === val }, lab)));
      return wrap(reg(path, s));
    }
    default: {
      const type = { time: 'time', date: 'date', num: 'number', email: 'email', tel: 'tel' }[f.type] || 'text';
      const el = f.type === 'text'
        ? h('textarea', { rows: 3, oninput: e => { o[k] = e.target.value; changed(); } }, o[k] ?? '')
        : h('input', { type, value: o[k] ?? '', min: f.min, max: f.max, spellcheck: f.type === 'str' ? 'true' : 'false',
          placeholder: f.type === 'url' ? 'https://… or #section' : f.type === 'time' ? 'HH:MM' : null,
          oninput: e => { o[k] = e.target.value; changed(); } });
      return wrap(h('div', { class: 'one' }, reg(path, el), f.html ? tools(el, o, k) : null));
    }
  }
}

function lang(f, o, l, path, key = l) {
  const big = f.long || String(o[key] || '').length > 90;
  const el = big ? h('textarea', { rows: f.long ? 4 : 2, lang: l }, o[key] || '') : h('input', { type: 'text', value: o[key] || '', lang: l });
  const err = h('p', { class: 'ferr' });
  el.addEventListener('input', () => {
    o[key] = el.value; changed();
    const bad = f.plain ? null : checkTags(el.value); err.textContent = bad ? 'Check the formatting: ' + bad : ''; el.classList.toggle('bad', !!bad);
  });
  reg(path, el);
  return h('div', { class: 'lng' }, h('span', { class: 'tag' }, l === 'en' ? 'English' : 'Français'), el, f.plain ? null : tools(el, o, key), err);
}

// Small formatting buttons for a text box.
function tools(el, o, key) {
  const apply = (fn) => {
    const a = el.selectionStart, b = el.selectionEnd, v = el.value, sel = v.slice(a, b);
    const [ins, caret] = fn(sel);
    if (ins == null) return;
    el.value = v.slice(0, a) + ins + v.slice(b); o[key] = el.value; changed();
    el.focus(); const p = a + (caret ?? ins.length); el.setSelectionRange(p, p);
    el.dispatchEvent(new Event('input'));
  };
  const b = (label, title, fn) => h('button', { type: 'button', title, onmousedown: e => e.preventDefault(), onclick: () => apply(fn) }, label);
  return h('div', { class: 'tools' },
    b('Keep together', 'Keep the selected words on one line', s => s ? ['<span class="nw">' + s + '</span>'] : (toast('Select the words to keep together first.'), [null])),
    b('Fixed space', 'Insert a space that never breaks a line (&nbsp;)', s => ['&nbsp;']),
    b('B', 'Bold', s => ['<b>' + (s || 'text') + '</b>']),
    b('I', 'Italic', s => ['<i>' + (s || 'text') + '</i>']),
    b('Link', 'Turn the selected words into a link', s => {
      const u = prompt('Link address (https://…, mailto:…, tel:… or #section):', 'https://');
      if (!u || u === 'https://') return [null];
      if (!/^(https?:\/\/|mailto:|tel:|#)/i.test(u.trim())) { toast('Links must start with https://, mailto:, tel: or #', 'err'); return [null]; }
      const ext = /^https?:/i.test(u.trim()) ? ' target="_blank" rel="noopener"' : '';
      return ['<a href="' + u.trim().replace(/"/g, '%22') + '"' + ext + '>' + (s || 'link') + '</a>'];
    }));
}

const summaryOf = (f, it, i) => {
  let v = it;
  if (f.summary) for (const p of f.summary.split('.')) v = v == null ? v : v[p];
  if (v && typeof v === 'object') v = v.en || v.fr || '';
  const t = String(v ?? '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8239;/g, ' ').trim();
  return t || (f.of && typeof it === 'object' ? String(it.en || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : '') || (typeof it === 'string' ? it : '') || 'Item ' + (i + 1);
};
function list(f, o, k, path) {
  if (!Array.isArray(o[k])) o[k] = [];
  const arr = o[k], box = h('div', { class: 'items' });
  const open = new Set();
  const redraw = () => {
    box.textContent = '';
    arr.forEach((it, i) => {
      const body = f.of ? field({ ...f.of, label: null }, arr, i, path + '.' + i) : h('div', {}, f.fields.map(g => field(g, it, g.key, path + '.' + i + '.' + g.key)));
      const btn = (label, title, fn, dis) => h('button', { type: 'button', title, 'aria-label': title, disabled: dis, onclick: e => { e.preventDefault(); e.stopPropagation(); fn(); } }, label);
      const head = h('div', { class: 'ih' },
        f.of ? null : h('button', { type: 'button', class: 'tog', 'aria-expanded': String(open.has(it)), onclick: () => { open.has(it) ? open.delete(it) : open.add(it); redraw(); } },
          h('span', { class: 'num' }, i + 1), ' ', summaryOf(f, it, i)),
        h('span', { class: 'sp' }),
        btn('↑', 'Move up', () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; changed(); redraw(); }, i === 0),
        btn('↓', 'Move down', () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; changed(); redraw(); }, i === arr.length - 1),
        btn('✕', 'Remove', () => { if (confirm('Remove “' + summaryOf(f, it, i) + '”?')) { arr.splice(i, 1); changed(); redraw(); } }));
      box.append(h('div', { class: 'item' + (f.of ? ' prim' : '') }, head, f.of || open.has(it) ? h('div', { class: 'ib' }, body) : null));
    });
  };
  redraw();
  const add = h('button', { type: 'button', class: 'add', onclick: () => {
    const it = f.of ? empty(f.of) : fill(f.fields, {});
    if (f.addTop) arr.unshift(it); else arr.push(it);
    if (!f.of) open.add(it);
    changed(); redraw();
  } }, '+ Add ' + (f.addTop ? '(at the top)' : ''));
  return h('div', { class: 'f list' + (f.adv ? ' adv' : '') }, h('label', { class: 'l' }, f.label, ' ', h('small', {}, '(' + arr.length + ')')), help(f), box, add);
}

// ───────────────────────── images and files
const thumb = src => src ? h('img', { src: '/' + src.replace(/^\//, ''), alt: '', loading: 'lazy' }) : h('span', { class: 'none' }, 'No photo');
function image(f, o, k, path) {
  if (!o[k] || typeof o[k] !== 'object') o[k] = empty(f);
  const im = o[k], box = h('div', { class: 'imgw' });
  const set = m => {
    im.src = m.url; im.srcset = m.url; im.w = String(m.w || ''); im.h = String(m.h || '');
    for (const c of f.clears || []) { if (o[c] && typeof o[c] === 'object' && 'srcset' in o[c]) o[c] = empty({ type: 'image' }); else o[c] = ''; }
    changed(); draw();
  };
  box.append(h('div', { class: 'thumb' }, thumb(im.src || (im.srcset || '').split(/[ ,]/)[0])),
    h('div', { class: 'imgb' },
      h('div', { class: 'path' }, im.src || 'No photo chosen'),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'tb', onclick: () => pick('image', set) }, 'Choose from library'),
        uploadBtn('image', set),
        im.src || im.srcset ? h('button', { type: 'button', class: 'tb ghost', onclick: () => { if (confirm('Remove this photo?')) { Object.assign(im, { src: '', srcset: '', w: '', h: '' }); changed(); draw(); } } }, 'Remove') : null),
      f.noalt ? null : h('div', { class: 'two alt' },
        lang({ plain: true }, im.alt, 'en', path + '.alt.en'), lang({ plain: true }, im.alt, 'fr', path + '.alt.fr')),
      f.noalt ? null : h('p', { class: 'help' }, 'Describe what the photo shows (for screen readers and Google).')));
  reg(path + '.src', box);
  return box;
}
function fileField(f, o, k, path) {
  const inp = h('input', { type: 'text', value: o[k] || '', placeholder: f.accept === 'pdf' ? 'files/… or https://…' : 'img/…', oninput: e => { o[k] = e.target.value; changed(); } });
  const set = m => {
    o[k] = m.url; inp.value = m.url;
    for (const c of f.clears || []) o[c] = '';
    changed();
  };
  return h('div', { class: 'one' }, reg(path, inp), h('div', { class: 'row' },
    h('button', { type: 'button', class: 'tb', onclick: () => pick(f.accept || 'any', set) }, 'Choose'), uploadBtn(f.accept || 'any', set)));
}

const ACCEPT = { image: 'image/jpeg,image/png,image/webp', pdf: 'application/pdf', any: 'image/jpeg,image/png,image/webp,application/pdf' };
function uploadBtn(kind, done) {
  const inp = h('input', { type: 'file', accept: ACCEPT[kind], hidden: true, onchange: async () => { const fl = inp.files[0]; inp.value = ''; if (fl) { const m = await upload(fl); if (m) done(m); } } });
  return h('span', {}, inp, h('button', { type: 'button', class: 'tb', onclick: () => inp.click() }, 'Upload new'));
}
async function upload(fl) {
  if (fl.size > 15 * 1024 * 1024) { toast('That file is larger than 15 MB. Please make it smaller first.', 'err'); return null; }
  if (!/\.(jpe?g|png|webp|pdf)$/i.test(fl.name)) { toast('Only JPG, PNG, WebP images and PDF files can be uploaded.', 'err'); return null; }
  toast('Uploading ' + fl.name + '…');
  try {
    const m = await api('upload', { method: 'POST', body: fl, headers: { 'Content-Type': fl.type || 'application/octet-stream', 'X-Filename': encodeURIComponent(fl.name) } });
    media = null; toast('Uploaded ' + m.name + '.', 'ok'); return m;
  } catch (e) { toast(e.message, 'err'); return null; }
}

async function pick(kind, done) {
  const dlg = $('#dlg'), c = $('#dlgc');
  c.textContent = ''; c.append(h('p', {}, 'Loading the library…')); dlg.showModal();
  try { if (!media) media = (await api('media')).items; } catch (e) { c.textContent = e.message; return; }
  const q = h('input', { type: 'search', placeholder: 'Search by file name', oninput: () => grid() });
  const g = h('div', { class: 'grid' });
  const grid = () => {
    g.textContent = '';
    const t = q.value.toLowerCase();
    for (const m of media.filter(m => (kind === 'any' || m.type === kind) && m.name.toLowerCase().includes(t)).slice(0, 300))
      g.append(h('button', { type: 'button', class: 'mi', title: m.url + (m.w ? ' · ' + m.w + '×' + m.h : ''), onclick: () => { dlg.close(); done(m); } },
        m.type === 'pdf' ? h('span', { class: 'pdf' }, 'PDF') : h('img', { src: '/' + m.url, alt: '', loading: 'lazy' }),
        h('span', { class: 'mn' }, m.name), m.uploaded ? h('span', { class: 'new' }, 'uploaded') : null));
    if (!g.children.length) g.append(h('p', {}, 'Nothing found.'));
  };
  c.textContent = '';
  c.append(h('div', { class: 'dh' }, h('h2', {}, kind === 'pdf' ? 'Choose a file' : 'Choose a photo'), h('span', { class: 'sp' }),
    uploadBtn(kind, m => { dlg.close(); done(m); }), h('button', { type: 'button', class: 'tb', onclick: () => dlg.close() }, 'Cancel')), q, g);
  grid(); q.focus();
}

// ───────────────────────── save, history
async function save() {
  const v = view, c = cache[v.file], b = $('#save');
  for (const el of document.querySelectorAll('.bad-field')) el.classList.remove('bad-field');
  b.disabled = true; b.textContent = 'Saving…';
  try {
    const r = await api('content/' + v.file, { method: 'PUT', json: { data: c.data, baseVersion: c.version } });
    cache[v.file] = { data: r.data, version: r.version, dirty: false };
    toast(r.unchanged ? 'Nothing had changed.' : 'Saved. The website is updated.', 'ok');
    if (view === v) draw(); sidebar();
  } catch (e) {
    b.disabled = false; b.textContent = 'Save';
    if (e.status === 422 && e.body && e.body.errors) {
      let first = null;
      for (const er of e.body.errors) {
        const el = fieldEls.get(er.path) || [...fieldEls.entries()].find(([p]) => er.path.startsWith(p))?.[1];
        if (el) { el.classList.add('bad-field'); el.title = er.message; first ||= el; }
      }
      toast(e.message + ' ' + e.body.errors.map(x => x.message).filter((m, i, a) => a.indexOf(m) === i).join('; '), 'err');
      if (first) first.scrollIntoView({ block: 'center' });
    } else if (e.status === 409) {
      toast(e.message, 'err');
      if (confirm(e.message + '\n\nReload this section now? Your unsaved changes here will be lost.')) { delete cache[v.file]; route(); }
    } else toast(e.message, 'err');
  }
}

async function history(file) {
  const dlg = $('#dlg'), c = $('#dlgc');
  c.textContent = ''; c.append(h('p', {}, 'Loading…')); dlg.showModal();
  let items;
  try { items = (await api('history/' + file)).items; } catch (e) { c.textContent = e.message; return; }
  c.textContent = '';
  c.append(h('div', { class: 'dh' }, h('h2', {}, 'Earlier versions'), h('span', { class: 'sp' }), h('button', { type: 'button', class: 'tb', onclick: () => dlg.close() }, 'Close')),
    h('p', { class: 'help' }, 'Every save keeps the version it replaced (the last 50). Restoring also keeps the current version, so it can be undone.'),
    items.length ? h('ul', { class: 'hist' }, items.map(it => h('li', {},
      h('span', {}, new Date(it.time).toLocaleString(), h('small', {}, ' replaced by ', it.user, it.note === 'before-restore' ? ' (restore)' : '')),
      h('button', { type: 'button', class: 'tb', onclick: async () => {
        if (cache[file] && cache[file].dirty && !confirm('You have unsaved changes in this part of the site. Restoring will discard them. Continue?')) return;
        if (!confirm('Restore the version from ' + new Date(it.time).toLocaleString() + '? The website will be updated straight away.')) return;
        try { const r = await api('restore/' + file, { method: 'POST', json: { id: it.id } }); cache[file] = { data: r.data, version: r.version, dirty: false }; dlg.close(); toast('Restored. The website is updated.', 'ok'); route(); }
        catch (e) { toast(e.message, 'err'); }
      } }, 'Restore')))) : h('p', {}, 'No earlier versions yet.'));
}

// ───────────────────────── start
addEventListener('beforeunload', e => { if (Object.values(cache).some(c => c.dirty)) { e.preventDefault(); e.returnValue = ''; } });
addEventListener('hashchange', route);
$('#adv').addEventListener('change', e => document.body.classList.toggle('show-adv', e.target.checked));
$('#dlg').addEventListener('click', e => { if (e.target.id === 'dlg') e.target.close(); });
api('session').then(s => { S = s; $('#who').textContent = s.user; sidebar(); route(); }).catch(e => toast(e.message, 'err'));
