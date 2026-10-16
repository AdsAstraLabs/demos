// Tiny template engine for the St. Clement page (no dependencies).
// render(nodes, data) fills cms/page.html with content/*.json. match(nodes, html) is the exact inverse: it was used
// once to extract the seed content from the hand-written page, and the tests use it to prove the round trip.
//
// Tags:  {{s p}}  inline HTML, single language          {{e p}}  English of a bilingual field {en, fr}
//        {{f p}}  French of p, escaped for an attribute (falls back to English)
//        {{fa p}} ` data-fr="…"` only when p has French  {{fx alt p}}  ` data-fr-alt="…"` only when p has French
//        {{a p}}  plain text escaped for an attribute      {{em p}} e-mail address with <wbr> after the @
//        {{jst p}} {{jse p}} {{jsf p}} {{jsq p}}  the same values inside a JavaScript string literal
//        {{@n}} {{@n2}} item number (1, 01)    blocks: {{#each p}} {{#if p}} {{#unless p}} {{#ifeq p "v"}} … {{else}} … {{/…}}
// Paths: `.` is the current list item; a first segment naming a content file (site, hero, …) starts at the root,
//        anything else is read from the current list item.
import { clean, checkTags } from '../admin/text.js';

const ENT = /&(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g;
export const h = s => clean(String(s ?? '')).replace(ENT, '&amp;');
const attrH = s => h(s).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrP = s => String(s ?? '').replace(ENT, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const js = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')
  .replace(/<\/(script)/gi, '<\\/$1').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
const en = v => isObj(v) ? (v.en ?? '') : (v ?? '');
const fr = v => isObj(v) ? (v.fr || '') : '';
export const truthy = v => Array.isArray(v) ? v.length > 0
  : isObj(v) ? ('src' in v || 'srcset' in v ? !!(v.src || v.srcset) : 'en' in v ? !!v.en : Object.values(v).some(truthy)) : !!v;

// ---------- parsing
export function parse(src) {
  const root = { nodes: [] }, stack = [];
  const cur = () => stack.length ? (stack[stack.length - 1].inB ? stack[stack.length - 1].node.b : stack[stack.length - 1].node.a) : root.nodes;
  const re = /\{\{([\s\S]*?)\}\}/g; let m, last = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) cur().push({ type: 'text', text: src.slice(last, m.index) });
    last = re.lastIndex;
    const t = m[1].trim();
    if (t[0] === '#') {
      const [, kind, rest] = /^#(\w+)\s*(.*)$/.exec(t), args = rest.match(/"[^"]*"|\S+/g) || [];
      if (!['each', 'if', 'unless', 'ifeq'].includes(kind)) throw new Error('unknown block #' + kind);
      const node = { type: kind, path: args[0], value: args[1] && args[1].replace(/^"|"$/g, ''), a: [], b: [] };
      cur().push(node); stack.push({ node, inB: false });
    } else if (t === 'else') { if (!stack.length) throw new Error('{{else}} outside a block'); stack[stack.length - 1].inB = true; }
    else if (t[0] === '/') { const f = stack.pop(); if (!f || f.node.type !== t.slice(1)) throw new Error('unexpected {{' + t + '}} at ' + m.index); }
    else if (t[0] === '@') cur().push({ type: 'idx', name: t });
    else {
      const [fn, ...args] = t.split(/\s+/);
      if (!HELPERS[fn]) throw new Error('unknown tag {{' + t + '}}');
      cur().push({ type: 'var', fn, name: args.length > 1 ? args[0] : null, path: args[args.length - 1] });
    }
  }
  if (stack.length) throw new Error('unclosed {{#' + stack[stack.length - 1].node.type + '}}');
  if (last < src.length) cur().push({ type: 'text', text: src.slice(last) });
  return root.nodes;
}

// ---------- paths
export const ROOTS = new Set(['site', 'hero', 'new', 'gallery', 'reviews', 'bands', 'mass', 'watch', 'visit', 'sacraments', 'life',
  'clergy', 'history', 'give', 'news', 'contact', 'footer', 'bulletins', 'schedule', 'week', 'events']);
function base(path, sc) {
  const top = sc.items.length ? sc.items[sc.items.length - 1] : sc.root;
  if (path === '.') return { obj: top, keys: [] };
  const keys = path.split('.');
  return { obj: ROOTS.has(keys[0]) ? sc.root : top, keys };
}
function get(path, sc) {
  if (path === '@first') return sc.idx[sc.idx.length - 1] === 0;
  let { obj, keys } = base(path, sc);
  for (const k of keys) { if (obj == null) return undefined; obj = obj[k]; }
  return obj;
}

