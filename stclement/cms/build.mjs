// Builds index.html from cms/page.html and the content files. Used by the server (on start, after every save, and
// when the date changes) and by tools/prerender.mjs.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parse, render } from './engine.mjs';
import { FILES, NAMES, fill } from '../admin/schema.js';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let tpl = null;
const template = () => tpl || (tpl = parse(readFileSync(join(ROOT, 'cms', 'page.html'), 'utf8')));

export function loadContent(dir) {
  const C = {};
  for (const n of NAMES) C[n] = fill(FILES[n], JSON.parse(readFileSync(join(dir, n + '.json'), 'utf8')));
  return derive(C);
}

// Fill in what an editor may leave empty: a picture chosen from the library has one address, used as src and srcset;
// the campaign viewer link falls back to the picture.
function derive(C) {
  const walk = v => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      if ('src' in v && 'srcset' in v) { if (!v.srcset && v.src) v.srcset = v.src; if (!v.src && v.srcset) v.src = String(v.srcset).trim().split(/[\s,]+/)[0]; }
      Object.values(v).forEach(walk);
    }
  };
  walk(C);
  if (C.give && C.give.camp && !C.give.camp.large) C.give.camp.large = C.give.camp.img.src;
  return C;
}

// The date-driven parts (bulletins, schedule, this week, devotions, events) are rendered by the page's own
// <script id="cms-render">, which also refreshes them in the browser if the JSON is newer than the page.
export function fillDated(html, C, today) {
  const m = html.match(/<script id="cms-render">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('cms-render script not found');
  const box = { window: {} };
  vm.runInNewContext(m[1], box);
  const R = box.window.SCR, H = R.render(C, today || R.today());
  for (const [name, inner] of Object.entries(H)) {
    if (inner == null) continue;
    const re = new RegExp('(data-cms="' + name + '" data-cv=")[^"]*(">)<!--cms:' + name + '-->[\\s\\S]*?<!--/cms:' + name + '-->');
    if (!re.test(html)) throw new Error('container not found: ' + name);
    html = html.replace(re, (_, a, b) => a + R.hash(inner) + b + '<!--cms:' + name + '-->' + inner + '<!--/cms:' + name + '-->');
  }
  return html;
}

export function buildPage(contentDir, today) {
  const C = loadContent(contentDir);
  return fillDated(render(template(), C), C, today);
}

export function torontoToday() {
  try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  catch { return new Date().toISOString().slice(0, 10); }
}
