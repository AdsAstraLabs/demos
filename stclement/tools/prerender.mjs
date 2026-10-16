#!/usr/bin/env node
// Pre-renders content/*.json into index.html (the same renderer the page uses at runtime, read from <script id="cms-render">).
// Build command on Cloudflare Pages / Netlify:  node tools/prerender.mjs     (no dependencies)
// Local check without writing:                    node tools/prerender.mjs --check   (exit 1 if index.html is stale)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'index.html');
let html = readFileSync(file, 'utf8');
const m = html.match(/<script id="cms-render">([\s\S]*?)<\/script>/);
if (!m) throw new Error('cms-render script not found in index.html');
const box = { window: {} };
vm.runInNewContext(m[1], box);
const R = box.window.SCR;
const C = {};
for (const n of ['bulletins', 'schedule', 'week', 'events']) C[n] = JSON.parse(readFileSync(join(root, 'content', n + '.json'), 'utf8'));
const today = process.env.CMS_TODAY || R.today();
const H = R.render(C, today);
let changed = [];
for (const [name, inner] of Object.entries(H)) {
  if (inner == null) continue;
  const re = new RegExp('(data-cms="' + name + '" data-cv=")[^"]*(">)<!--cms:' + name + '-->[\\s\\S]*?<!--/cms:' + name + '-->');
  if (!re.test(html)) throw new Error('container not found: ' + name);
  const next = html.replace(re, (_, a, b) => a + R.hash(inner) + b + '<!--cms:' + name + '-->' + inner + '<!--/cms:' + name + '-->');
  if (next !== html) changed.push(name);
  html = next;
}
if (process.argv.includes('--check')) { console.log(changed.length ? 'stale: ' + changed.join(', ') : 'up to date'); process.exit(changed.length ? 1 : 0); }
if (changed.length) writeFileSync(file, html);
console.log('prerender (' + today + '): ' + (changed.length ? 'updated ' + changed.join(', ') : 'no changes'));
