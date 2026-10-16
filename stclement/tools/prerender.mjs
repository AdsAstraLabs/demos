#!/usr/bin/env node
// Builds index.html from cms/page.html and content/*.json (the same build the server runs after every save).
//   node tools/prerender.mjs           write index.html
//   node tools/prerender.mjs --check   exit 1 if index.html is out of date
// CMS_TODAY=YYYY-MM-DD fixes the date used to pick upcoming events (default: today in Toronto).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPage, ROOT, torontoToday } from '../cms/build.mjs';

const file = join(ROOT, 'index.html');
const today = process.env.CMS_TODAY || torontoToday();
const html = buildPage(join(ROOT, 'content'), today);
const old = readFileSync(file, 'utf8');
if (process.argv.includes('--check')) { console.log(html === old ? 'up to date' : 'stale'); process.exit(html === old ? 0 : 1); }
if (html !== old) writeFileSync(file, html);
console.log('prerender (' + today + '): ' + (html !== old ? 'index.html updated' : 'no changes'));
