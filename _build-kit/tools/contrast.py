#!/usr/bin/env python3
"""Real-background contrast audit (works over video, photos, gradients, scrims).
Method: make all text transparent, take a real screenshot, sample the pixels under each text box, take the WORST
background (1st-percentile luminance for light text, 99th for dark text), compare with the text's real colour.
Usage:  python3 contrast.py http://localhost:8765/<slug>/ <outdir> [video-seconds,comma,separated]
Bars: body 4.5:1 | large text (>=24px, or >=18.66px bold) 3:1 | text on panels you want to read easily 7:1 (optional).
Run at several widths; hero video is paused and seeked to each given second (default 1,4,8,12,16,20,24)."""
import sys, os, re, io, json
from PIL import Image
import numpy as np
from playwright.sync_api import sync_playwright
base = sys.argv[1]; out = sys.argv[2]; os.makedirs(out, exist_ok=True)
times = [float(x) for x in (sys.argv[3] if len(sys.argv) > 3 else '1,4,8,12,16,20,24').split(',')]
SIZES = [(360,640),(390,844),(414,896),(768,1024),(1024,768),(1440,900)]
def lin(c): c = c/255.0; return np.where(c <= 0.03928, c/12.92, ((c+0.055)/1.055)**2.4)
def lum(rgb): r, g, b = lin(rgb[..., 0]), lin(rgb[..., 1]), lin(rgb[..., 2]); return 0.2126*r + 0.7152*g + 0.0722*b
def ratio(a, b): hi, lo = max(a, b), min(a, b); return (hi+0.05)/(lo+0.05)
JS = """() => { const o = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
 const seen = new Set();
 while (w.nextNode()) { const n = w.currentNode; if (!n.textContent.trim()) continue; const e = n.parentElement;
  if (e.closest('script,style,noscript,svg')) continue; const cs = getComputedStyle(e);
  if (cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0) continue;
  const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect();
  if (b.width<2||b.height<2||b.bottom<0||b.top>innerHeight) continue;
  const cx = Math.min(innerWidth-1, Math.max(0, b.left+b.width/2)), cy = Math.min(innerHeight-1, Math.max(0, b.top+b.height/2)), tp = document.elementFromPoint(cx, cy);
  if (!tp || !(e.contains(tp) || tp.contains(e))) continue; // covered by something else (sticky header, overlay): not readable here, audit it where it is visible
  const m = cs.color.match(/[\\d.]+/g).map(Number); let op = 1; for (let p=e; p; p=p.parentElement) op *= +getComputedStyle(p).opacity;
  o.push({t:n.textContent.trim().slice(0,32), x:b.left, y:b.top, w:b.width, h:b.height, c:m.slice(0,3), a:(m[3]===undefined?1:m[3])*op,
          fs:parseFloat(cs.fontSize), fw:parseInt(cs.fontWeight)||400, cls:(e.className||'').toString().slice(0,24)}); }
 return o }"""
bad = []
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for (W, H) in SIZES:
        ctx = br.new_context(viewport={'width': W, 'height': H}); pg = ctx.new_page(); pg.goto(base, wait_until='load'); pg.wait_for_timeout(1500)
        pg.add_style_tag(content='*{scroll-behavior:auto!important}'); 
        h = pg.evaluate('document.documentElement.scrollHeight'); stops = list(range(0, max(1, h-H)+1, int(H*0.8)))
        for si, y in enumerate(stops):
            for vt in (times if si == 0 else [None]):
                pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(1400)  # let scroll reveals finish
                if vt is not None:
                    pg.evaluate("""t => document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = Math.min(t, (v.duration||t)-0.1) })""", vt); pg.wait_for_timeout(700)
                items = pg.evaluate(JS)
                pg.add_style_tag(content='*,*::before,*::after{transition:none!important}*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important;-webkit-text-stroke:0!important} svg text{fill:transparent!important}')
                pg.wait_for_timeout(150); png = pg.screenshot(); im = np.asarray(Image.open(io.BytesIO(png)).convert('RGB')).astype(float)
                pg.evaluate("document.querySelectorAll('style').forEach(s=>{ if(s.textContent.includes('color:transparent!important')) s.remove() })")
                sx = im.shape[1]/W
                for it in items:
                    x0, y0 = max(0, int(it['x']*sx)), max(0, int(it['y']*sx)); x1, y1 = min(im.shape[1], int((it['x']+it['w'])*sx)+1), min(im.shape[0], int((it['y']+it['h'])*sx)+1)
                    if x1-x0 < 2 or y1-y0 < 2 or it['a'] < 0.6: continue  # a<0.6 = still hidden/fading: not readable text yet
                    L = lum(im[y0:y1, x0:x1]).ravel(); tc = np.array(it['c'], float); tl = float(lum(tc.reshape(1, 3))[0])
                    # blend text colour with its alpha over the median background
                    med = float(np.median(L)); tl = it['a']*tl + (1-it['a'])*med
                    worst = float(np.percentile(L, 1 if tl > med else 99)); r = ratio(tl, worst)
                    large = it['fs'] >= 24 or (it['fs'] >= 18.66 and it['fw'] >= 700); need = 3.0 if large else 4.5
                    if r < need: bad.append((W, H, 'vid%ss' % vt if vt is not None else 'y%d' % y, round(r, 2), need, it['t'], it['cls']))
        ctx.close()
    br.close()
bad = sorted(set(bad), key=lambda b: b[3])
print('CONTRAST FAILURES:', len(bad))
for b in bad[:60]: print('  %dx%d %-8s ratio %.2f (need %.1f)  "%s" .%s' % b)
open(out+'/contrast-fails.json', 'w').write(json.dumps(bad, indent=1)); sys.exit(1 if bad else 0)