// ---------- rendering
const HELPERS = {
  s: v => h(en(v)), e: v => h(en(v)), f: v => attrH(fr(v) || en(v)), a: v => attrP(en(v)), em: v => h(en(v)).replace('@', '@<wbr>'),
  fa: v => fr(v) ? ' data-fr="' + attrH(fr(v)) + '"' : '', fx: (v, n) => fr(v) ? ' data-fr-' + n + '="' + attrP(fr(v)) + '"' : '',
  jst: v => js(en(v)), jse: v => js(h(en(v))), jsf: v => js(attrH(fr(v) || en(v))), jsq: v => js(attrP(en(v))),
};
export function render(nodes, data) {
  const sc = { root: data, items: [], idx: [] }, out = [];
  const run = ns => { for (const n of ns) {
    if (n.type === 'text') out.push(n.text);
    else if (n.type === 'var') out.push(HELPERS[n.fn](get(n.path, sc), n.name));
    else if (n.type === 'idx') { const i = sc.idx[sc.idx.length - 1] + 1; out.push(n.name === '@n2' ? String(i).padStart(2, '0') : String(i)); }
    else if (n.type === 'each') { const arr = get(n.path, sc); if (!Array.isArray(arr)) continue;
      arr.forEach((it, i) => { sc.items.push(it); sc.idx.push(i); run(n.a); sc.items.pop(); sc.idx.pop(); }); }
    else { const v = get(n.path, sc); const ok = n.type === 'ifeq' ? en(v) === n.value : n.type === 'unless' ? !truthy(v) : truthy(v); run(ok ? n.a : n.b); }
  } };
  run(nodes);
  return out.join('');
}

