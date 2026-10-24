#!/usr/bin/env python3
"""Responsive sweep: screenshots + automatic checks in Chromium and WebKit (iPhone emulation).
Usage:  python3 sweep.py http://localhost:8765/<slug>/ <outdir> [page-path ...]
Needs:  pip install playwright && playwright install chromium webkit   (Linux also: playwright install-deps)
Prints one line per viewport and a final FAIL list. Exit code 1 if anything failed.
Heuristics only: always LOOK at the screenshots too."""
import sys, os, json
from playwright.sync_api import sync_playwright
base = sys.argv[1].rstrip('/') + '/'; out = sys.argv[2]; pages = sys.argv[3:] or ['']
os.makedirs(out, exist_ok=True)
WIDTHS = [(320,640),(360,740),(390,844),(430,932),(768,1024),(1024,768),(1180,820),(1440,900),(1920,1080)]
SHORT  = [(1440,640),(1280,600),(390,640),(390,700)]
JS = r"""() => {
 const r = [], W = document.documentElement.clientWidth;
 const vis = e => { const c = getComputedStyle(e), b = e.getBoundingClientRect();
   return c.display!=='none' && c.visibility!=='hidden' && +c.opacity>0 && b.width>1 && b.height>1 };
 const phone = innerWidth <= 760;
 // 1 horizontal scroll
 if (document.documentElement.scrollWidth > W + 1) r.push('H-SCROLL scrollWidth ' + document.documentElement.scrollWidth + ' > ' + W);
 // 2 text size floors (no label < 13px, body copy >= 16 phone / 17 desktop)
 const seen = new Set();
 document.querySelectorAll('body *').forEach(e => {
   if (e.closest('svg,.leaflet-container,script,style,noscript') || !vis(e)) return;
   const t = [...e.childNodes].filter(n=>n.nodeType==3 && n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
   if (!t) return;
   const fs = parseFloat(getComputedStyle(e).fontSize);
   if (fs < 13 && !e.closest('.leaflet-control-attribution')) { const k='S'+t.slice(0,30); if(!seen.has(k)){seen.add(k); r.push('SMALL-TEXT '+fs.toFixed(1)+'px "'+t.slice(0,40)+'" '+e.tagName+'.'+e.className)} }
   if (e.tagName==='P' && t.length>60 && fs < (phone?15.9:16.9)) { const k='B'+t.slice(0,30); if(!seen.has(k)){seen.add(k); r.push('BODY-TOO-SMALL '+fs.toFixed(1)+'px "'+t.slice(0,40)+'"')} }
 });
 // 3 heading overlapped by media/cards/buttons (ignore ancestors, descendants, and elements marked decorative)
 const hs = [...document.querySelectorAll('h1,h2,h3')].filter(vis);
 const others = [...document.querySelectorAll('img,video,picture,figure,.card,[class*=card],a.btn,.btn,button,form')].filter(vis);
 hs.forEach(h => { const a = h.getBoundingClientRect();
   others.forEach(o => { if (o.contains(h) || h.contains(o) || o.closest('[aria-hidden=true]')) return;
     const b = o.getBoundingClientRect(); const w = Math.min(a.right,b.right)-Math.max(a.left,b.left), hh = Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
     const media = /^(IMG|VIDEO|PICTURE|FIGURE)$/.test(o.tagName);
     if (w > 2 && hh > 2 && media) { // media behind the heading is a background: fine here (contrast audit covers it). Media on top of the heading is a bug.
       const cx = Math.max(a.left,b.left)+w/2, cy = Math.max(a.top,b.top)+hh/2, top = document.elementsFromPoint(cx, cy)[0];
       if (!top || h.contains(top) || top.contains(h) || top.closest('.leaflet-container')) return; }
     if (w > 2 && hh > 2) r.push('OVERLAP heading "'+h.textContent.trim().slice(0,30)+'" vs '+o.tagName+'.'+(o.className||'').toString().slice(0,25)+' '+Math.round(w)+'x'+Math.round(hh)+'px');
     else if (w > 2 && hh > -6 && hh <= 2 && o.tagName!=='FIGURE') r.push('TOUCHING heading "'+h.textContent.trim().slice(0,30)+'" within 6px of '+o.tagName+'.'+(o.className||'').toString().slice(0,25));
   }) });
 // 4 buttons touching each other
 const bt = [...document.querySelectorAll('a.btn,.btn,button')].filter(vis);
 for (let i=0;i<bt.length;i++) for (let j=i+1;j<bt.length;j++) { const a=bt[i].getBoundingClientRect(), b=bt[j].getBoundingClientRect();
   if (bt[i].contains(bt[j])||bt[j].contains(bt[i])) continue;
   const w=Math.min(a.right,b.right)-Math.max(a.left,b.left), h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
   if ((w>0&&h>0) || (w>0&&h>-6) || (h>0&&w>-6)) r.push('BUTTONS-TOUCH "'+bt[i].textContent.trim().slice(0,20)+'" / "'+bt[j].textContent.trim().slice(0,20)+'"') }
 // 5 first-viewport check: h1 and primary CTA inside the viewport
 const h1 = document.querySelector('h1'); if (h1) { const b=h1.getBoundingClientRect(); if (b.bottom > innerHeight) r.push('H1-BELOW-FOLD bottom '+Math.round(b.bottom)+' > '+innerHeight) }
 const cue = document.querySelector('.scue,[class*=scroll-cue],a[aria-label*=croll]'); if (cue && vis(cue)) { const b=cue.getBoundingClientRect(); if (b.bottom > innerHeight+1) r.push('SCROLL-CUE-OFFSCREEN') ;
   const hero=document.querySelector('.hero,header+section,main>section'); if (hero) hero.querySelectorAll('h1,p,.btn,a.btn').forEach(x=>{ if(cue.contains(x)||x.contains(cue)||!vis(x)) return; const a=x.getBoundingClientRect(); if (a.bottom > b.top-8 && a.top < b.bottom && a.right>b.left && a.left<b.right) r.push('CUE-CROWDED by '+x.tagName+' "'+x.textContent.trim().slice(0,20)+'"') }) }
 // 6 images wider than 2x their display width (perf) and broken images
 document.querySelectorAll('img').forEach(i => { if (i.complete && i.naturalWidth===0 && i.getAttribute('src') && vis(i)) r.push('BROKEN-IMG '+i.getAttribute('src'));
   if (i.naturalWidth && i.clientWidth && i.naturalWidth > i.clientWidth*3.2 && i.naturalWidth>1400) r.push('OVERSIZED-IMG '+i.currentSrc.split('/').pop()+' '+i.naturalWidth+'px shown at '+i.clientWidth) });
 return r }"""
