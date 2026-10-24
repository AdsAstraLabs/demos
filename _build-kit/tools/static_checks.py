#!/usr/bin/env python3
"""Static pre-push gate for ONE demo folder. Usage: python3 static_checks.py <demo-folder>   (exit 1 on any hit)
Checks: noindex meta + robots.txt, tracking scripts, hotlinked media, images >400 KB, EXIF/GPS, dead internal links/anchors/assets,
'based in', pricing words, em dashes, forms really disabled, tel: links, circles (border-radius:50%)."""
import sys, os, re, glob
from PIL import Image
from urllib.parse import unquote
root = sys.argv[1].rstrip('/'); R = {}
def hit(k, v): R.setdefault(k, []).append(v)
htmls = glob.glob(root+'/**/*.html', recursive=True)
ids = {h: set(re.findall(r'\sid="([^"]+)"', open(h, encoding='utf8').read())) for h in htmls}
if not os.path.exists(root+'/robots.txt'): hit('robots.txt', 'missing (optional but we ship Disallow: /)')
for h in htmls:
    s = open(h, encoding='utf8').read(); rel = os.path.relpath(h, root)
    if not re.search(r'<meta name="robots" content="[^"]*noindex', s): hit('noindex', rel)
    nc = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    for t in ['googletagmanager', 'gtag(', 'fbq(', 'google-analytics', 'clarity.ms', 'hotjar', 'plausible', 'segment.com']:
        if t in nc: hit('tracking', f'{rel}: {t}')
    for m in re.finditer(r'(?:src|srcset|poster)="(https?://[^"]+)"|url\((["\']?)(https?://[^)"\']+)', nc):
        u = m.group(1) or m.group(3)
        if 'tile.openstreetmap' in u or 'tiles' in u: continue   # map tiles are allowed (attribution shown)
        hit('hotlink', f'{rel}: {u[:90]}')
    for m in re.finditer(r'href="([^"]+)"', nc):
        u = m.group(1)
        if u.startswith('tel:') and not re.fullmatch(r'tel:\+1\d{10}', u): hit('tel', f'{rel}: {u} (use tel:+1XXXXXXXXXX)')
        if u.startswith(('http', 'mailto:', 'tel:', 'sms:', 'data:', 'javascript')): continue
        path, _, frag = u.partition('#'); path = path.split('?')[0]
        tgt = os.path.normpath(os.path.join(os.path.dirname(h), unquote(path))) if path else h
        if os.path.isdir(tgt): tgt = os.path.join(tgt, 'index.html')
        if not os.path.exists(tgt): hit('link404', f'{rel}: {u}'); continue
        if frag and tgt.endswith('.html') and frag not in ids.get(tgt, set()): hit('anchor', f'{rel}: {u}')
    for m in re.finditer(r'(?:src|poster)="([^"]+)"|srcset="([^"]+)"', nc):
        for u in ([m.group(1)] if m.group(1) else [x.strip().split(' ')[0] for x in m.group(2).split(',')]):
            if u.startswith(('http', 'data:')): continue
            if not os.path.exists(os.path.normpath(os.path.join(os.path.dirname(h), unquote(u.split('?')[0])))): hit('link404', f'{rel}: asset {u}')
    for f in re.findall(r'<form\b[^>]*>', nc):
        if 'action=' in f and 'onsubmit' not in f: hit('form', f'{rel}: form has an action: {f[:80]}')
        if 'onsubmit' not in f and 'class=' not in f: hit('form', f'{rel}: check form is disabled in JS: {f[:80]}')
    txt = re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', '', nc, flags=re.S))
    for w in [r'\bbased (in|out)\b', r'\bheadquarter', r'flat[- ]rate', r'\$\s?\d', r'\bstarting at\b', r'\bper hour\b', r'\bfixed price\b', '\u2014', '\u2013 ']:
        for m in re.finditer(w, txt, re.I): hit('copy', f'{rel}: ...{txt[max(0,m.start()-40):m.end()+30].strip()}')
    for m in re.finditer(r'border-radius:\s*50%', nc): hit('circle', f'{rel}: inline border-radius:50%')
for css in glob.glob(root+'/**/*.css', recursive=True) + [h for h in htmls]:
    s = open(css, encoding='utf8').read()
    for m in re.finditer(r'border-radius:\s*(50%|999px|9999px|100%)', s): hit('circle', f'{os.path.relpath(css,root)}: {m.group(0)} (circles banned except Google G/avatars if the brand has them; check)')
    for m in re.finditer(r'url\((["\']?)(https?://[^)"\']+)', s):
        if 'tile' not in m.group(2): hit('hotlink', f'{os.path.relpath(css,root)}: {m.group(2)[:90]}')
for f in glob.glob(root+'/**/*', recursive=True):
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif')):
        sz = os.path.getsize(f)
        if sz > 400*1024: hit('imgsize', f'{os.path.relpath(f,root)} {sz//1024} KB')
        try:
            im = Image.open(f); ex = im.getexif()
            if len(ex) or 'exif' in im.info: hit('exif', f'{os.path.relpath(f,root)} tags={len(ex)} gps={34853 in ex}')
        except Exception as e: hit('exif', f'{f} ERR {e}')
    if f.lower().endswith(('.mp4', '.webm', '.mov')) and os.path.getsize(f) > 6*1024*1024: hit('videosize', f'{os.path.relpath(f,root)} {os.path.getsize(f)//1048576} MB (aim < 6 MB)')
print(os.path.basename(root), {k: len(v) for k, v in R.items()} or 'ALL CLEAN')
for k, v in R.items():
    for x in sorted(set(v))[:25]: print(' ', k, '|', x)
sys.exit(1 if R else 0)
