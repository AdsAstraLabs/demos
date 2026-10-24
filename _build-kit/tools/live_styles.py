#!/usr/bin/env python3
"""Step 0: capture the client's LIVE site so colours, radii and fonts are exact, not guessed.
Usage: python3 live_styles.py https://clientsite.ca/ <outdir>     (writes live-styles.json, live-text.txt, live-1440.png, live-390.png)
Read the JSON for: most-used text/background/accent colours (hex), button + card corner radii, font families, and nav/CTA colours."""
import sys, os, json, collections
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
JS = """() => { const hx = c => { const m = c.match(/[\\d.]+/g); if (!m) return null; const a = m[3] === undefined ? 1 : +m[3]; if (a < 0.05) return null;
   return '#' + m.slice(0,3).map(v => (+v|0).toString(16).padStart(2,'0')).join('') };
  const col = {text:{}, bg:{}, border:{}}, rad = {}, fonts = {}, btn = [], bump = (o,k) => { if (k) o[k] = (o[k]||0)+1 };
  document.querySelectorAll('body *').forEach(e => { const c = getComputedStyle(e), b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2 || c.display === 'none') return;
    if ([...e.childNodes].some(n => n.nodeType==3 && n.textContent.trim())) { bump(col.text, hx(c.color)); bump(fonts, c.fontFamily.split(',')[0].replace(/["']/g,'') + ' ' + c.fontWeight); }
    bump(col.bg, hx(c.backgroundColor)); if (c.borderTopWidth !== '0px') bump(col.border, hx(c.borderTopColor));
    if (c.borderRadius !== '0px') bump(rad, c.borderRadius);
    if (e.matches('a,button,.btn,[class*=btn],[class*=button]') && b.width > 60 && b.height > 28 && btn.length < 12) btn.push({text:e.textContent.trim().slice(0,24), color:hx(c.color), bg:hx(c.backgroundColor), radius:c.borderRadius, fs:c.fontSize}) });
  const top = o => Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,10);
  return {text:top(col.text), bg:top(col.bg), border:top(col.border), radii:top(rad), fonts:top(fonts), buttons:btn,
          themeColor:(document.querySelector('meta[name=theme-color]')||{}).content||null, title:document.title,
          logos:[...document.querySelectorAll('img')].filter(i=>/logo/i.test(i.src+i.alt+i.className)).map(i=>i.currentSrc||i.src).slice(0,6),
          videos:[...document.querySelectorAll('video,source,iframe')].map(v=>v.currentSrc||v.src).filter(Boolean).slice(0,10),
          social:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>/facebook|instagram|youtube|tiktok|linkedin|g\\.page|google\\.com\\/maps/.test(h)).slice(0,12)} }"""
with sync_playwright() as pw:
    b = pw.chromium.launch(); res = {}
    for w, h in ((1440, 900), (390, 844)):
        pg = b.new_page(viewport={'width': w, 'height': h}); pg.goto(url, wait_until='load'); pg.wait_for_timeout(2500)
        pg.screenshot(path=f'{out}/live-{w}.png', full_page=True, timeout=90000)
        res[str(w)] = pg.evaluate(JS)
        if w == 1440: open(out + '/live-text.txt', 'w').write(pg.evaluate('document.body.innerText'))
        pg.close()
json.dump(res, open(out + '/live-styles.json', 'w'), indent=1); print(json.dumps(res['1440'], indent=1)[:2500])