FULLW = (390, 768, 1440) if not os.environ.get('SWEEP_FULL_ALL') else tuple(w for w,_ in WIDTHS)  # full-page shots only at these widths
fails = []
def run(pw, eng, size, name, ctxkw):
    b = getattr(pw, eng).launch()  # on Linux, to use system Chrome: launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    ctx = b.new_context(**ctxkw); pg = ctx.new_page(); bad = []
    pg.on('console', lambda m: m.type in ('error',) and bad.append('CONSOLE '+m.text[:120]))
    pg.on('pageerror', lambda e: bad.append('PAGEERROR '+str(e)[:120]))
    pg.on('response', lambda r: r.status >= 400 and bad.append('HTTP %d %s' % (r.status, r.url[-80:])))
    pg.on('requestfailed', lambda r: bad.append('REQFAIL '+r.url[-80:]) if 'mp4' not in r.url and 'webm' not in r.url else None)
    for p in pages:
        pg.goto(base+p, wait_until='load'); pg.wait_for_timeout(1500)
        h = pg.evaluate('document.documentElement.scrollHeight')
        for y in range(0, h, max(300, size[1]//2)): pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(120)
        pg.wait_for_timeout(800); pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(600)
        tag = f'{eng}-{name}-{(p.strip("/").replace("/","_") or "home")}'
        res = pg.evaluate(JS) + bad; bad.clear()
        pg.screenshot(path=f'{out}/{tag}-fold.png')
        if size[0] in FULLW and size[1] >= 700:
            h = pg.evaluate('document.documentElement.scrollHeight')
            if h * pg.evaluate('devicePixelRatio') <= 30000: pg.screenshot(path=f'{out}/{tag}-full.png', full_page=True, timeout=90000)
            else:  # engines refuse shots over 32767 device pixels: slice
                for i, y in enumerate(range(0, h, 3000)): pg.screenshot(path=f'{out}/{tag}-full-{i:02d}.png', full_page=True, clip={'x':0,'y':y,'width':size[0],'height':min(3000,h-y)}, timeout=90000)
        print(('OK   ' if not res else 'FAIL ') + tag, len(res)); 
        for x in sorted(set(res))[:14]: print('     ', x); fails.append(f'{tag}: {x}')
    b.close()
with sync_playwright() as pw:
    for eng in ('chromium', 'webkit'):
        for (w, h) in WIDTHS + SHORT:
            kw = dict(viewport={'width': w, 'height': h})
            if eng == 'webkit' and w <= 430: kw = dict(pw.devices['iPhone 13'], viewport={'width': w, 'height': h})
            if eng == 'chromium' and w <= 430: kw.update(is_mobile=True, has_touch=True, device_scale_factor=2)
            run(pw, eng, (w, h), f'{w}x{h}', kw)
print('\nTOTAL FAILS:', len(fails)); json.dump(fails, open(out+'/sweep-fails.json','w'), indent=1)
sys.exit(1 if fails else 0)
