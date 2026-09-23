#!/usr/bin/env python3
"""
Screenshoty kapitoly rozřezané na části (aby šly prohlédnout).

  python3 tools/shots.py courses/<kurz>/03-*.html OUT_DIR [--profile ov] [--mobile] [--slice 1500]

Uloží OUT_DIR/<kapitola>_<d|m>_01.png, _02.png … (d = počítač 1300 px, m = mobil 390 px).
"""
import sys, os
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

def main():
    a = sys.argv[1:]
    if len(a) < 2: print(__doc__); sys.exit(2)
    f, out = Path(a[0]).resolve(), a[1]
    prof = a[a.index('--profile') + 1] if '--profile' in a else 'ov'
    sl = int(a[a.index('--slice') + 1]) if '--slice' in a else 1500
    mobile = '--mobile' in a
    os.makedirs(out, exist_ok=True)
    w = 390 if mobile else 1300
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={'width': w, 'height': 900})
        ctx.add_init_script("localStorage.setItem('dps.v1', JSON.stringify({profile:'%s'}))" % prof)
        pg = ctx.new_page(); pg.goto('file://' + str(f)); pg.wait_for_timeout(500)
        tmp = os.path.join(out, '_full.png'); pg.screenshot(path=tmp, full_page=True); b.close()
    im = Image.open(tmp); n = 0
    for y in range(0, im.height, sl):
        n += 1
        im.crop((0, y, im.width, min(y + sl, im.height))).save(os.path.join(out, f'{f.stem}_{"m" if mobile else "d"}_{n:02d}.png'))
    os.remove(tmp)
    print(f'{n} částí -> {out}')

main()
