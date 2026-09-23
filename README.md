# Doplňkové pedagogické studium – interaktivní výukový web

Statický web bez build kroku (HTML, CSS, JavaScript). Otevírá se dvojklikem na `index.html`, přes rozšíření **Live Server** ve VS Code, nebo z libovolného webového serveru (stačí nahrát složku).

## Co je hotové

- Rozcestník kurzů (`index.html`) s procentem dokončení a doporučenou další kapitolou.
- Kurz **Didaktika odborných předmětů** (8 kapitol, všechny `status: 'ready'`).
- Kurz **Úvod do obecné pedagogiky a didaktiky** (11 kapitol, všechny `status: 'ready'`).
- Levá navigace, stránkování dole (na začátek, zpět, dopředu, na konec), obsah kapitoly vpravo, tmavý a světlý vzhled, mobilní zobrazení.
- Osobní postup uložený v prohlížeči (localStorage), zálohu si student může stáhnout a znovu načíst v nastavení (ikona vpravo nahoře).
- Přepínač zaměření (odborný výcvik, informatika, ekonomika, veřejná správa, cestovní ruch, umělecké obory): přizpůsobuje příklady.
- 18 typů cvičení, viz seznam níže. Poslední kapitola každého kurzu (DOP 8, OPD 11) je syntetické shrnutí s portfoliem uložených výstupů, kontrolním seznamem a trenažérem zkouškových/kolokviálních otázek.

## Práce ve VS Code

1. Otevřete složku v VS Code a nainstalujte rozšíření *Live Server*.
2. Klepněte pravým tlačítkem na `index.html` a zvolte *Open with Live Server*.
3. Upravujte soubory, prohlížeč se sám obnoví.

## Struktura

```
index.html                     rozcestník
assets/css/                    tokens.css (barvy), layout.css, components.css, exercises.css, base.css
assets/js/                     core.js (úložiště, profily), shell.js (stránky), ex-*.js (typy cvičení)
courses/manifest.js            seznam kurzů na rozcestníku
courses/<kurz>/course.js       popis kurzu a kapitol
courses/<kurz>/<kapitola>.html obsah kapitoly
tools/scaffold.mjs             vytvoří chybějící stránky podle course.js
tools/check.mjs                statická kontrola kapitoly (HTML, cvičení, JSON schémata) – node tools/check.mjs <soubor>.html
tools/autosolve.py             Playwright test: automaticky vyřeší každé cvičení podle jeho klíče a ověří, že jde splnit (desktop i mobil, přes profily)
tools/shots.py                 uloží kapitolu jako sérii screenshotů (desktop/mobil) pro vizuální kontrolu
tools/apply-meta.py            hromadně doplní lead/summary/minutes/status do course.js podle JSON vstupu
docs/AUTORSKY-PRUVODCE.md      závazný průvodce pro psaní kapitol (styl, komponenty, schémata cvičení)
docs/REVIZE-OBSAHU.md          souhrn toho, co bylo změněno oproti původním prezentacím, a co ověřit
docs/fakta/<kurz>-<NN>.md      podrobné poznámky ke kapitole: opravy chyb, zdroje, co ověřit, návrhy zkouškových otázek
```

## Přidání kurzu

1. Vytvořte `courses/<slug>/course.js` (vzor: existující kurz) a přidejte `<slug>` do `courses/manifest.js`.
2. Spusťte `node tools/scaffold.mjs`, které vytvoří `index.html` a kostry kapitol.

## Přidání kapitoly

1. Přidejte kapitolu do pole `chapters` v `course.js` (`status: 'planned'`, dokud není hotová, pak `'ready'`).
2. Spusťte `node tools/scaffold.mjs`. Existující kapitoly s obsahem nikdy nepřepíše.

## Psaní kapitoly

Kapitola je HTML soubor. Obsah tvoří `<section>` s nadpisem `<h2>`, ze kterých se automaticky vytvoří číslování a obsah vpravo. Cvičení se zapisuje takto:

```html
<div class="ex" data-type="quiz" data-id="muj-kviz">
  <script type="application/json">
  { "title": "Otázky", "items": [
      { "q": "Otázka?", "pick": ["A", "B", "C"], "answer": 1, "why": "Vysvětlení." }
  ] }
  </script>
</div>
```

Typy: `quiz`, `match`, `classify`, `order`, `cloze`, `flashcards`, `scenario`, `reflect`, `spot`, `taxonomy`, `goalbuilder`, `timeplanner`, `annotate`, `rewrite`, `checklist`, `rubric`, `examsim`, `portfolio`. Vzory najdete v `courses/didaktika-odbornych-predmetu/01-zaklady-didaktiky.html` (základní typy) a v `docs/AUTORSKY-PRUVODCE.md` (úplné JSON schéma každého typu). `data-id` musí být v rámci kapitoly jedinečné a nikdy se neměnit poté, co je jednou použité – ukládá se podle něj postup a na starší `data-id` se mohou odkazovat i jiné kapitoly (`portfolio`, `examsim`).

Šest posledních typů stručně: `annotate` (označování problémů v textu, s HTML v popiscích), `rewrite` (přepiš špatnou formulaci na dobrou), `checklist` (sebehodnocení na škále, např. „jsem připraven/a“), `rubric` (hodnoticí kritéria s úrovněmi), `examsim` (trenažér zkoušky/kolokvia – losuje otázky z poolů, měří čas přípravy a odpovědi, sebehodnocení podle bodů), `portfolio` (sesbírá uložená data z jiných cvičení napříč kapitolami do stažitelného/kopírovatelného shrnutí).

**Příklady podle zaměření:** v konfiguraci cvičení použijte `"byProfile": { "ov": {...}, "inf": {...}, "_": {...} }` (klíč `_` je výchozí varianta). Části textu lze skrýt atributem `data-only="ov,inf"` nebo `data-not="ov"`.

Po úpravě zkontrolujte, že je JSON platný. Chyba se zobrazí přímo v místě cvičení a v konzoli prohlížeče.

## Kontrola kapitoly

Po úpravě obsahu spusťte ve složce projektu:

```bash
node tools/check.mjs courses/<kurz>/<soubor>.html                      # statická kontrola: HTML, sekce, schémata cvičení
python3 tools/autosolve.py --all-profiles courses/<kurz>/<soubor>.html # funkční test: automaticky vyřeší každé cvičení
python3 tools/shots.py courses/<kurz>/<soubor>.html /tmp/shots --slice 1500 [--mobile]  # screenshoty pro vizuální kontrolu
```

`autosolve.py` vyžaduje Playwright (`pip install playwright --break-system-packages && playwright install chromium`, v tomto prostředí je Chromium už nainstalovaný).

## Poznámky

- Postup studentů se ukládá jen v jejich prohlížeči. Web nesbírá žádná data.
- Vlastní úložiště klíč `dps.v1` lze smazat v nastavení (ikona vpravo nahoře).
- `html` má nastavené `scroll-padding-top`/`scroll-padding-bottom` podle výšky pevné horní lišty a spodního stránkování (`assets/css/base.css`) – při úpravě rozměrů `--topbar-h`/`--pager-h` v `tokens.css` je potřeba zachovat i tyto odsazení, jinak `scrollIntoView` může posunout obsah pod pevný prvek.
- `docs/_brief.md` byl pracovní zadání pro autory kapitol a lze ho smazat; obsah, který má trvalou hodnotu (opravy chyb, zdroje), je přenesený do `docs/REVIZE-OBSAHU.md` a `docs/fakta/`.
