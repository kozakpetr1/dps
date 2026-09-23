#!/usr/bin/env python3
"""
Automatické „projití“ kapitol: pro každé cvičení se v prohlížeči vyřeší podle klíče z jeho vlastního JSON
a zkontroluje se, že se cvičení označí jako splněné. Odhalí chybné klíče (špatný index odpovědi,
nedosažitelný konec scénáře, rozvrh, který nesplňuje pravidla, regulární výraz, který neprojde vzorovým řešením…).

  python3 tools/autosolve.py courses/<kurz>/03-*.html            (výchozí profil ov)
  python3 tools/autosolve.py --all-profiles courses/<kurz>/03-*.html
  python3 tools/autosolve.py --shots out_dir courses/<kurz>/03-*.html   (uloží i screenshoty)

Vyžaduje: python3, `pip install playwright` a nainstalovaný Chromium. Kapitoly se otevírají přes file://.
Výstup: PASS/FAIL za každé cvičení, chyby v konzoli a přetečení stránky do šířky.
"""
import sys, re, json, os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PROFILES = ['ov', 'inf', 'eko', 'vs', 'cr', 'um']


def strip(t):
    return re.sub(r'<[^>]+>', '', str(t)).strip()


def cfg_for(cfg, profile):
    if 'byProfile' in cfg:
        bp = cfg['byProfile']
        part = bp.get(profile)
        if part is None:
            part = bp.get('_', bp.get('ov', next(iter(bp.values()))))
        base = {k: v for k, v in cfg.items() if k != 'byProfile'}
        base.update(part)
        return base
    return cfg


def extract(html):
    out = []
    for m in re.finditer(r'<div class="ex" data-type="([\w-]+)" data-id="([^"]*)">\s*<script type="application/json">(.*?)</script>', html, re.S):
        out.append((m.group(1), m.group(2), json.loads(m.group(3))))
    return out