// ---------- matching (inverse of render)
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
const unent = s => s.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (NAMED[e] ?? m));
export const normInner = s => s.replace(/&amp;(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g, '&').replace(/\u00a0/g, '&nbsp;').replace(/\u202f/g, '&#8239;');
const unjs = s => s.replace(/\\(u[0-9a-fA-F]{4}|[\s\S])/g, (m, c) => c.length > 1 ? String.fromCharCode(parseInt(c.slice(1), 16)) : c === 'n' ? '\n' : c === 'r' ? '\r' : c);
const INV = {
  s: r => [null, normInner(r)], e: r => ['en', normInner(r)], f: r => ['fr', normInner(unent(r))], a: r => [null, normInner(unent(r))],
  em: r => [null, normInner(unent(r.replace('@<wbr>', '@')))], jst: r => [null, unjs(r)], jse: r => ['en', normInner(unjs(r))],
  jsf: r => ['fr', normInner(unent(unjs(r)))], jsq: r => [null, normInner(unent(unjs(r)))], fa: r => ['fr', normInner(unent(r))], fx: r => ['fr', normInner(unent(r))],
};
const INATTR = new Set(['f', 'a']), JS = new Set(['jst', 'jse', 'jsf', 'jsq']);

export function match(nodes, src) {
  const data = {}, trail = [], sc = { root: data, items: [], idx: [] };
  const loose = v => JSON.stringify(v).replace(/&nbsp;|&#8239;/g, ' '), nbs = v => (JSON.stringify(v).match(/&nbsp;|&#8239;/g) || []).length;
  const undo = mark => { while (trail.length > mark) { const [o, k, had, pv] = trail.pop(); if (had) o[k] = pv; else if (Array.isArray(o) && /^\d+$/.test(String(k))) o.length = Math.min(o.length, +k); else delete o[k]; } };
  const setv = (path, sub, v) => {             // bind a value, or check it equals an earlier binding of the same path
    let { obj, keys } = base(path, sc); if (sub) keys = [...keys, sub];
    if (!keys.length) return false;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (obj[k] == null) { trail.push([obj, k, false]); obj[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}; }
      else if (typeof obj[k] !== 'object') { if (obj[k] !== '') return false; trail.push([obj, k, true, '']); obj[k] = {}; }
      obj = obj[k];
    }
    const k = keys[keys.length - 1];
    if (k in obj) {                            // the page sometimes has a plain space where another copy has &nbsp;: keep the &nbsp; one
      if (JSON.stringify(obj[k]) === JSON.stringify(v)) return true;
      if (loose(obj[k]) !== loose(v)) return false;
      if (nbs(v) > nbs(obj[k])) { trail.push([obj, k, true, obj[k]]); obj[k] = v; }
      return true;
    }
    trail.push([obj, k, false]); obj[k] = v; return true;
  };
  let best = 0, steps = 0;
  const seq = (ns, i, pos, k) => {
    if (pos > best) best = pos;
    if (++steps > 5e6) { const e = new Error('template does not match the page (gave up) near offset ' + best); e.offset = best; throw e; }
    if (i === ns.length) return k(pos);
    const n = ns[i], next = p => seq(ns, i + 1, p, k);
    if (n.type === 'text') return src.startsWith(n.text, pos) && next(pos + n.text.length);
    if (n.type === 'idx') { const j = sc.idx[sc.idx.length - 1] + 1, t = n.name === '@n2' ? String(j).padStart(2, '0') : String(j); return src.startsWith(t, pos) && next(pos + t.length); }
    if (n.type === 'var') {
      const cap = (start, after) => {
        let ends = [];
        const nt = ns[i + 1];
        if (n.fn === 'fa' || n.fn === 'fx') { const e = src.indexOf('"', start); if (e >= 0) ends = [e]; }
        else if (JS.has(n.fn)) { const lim = start + /^(?:[^'"\\\n]|\\[\s\S])*/.exec(src.slice(start, start + 50000))[0].length;
          if (nt && nt.type === 'text') { for (let e = src.indexOf(nt.text, start); e >= 0 && e <= lim; e = src.indexOf(nt.text, e + 1)) ends.push(e); } else ends = [lim]; }
        else { if (!nt || nt.type !== 'text') throw new Error('{{' + n.fn + ' ' + n.path + '}} must be followed by plain text in the template');
          const lim = INATTR.has(n.fn) ? src.indexOf('"', start) : start + 60000;
          for (let e = src.indexOf(nt.text, start); e >= 0 && e <= lim; e = src.indexOf(nt.text, e + 1)) ends.push(e); }
        for (const e of ends) {
          const raw = src.slice(start, e);
          if ((n.fn === 's' || n.fn === 'e') && (raw.includes('\n') || checkTags(raw))) continue;
          const [sub, v] = INV[n.fn](raw), mark = trail.length;
          if (setv(n.path, sub, v) && after(e)) return true;
          undo(mark);
        }
        return false;
      };
      if (n.fn === 'fa' || n.fn === 'fx') {
        const pre = n.fn === 'fa' ? ' data-fr="' : ' data-fr-' + n.name + '="';
        if (src.startsWith(pre, pos) && cap(pos + pre.length, e => next(e + 1))) return true;
        const mark = trail.length; if (setv(n.path, 'fr', '') && next(pos)) return true; undo(mark); return false;
      }
      return cap(pos, next);
    }
    if (n.type === 'each') {
      const mark = trail.length; let arr = get(n.path, sc); const fresh = arr === undefined;
      if (fresh) { if (!setv(n.path, null, [])) return false; arr = get(n.path, sc); }
      if (!Array.isArray(arr)) { undo(mark); return arr === '' && next(pos); }
      const fixed = arr.__done ? arr.length : -1, min = arr.length;
      const iter = (j, p) => {
        if (fixed < 0 || j < fixed) {
          const m0 = trail.length;
          if (j >= arr.length) { trail.push([arr, j, false]); arr[j] = {}; }
          sc.items.push(arr[j]); sc.idx.push(j);
          const ok = seq(n.a, 0, p, p2 => { const it = sc.items.pop(), ix = sc.idx.pop(); const r = p2 > p && iter(j + 1, p2); sc.items.push(it); sc.idx.push(ix); return r; });
          sc.items.pop(); sc.idx.pop();
          if (ok) return true;
          undo(m0);
        }
        if (fixed >= 0 ? j !== fixed : j < min) return false;
        if (fixed >= 0) return next(p);
        const m1 = trail.length; trail.push([arr, '__done', false]); arr.__done = true;
        if (next(p)) return true; undo(m1); return false;
      };
      if (iter(0, pos)) return true;
      undo(mark); return false;
    }
    // #if / #unless / #ifeq
    const special = n.path.startsWith('@');
    const branch = (body, yes) => {
      const m0 = trail.length, v = get(n.path, sc);
      if (n.type === 'ifeq') {
        if (yes) { if (v === undefined ? !setv(n.path, null, n.value) : en(v) !== n.value) { undo(m0); return false; } }
        else if (v !== undefined && en(v) === n.value) return false;
      } else {
        const t = n.type === 'unless' ? !yes : yes;
        if (special) { if (truthy(v) !== t) return false; }
        else if (v !== undefined && truthy(v) !== t && !(t && isObj(v))) return false;
        else if (v === undefined && !t && !setv(n.path, null, '')) return false;
      }
      const fin = p => {
        if (n.type !== 'ifeq' && !special) {
          const t = n.type === 'unless' ? !yes : yes, w = get(n.path, sc);
          if (t && w === undefined) { const m1 = trail.length; if (setv(n.path, null, true) && next(p)) return true; undo(m1); return false; }
          if (t && !truthy(w)) return false;
        }
        return next(p);
      };
      if (seq(body, 0, pos, fin)) return true;
      undo(m0); return false;
    };
    return branch(n.a, true) || branch(n.b, false);
  };
  if (!seq(nodes, 0, 0, p => p === src.length)) { const e = new Error('template does not match the page near offset ' + best); e.offset = best; throw e; }
  return data;
}
