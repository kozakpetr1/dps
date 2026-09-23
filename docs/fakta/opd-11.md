# OPD 11 – Příprava na ústní zkoušku: fakta a poznámky

Kapitola: `courses/uvod-do-obecne-pedagogiky-a-didaktiky/11-priprava-na-zkousku.html`. Kapitola nemá
vlastní novou odbornou látku – je to závěrečný trénink (bez hodinové dotace, samostudium ~60 min),
analogický ke kapitole DOP 8 (Závěrečné kolokvium). Obsah (osnova odpovědi, práce s časem přípravy,
trenažér, kartičky, rady) vychází z `docs/AUTORSKY-PRUVODCE.md` a ze zadání v `docs/_brief.md`.

## (a) Nalezené chyby/nedostatky ve starých slidech

Kapitola nevychází ze starých prezentací (žádný slide se netýká přípravy na zkoušku jako takové) –
není tedy co opravovat v tomto smyslu. Rámec zkoušky (2 losované otázky – 1 pedagogika + 1 didaktika,
10 min příprava, 15 min odpověď, poznámky povoleny) je převzat z `examDetail` v `course.js` kurzu OPD.

## (b) Ověřená fakta se zdroji

- Formát zkoušky (2 otázky, 10/15 minut, poznámky povoleny) – `course.js`, pole `examDetail` (zadal
  vyučující, nejde o dohledávané externí fakto). V kapitole je nad `examsim` uvedeno stejně jako
  v `examDetail`, beze změny.
- Osnova dobré odpovědi (pojem/definice vlastními slovy → příklad z vlastní praxe → souvislosti,
  důsledky, návaznost) je stejná osnova, jakou používá kapitola DOP 8 (Závěrečné kolokvium) pro
  kolokviální otázky u kurzu DOP – tam je i formulačně převzatá (`order` cvičení „Seřaďte osnovu
  kolokviální odpovědi“), pro konzistenci obou kurzů.
- Obecná charakteristika ústní zkoušky jako rozpravy nad tématem (na rozdíl od testu uzavřených
  otázek) – FI MU, *Zápočet, kolokvium, zkouška*, fi.muni.cz/students/exam.html.cs (stejný zdroj jako
  v DOP 8).

## (c) Tvrzení k ověření vyučujícím

- Přesná podoba zkoušky (zda se losuje z fyzických lístků, kolik času je na organizaci losování
  apod.) se může lišit – v kapitole je použit jen rámec z `examDetail`, nic nad rámec nevymýšlíme.
- Struktura „pojem → příklad z praxe → souvislosti“ je doporučený, ne jediný možný postup; v kapitole
  je prezentována jako osvědčený vzor, ne jako povinný scénář, který komise vyžaduje doslovně.

## (d) Sestavení poolů trenažéru (`examsim`)

Trenažér v kapitole 11 nepřináší nové otázky – sestavuje dva pooly (`ped` = Pedagogika, `did` =
Didaktika) výběrem z otázek, které si autoři jednotlivých kapitol OPD 1–10 už navrhli a ověřili
v části „(d) Návrhy zkouškových otázek“ vlastních souborů `docs/fakta/opd-*.md`. Věcný obsah (body,
tipy) nebyl měněn – jen jazykově drobně sjednocen (jednotné uvozovky, drobné zkrácení příliš dlouhých
`tip` vět tak, aby se vešly do rozhraní trenažéru) a u některých otázek zkrácen seznam bodů na
4–6 nejdůležitějších, pokud jich zdrojový soubor navrhoval víc.

**Pool Pedagogika (10 otázek, kapitoly 1–4)** – zdroj `docs/fakta/opd-01-02.md` (4 otázky: výchova/
vzdělávání/učení; vědy spolupracující s pedagogikou; dělení disciplín základní/hraniční/aplikované;
tradiční × moderní pojetí), `docs/fakta/opd-03.md` (3 otázky: axiom „nelze nekomunikovat“; regulativní/
afektivní/kognitivní informace; lineární/cyklický/transakční model komunikace), `docs/fakta/opd-04.md`
(3 otázky: výchova–vzdělávání–vzdělání–sebevýchova; výchova jako systém; styly vedení skupiny podle
Lewina × styly rodičovské výchovy podle Baumrindové). Nepoužité otázky (např. o hraničních disciplínách
zvlášť, o rozhovoru s rodičem, o podmínkách výchovy, o činitelích výchovy) zůstávají věcně platné,
jen do poolu o velikosti 8–10 položek s pokrytím celého rozsahu kap. 1–4 nebyly vybrány všechny.

**Pool Didaktika (10 otázek, kapitoly 5–10)** – zdroj `docs/fakta/opd-05.md` (2 otázky: obecná ×
oborová didaktika; systém RVP–ŠVP), `docs/fakta/opd-06-07.md` (3 otázky: klasické výukové metody
podle Maňáka a Švece; volba metody podle cíle/žáků/podmínek; organizační formy podle dvou hledisek),
`docs/fakta/opd-08.md` (2 otázky: individualizace × diferenciace; Montessori × Waldorf), `docs/fakta/
opd-09.md` (1 otázka: stupně podpůrných opatření, PLPP × IVP), `docs/fakta/opd-10.md` (2 otázky:
pedagogická diagnostika × nálepkování; hodnocení × klasifikace × známka). Výběr cílil na rovnoměrné
pokrytí všech šesti kapitol (5–10) při zachování limitu cca 8–10 otázek v poolu.

`needed: 1` (ne 2): `tools/autosolve.py` u `examsim` simuluje jen jedno losování/přípravu/odpověď/
uložení výsledku (viz `solve()` v `tools/autosolve.py`, blok `if typ == 'examsim'`), bez opakování.
Stejné omezení řešila kapitola DOP 8 stejným způsobem (`needed: 1`). Pro reálného studenta to
neznamená, že si smí vyzkoušet zkoušku jen jednou – tlačítko „Losovat další otázky“ funguje
opakovaně a v úvodním textu nad trenažérem je řečeno, že opakované losování má smysl.

## Kontroly

- `node tools/check.mjs courses/uvod-do-obecne-pedagogiky-a-didaktiky/11-priprava-na-zkousku.html`
- `python3 tools/autosolve.py --all-profiles --shots /tmp/shots_opd11 courses/uvod-do-obecne-pedagogiky-a-didaktiky/11-priprava-na-zkousku.html`
- `python3 tools/shots.py … /tmp/shots_opd11 --slice 1500` (desktop) a `--mobile`

Výsledky viz zpráva na konci úkolu.