def solve(pg, ex, typ, cfg, profile):
    """Vrací None při úspěchu, jinak text problému."""
    L = ex.locator
    if typ == 'quiz':
        if cfg.get('generate') == 'bloom':
            lv = pg.evaluate("DPS.data.bloom.levels.map(l=>({n:l.name,q:DPS.byProfile(l.ex2,['_','ov'])}))")
            n = len(lv)
            for _ in range(n):
                qt = strip(L('.qz-q').inner_text()).split('\n')[0].strip().strip('„“"')
                hit = [l for l in lv if l['q'].strip() == qt]
                if not hit: return 'bloom: nenalezena otázka ' + qt
                L('.opt .opt-t', has_text=re.compile('^' + re.escape(hit[0]['n']) + '$')).first.click()
                ex.get_by_role('button').filter(has_text=re.compile('Další otázka|Zobrazit výsledek')).click()
            return None
        items = cfg['items']
        for _ in range(len(items)):
            qtxt = strip(L('.qz-q').inner_text()).split('\n')[0].strip()
            it = next((x for x in items if strip(x['q']).startswith(qtxt[:35])), None)
            if not it: return 'kvíz: nenalezena otázka ' + qtxt[:40]
            if it.get('tf'):
                good = ['Pravda' if it['ok'] else 'Nepravda']
            elif it.get('pick'):
                good = [it['pick'][i] for i in (it['answer'] if isinstance(it['answer'], list) else [it['answer']])]
            else:
                good = [o['t'] for o in it['opts'] if o.get('ok')]
            for g in good:
                L('.opt .opt-t').filter(has_text=strip(g)[:60]).first.click()
            if len(good) > 1: ex.get_by_role('button', name='Zkontrolovat').click()
            ex.get_by_role('button').filter(has_text=re.compile('Další otázka|Zobrazit výsledek')).click()
        return None
    if typ == 'match':
        for p in cfg['pairs']:
            L('.mt-col').nth(0).locator('.mt-item').filter(has_text=strip(p['l'])[:40]).first.click()
            L('.mt-col').nth(1).locator('.mt-item').filter(has_text=strip(p['r'])[:40]).first.click()
        return None
    if typ == 'classify':
        names = {b['id']: b['name'] for b in cfg['bins']}
        for c in cfg['cards']:
            L('.cl-pool .tile').filter(has_text=strip(c['t'])[:40]).first.click()
            pg.wait_for_timeout(60)
            L('.cl-bin').filter(has=pg.locator('h4', has_text=names[c['bin']])).first.click()
            if cfg.get('instant'): pg.wait_for_timeout(80)
        if not cfg.get('instant'):
            ex.get_by_role('button', name='Zkontrolovat').click()
        return None
    if typ == 'order':
        items = [strip(i if isinstance(i, str) else i['t']) for i in cfg['items']]
        for target in range(len(items)):
            cur = [t.strip() for t in L('.od-item .t').all_inner_texts()]
            k = next(i for i, t in enumerate(cur) if t.startswith(items[target][:30]))
            while k > target:
                L('.od-item').nth(k).locator('.od-btns button').nth(0).click(); k -= 1
        ex.get_by_role('button', name='Zkontrolovat pořadí').click()
        return None
    if typ == 'cloze':
        answers = re.findall(r'\[\[(.+?)\]\]', cfg['text'])
        sels = L('select')
        for i, a in enumerate(answers): sels.nth(i).select_option(value=a)
        ex.get_by_role('button', name='Zkontrolovat').click()
        return None
    if typ == 'flashcards':
        for _ in range(len(cfg['cards'])):
            L('.fc-card').click(); ex.get_by_role('button', name='Znám').click()
        return None
    if typ == 'scenario':
        nodes = cfg['nodes']
        memo = {}
        def best(i):
            if i in memo: return memo[i]
            n = nodes[i]
            if n.get('end'): memo[i] = (0, []); return memo[i]
            memo[i] = (0, [])
            b = (-1, [])
            for c in n['choices']:
                s, p = best(c['to'])
                if (c.get('pts', 0) + s) > b[0]: b = (c.get('pts', 0) + s, [c['t']] + p)
            memo[i] = b; return b
        s, path = best(cfg['start'])
        for t in path:
            L('.opt').filter(has_text=strip(t)[:50]).first.click()
        return None
    if typ == 'reflect':
        for i in range(L('textarea').count()):
            L('textarea').nth(i).fill('Toto je dostatečně dlouhý vlastní zápis do textového pole cvičení.')
        pg.wait_for_timeout(700)
        return None
    if typ == 'spot':
        for p in cfg['parts']:
            if isinstance(p, dict) and p.get('bad'):
                L('.sp-seg').filter(has_text=strip(p['t'])[:30]).first.click()
        ex.get_by_role('button', name='Zkontrolovat').click()
        return None
    if typ == 'annotate':
        names = {c['id']: c['name'] for c in cfg['categories']}
        for p in cfg['parts']:
            if isinstance(p, dict) and p.get('cat'):
                L('.an-cat').filter(has_text=names[p['cat']]).first.click()
                L('.an-seg').filter(has_text=strip(p['t'])[:30]).first.click()
        ex.get_by_role('button', name='Zkontrolovat').click()
        return None
    if typ == 'checklist':
        if cfg.get('scale'):
            for i in range(L('.ck-row').count()): L('.ck-row').nth(i).locator('.ck-sc').nth(0).click()
        else:
            for i in range(L('.ck-box').count()): L('.ck-box').nth(i).click()
        return None
    if typ == 'rubric':
        if cfg.get('example'):
            ex.get_by_role('button', name='Ukázat příklad').click()
            pg.get_by_role('button', name='Nahradit').click(); pg.wait_for_timeout(300)
        return None
    if typ == 'rewrite':
        items = cfg['items']
        for i, it in enumerate(items):
            L('textarea').fill(strip(it['model']))
            ex.get_by_role('button', name='Zkontrolovat').click()
            if i < len(items) - 1:
                nb = ex.get_by_role('button', name='Další příklad')
                if nb.count() == 0: return f'rewrite: položka {i+1} – vzorové řešení neprošlo vlastními kontrolami'
                nb.click()
        return None
    if typ == 'goalbuilder':
        ex.get_by_role('button', name='Ukázat dobrý cíl').click()
        ex.get_by_role('button', name=re.compile('Uložit cíl')).click()
        return None
    if typ == 'taxonomy':
        names = {'kog': 'Kognitivní', 'psy': 'Psychomotorické', 'afe': 'Afektivní'}
        for d in cfg['domains']:
            if len(cfg['domains']) > 1: L('.bz-tabs .seg-btn').filter(has_text=names[d]).first.click()
            for k in range(L('.bz-lvl').count()): L('.bz-lvl').nth(k).click()
        return None
    if typ == 'timeplanner':
        for pr in cfg.get('presets', []):
            ex.get_by_role('button', name=pr['name']).click()
            if L('.tp-rules li.bad').count() == 0: return None
        return 'timeplanner: žádný vzorový rozvrh nesplňuje všechna pravidla'
    if typ == 'examsim':
        ex.get_by_role('button', name=re.compile('Losovat')).click()
        ex.get_by_role('button', name=re.compile('Začít přípravu')).click()
        ex.get_by_role('button', name='Přejít k odpovědi').click()
        ex.get_by_role('button', name='Skončit a ohodnotit').click()
        L('.xs-pt input').first.check()
        ex.get_by_role('button', name='Uložit výsledek').click()
        return None
    if typ == 'portfolio':
        # Portfolio se splní, až jsou vyplněny zdrojové zápisy z jiných kapitol – při automatickém testu jen ověříme, že se vykreslí.
        if L('.pf-row').count() < 2: return 'portfolio: nevykreslily se řádky zdrojů'
        return 'SKIP'
    return 'neznámý typ ' + typ


