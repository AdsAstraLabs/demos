#!/usr/bin/env python3
"""Download the public media listed in an intake sheet (no login).
Usage: python3 fetch_media.py <intake.md> <outdir> [--videos https://site/videos]
Images: every https://static.wixstatic.com/media/... URL in the intake is downloaded (the part after the last space-separated
name is kept, e.g. job-01.jpg). Videos: opens the /videos page in headless Chromium, plays each player, catches the
playback master.m3u8 the page itself requests (one fresh page load per 'Play Video' button), and saves each stream with ffmpeg (-c copy). Needs playwright + ffmpeg.
If a video cannot be fetched this prints FAILED and carries on. Never fake media."""
import sys, re, os, subprocess, urllib.request
intake, out = sys.argv[1], sys.argv[2]; os.makedirs(out + '/img', exist_ok=True); os.makedirs(out + '/video', exist_ok=True)
text = open(intake, encoding='utf-8').read()
ua = {'User-Agent': 'Mozilla/5.0'}
for m in re.finditer(r'^\s*(logo|job-\d+)(?:\.png)?\s+(https://static\.wixstatic\.com/media/\S+)', text, re.M):
    name, url = m.group(1), m.group(2)
    ext = os.path.splitext(url.split('~')[0] if False else url)[1] or '.jpg'
    ext = '.png' if name == 'logo' else ('.jpg' if not url.lower().endswith('.jpeg') else '.jpeg')
    dest = f'{out}/img/{name}{ext}'
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=ua), timeout=60).read(); open(dest, 'wb').write(data); print('ok', dest, len(data))
    except Exception as e: print('FAILED', name, e)
if '--videos' in sys.argv:
    page_url = sys.argv[sys.argv.index('--videos') + 1]
    from playwright.sync_api import sync_playwright
    found = {}
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        def grab(i):
            pg = b.new_page(viewport={'width': 1440, 'height': 900})
            pg.on('request', lambda r: found.setdefault(re.search(r'video/(\w+_[0-9a-f]+)/', r.url).group(1), r.url) if 'master.m3u8' in r.url and re.search(r'video/(\w+_[0-9a-f]+)/', r.url) else None)
            pg.goto(page_url, wait_until='load'); pg.wait_for_timeout(3500)
            btns = pg.query_selector_all('[aria-label="Play Video"]')
            if i >= len(btns): pg.close(); return False
            try: btns[i].scroll_into_view_if_needed(timeout=3000); btns[i].click(timeout=3000, force=True); pg.wait_for_timeout(4500)
            except Exception as e: print('click failed', i, str(e)[:60])
            pg.close(); return True
        i = 0
        while grab(i) and i < 20: i += 1
        b.close()
    print('video streams caught:', len(found))
    for vid, u in found.items():
        dest = f'{out}/video/{vid}.mp4'
        r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', u, '-c', 'copy', dest])
        print('ok' if r.returncode == 0 else 'FAILED', dest)