def run(files, profiles, shots):
    total_fail = 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        for prof in profiles:
            for f in files:
                f = Path(f).resolve()
                html = f.read_text(encoding='utf-8')
                exs = extract(html)
                for width in ([1300, 390] if prof == profiles[0] else [1300]):
                    ctx = b.new_context(viewport={'width': width, 'height': 900})
                    ctx.add_init_script("localStorage.setItem('dps.v1', JSON.stringify({profile:'%s'}))" % prof)
                    pg = ctx.new_page(); errs = []
                    pg.on('console', lambda m: errs.append(m.text) if m.type in ('error', 'warning') else None)
                    pg.on('pageerror', lambda e: errs.append('pageerror ' + str(e)))
                    pg.goto('file://' + str(f), wait_until='load'); pg.wait_for_timeout(300)
                    sw = pg.evaluate('document.documentElement.scrollWidth')
                    fails = []
                    if width == 390 and sw > 392: fails.append(f'přetečení stránky do šířky ({sw}px)')
                    if width == 390:
                        bad_now = pg.locator('.ex-body > .fb.bad').count()
                        if bad_now: fails.append('cvičení hlásí chybu při načtení')
                        if shots:
                            os.makedirs(shots, exist_ok=True)
                            pg.screenshot(path=os.path.join(shots, f.stem + '_m.png'), full_page=True)
                    if width == 1300:
                        hidden_ids = set()
                        for typ, i, cfg in exs:
                            ex = pg.locator(f'.ex[data-ex-id="{i}"]')
                            if ex.count() == 0:
                                fails.append(f'[{i}] ({typ}) cvičení se na stránce nevykreslilo'); continue
                            c = cfg_for(cfg, prof)
                            try:
                                ex.scroll_into_view_if_needed(); pg.evaluate("window.scrollBy(0,-120)")
                                r = solve(pg, ex, typ, c, prof)
                            except Exception as e:
                                r = 'výjimka: ' + str(e).split('\n')[0][:160]
                            pg.wait_for_timeout(120)
                            status = ex.locator('.ex-status').inner_text() if ex.locator('.ex-status').count() else ''
                            if r == 'SKIP': continue
                            ok = r is None and 'Splněno' in status and 'Nesplněno' not in status
                            if not ok: fails.append(f'[{i}] ({typ}) {r or "po vyřešení nebylo splněno: " + status}')
                        if shots:
                            os.makedirs(shots, exist_ok=True)
                            pg.screenshot(path=os.path.join(shots, f.stem + '_d.png'), full_page=True)
                        fin = pg.locator('.finish').inner_text()[:60].replace('\n', ' ') if pg.locator('.finish').count() else ''
                    if errs: fails.append('konzole: ' + '; '.join(errs)[:200])
                    tag = f'{f.parent.name}/{f.name} [{prof}, {width}px]'
                    print(('FAIL ' if fails else 'PASS ') + tag)
                    for x in fails: print('      -', x)
                    total_fail += len(fails)
                    ctx.close()
        b.close()
    print('\nCelkem problémů:', total_fail)
    return total_fail


if __name__ == '__main__':
    args = sys.argv[1:]
    profiles = ['ov']; shots = None; files = []
    i = 0
    while i < len(args):
        if args[i] == '--all-profiles': profiles = PROFILES
        elif args[i] == '--shots': shots = args[i + 1]; i += 1
        else: files.append(args[i])
        i += 1
    if not files:
        print(__doc__); sys.exit(2)
    sys.exit(1 if run(files, profiles, shots) else 0)
