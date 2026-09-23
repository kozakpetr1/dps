# Autorský průvodce: jak psát kapitoly

Tento průvodce je závazný pro všechny kapitoly obou kurzů. Vzorová kapitola, podle které se řídí styl i technika: `courses/didaktika-odbornych-predmetu/01-zaklady-didaktiky.html`.

## 1. Pro koho a k čemu

Publikum: učitelé odborného výcviku a odborných předmětů ve střední škole (doplňkové pedagogické studium). Mnozí nemají pedagogické vzdělání, mají ale praxi z oboru a z dílny či učebny. Studují většinou po práci.

Zásady:

1. **Praxe před teorií.** Kapitola začíná situací nebo úkolem, teprve potom přichází pojem „v kostce“. Definice a výčty, které se dají dohledat v učebnici, se zkracují na minimum. Text má vysvětlit, **proč to tak je a jak to poznám ve třídě či dílně**.
2. **Porozumění místo memorování.** Každý pojem se ukazuje na konkrétním příkladu a na protipříkladu. Ke každému pojmu má student aspoň jednou něco **udělat**: rozhodnout, zařadit, přepsat, označit, naplánovat.
3. **První cvičení do ~200 slov.** Nikdo nechce číst dvě obrazovky textu, než na něco klepne.
4. **Příklady podle zaměření.** V kurzu DOP se příklady přizpůsobují profilu studenta (`byProfile`). V kurzu OPD je obecnější, ale příklady jsou stále z odborného vzdělávání (dílna, učebna, praxe, žák učebního oboru, žák maturitního oboru), ne z gymnázia.
5. **Pravdivost.** Nevymýšlejte fakta, čísla, citace ani autory. Když si nejste jisti, ověřte na webu (WebSearch/WebFetch) nebo formulujte opatrně a označte věc do souboru `docs/fakta/…` jako „ověřit“. Zdroje uvádějte jen skutečné. U právních předpisů uvádějte číslo a paragraf jen tehdy, když jste je ověřili; jinak obecně („školský zákon“, „vyhláška o hodnocení žáků“).
6. **Tón.** Vykání, věcný a přátelský, oznamovací způsob. Žádné „je nutno konstatovat“. Věty do ~25 slov. Bez emoji.
7. **Neopisujte prezentace.** Původní slidy jsou podklad, ne osnova. Chyby v nich opravujeme (viz `docs/REVIZE-OBSAHU.md`) a to, co je v nich přehnaně teoretické, nahrazujeme příklady.

## 2. Rozsah a stavba kapitoly

- 5 až 8 `<section>`, každá s `<h2>` a jedinečným `id`. Poslední sekce je „Ověřte si, co víte“ (kvíz, zápis do reflexe, kartičky).
- Cca 1000 až 1800 slov souvislého textu (bez cvičení). 8 až 13 cvičení, **alespoň 5 různých typů**.
- Každá sekce má buď cvičení, nebo kratší pojmový výklad s příkladem, který na cvičení navazuje. Dvě dlouhé pasáže textu za sebou jsou chyba.
- Závěr: kvíz (8–10 otázek) → zápis do reflexe / nástroj (odnese si výstup) → kartičky (8–10).
- Na konci sekce s literaturou `<p class="src">…</p>`: jen skutečné zdroje, česky nebo česky citované.
- Výstupy, které student odnese (cíle, plán, kritéria, reflexe), vždy jako `reflect`, `goalbuilder`, `rubric`, `timeplanner` nebo `checklist`, protože se ukládají a exportují a využije je kapitola 8 (portfolio).

## 3. Kostra souboru

Soubor kapitoly už existuje (kostra z `tools/scaffold.mjs`) a má hlavičku a patičku. **Nahrazujete jen obsah `<article id="chapter">…</article>`.** Nepište `<h1>`, úvodní odstavec ani meta: nadpis, perex (`lead`), počet hodin a doba studia se generují z `course.js`.

```html
<article id="chapter">

<!-- ============ 1 ============ -->
<section id="kratke-id-sekce">
  <h2>Nadpis sekce</h2>
  <p>Text…</p>
  <div class="ex" data-type="quiz" data-id="jedinecne-id">
    <script type="application/json">
    { … }
    </script>
  </div>
</section>

</article>
```

Pravidla technická:

- `data-id` = kebab-case (a–z, 0–9, pomlčky), v rámci kapitoly jedinečné a **po nasazení se už nemění** (podle něj se ukládá postup a vazba na portfolio).
- JSON uvnitř `<script type="application/json">` musí být platný: žádné koncové čárky, žádné komentáře, uvozovky v textu jako „české“ nebo `\"`. Zalomení řádku v textu psát `\n`.
- V textových polích JSON je povolené jednoduché HTML (`<b>`, `<i>`, `<code>`, `<br>`). Nepište `<script>`.
- Nikdy nepoužívejte `<h1>`. `<h3>` je v pořádku pro podnadpisy uvnitř sekce.
- Inline barvy nepoužívejte (výjimka `style="--cc:#hex"` na `.cardx`). Barvy jsou z tokenů (`var(--accent)` …).

## 4. Komponenty pro souvislý text

```html
<!-- Rámečky. Typy: tip (tip), warn (pozor), def (pojem), practice (v praxi), rev (revize/aktuálnost) -->
<div class="callout callout--tip"><div><div class="cl-title">Nadpis</div><p>Text</p></div></div>

<!-- Tabulka (vždy v .table-wrap, kvůli mobilu) -->
<div class="table-wrap"><table class="table"><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>…</td><td>…</td></tr></tbody></table></div>

<!-- Karty (2–4 vedle sebe), --cc je barva karty -->
<div class="cards">
  <div class="cardx" data-c style="--cc:#7aa2ff"><span class="tag">Štítek</span><h4>Nadpis</h4><p>Text</p></div>
</div>

<!-- Kroky -->
<ol class="steps"><li><b>Krok.</b><p>Popis</p></li></ol>

<!-- Slovníček -->
<dl class="glossary"><dt>Pojem</dt><dd>Význam</dd></dl>

<!-- Rozbalovací blok (rozšiřující informace, které nejsou nutné) -->
<details class="acc"><summary>Chci vědět víc</summary><div class="acc-body"><p>…</p></div></details>

<!-- Dialog / modelová konverzace. .me = učitel, .bad = špatná replika, .good = dobrá replika -->
<div class="chat">
  <div class="msg bad"><b>Učitel</b>Text repliky</div>
  <div class="msg good"><b>Učitel</b>Text repliky</div>
</div>

<!-- Dva sloupce (srovnání „špatně / dobře“, „dříve / dnes“) -->
<div class="cols2"><div class="callout callout--warn">…</div><div class="callout callout--tip">…</div></div>

<!-- Schéma jako SVG. Barvy přes currentColor a var(--accent), var(--line), var(--surface-2), var(--tx-2) -->
<figure class="fig"><svg viewBox="0 0 720 240" role="img" aria-label="Popis pro čtečku">…</svg><figcaption>Popisek</figcaption></figure>

<!-- Citace / zdroje -->
<blockquote>Krátká citace bez uvozovek na začátku.</blockquote>
<p class="src">Zdroje k tématu: …</p>
```

Obsah pro konkrétní zaměření: `<div data-only="ov,inf">…</div>` (jen pro tyto profily) a `data-not="ov"` (pro všechny kromě). Profil studenta doplní `<b data-profile-name></b>`. Profily: `ov` (odborný výcvik), `inf`, `eko`, `vs` (veřejná správa), `cr` (cestovní ruch), `um` (umělecké obory).

## 5. Typy cvičení

Každé cvičení: `<div class="ex" data-type="…" data-id="…"><script type="application/json">{…}</script></div>`. Společné klíče: `title` (povinný, krátký), `intro` (HTML nad cvičením) a `byProfile`.

**`byProfile`**: `{ "ov": {…}, "inf": {…}, "_": {…} }`. Obsah profilu se přidá přes základní konfiguraci. Klíč `_` je výchozí varianta pro ostatní profily (ekonomika, veřejná správa, cestovní ruch, umění). Bez `_` se použije `ov`. Vždy dodejte `_`. U kurzu DOP variantu používejte u aspoň 3 cvičení v kapitole, když se příklady oboru liší (spot, classify, quiz, scenario, rewrite, goalbuilder, timeplanner). U OPD jen tam, kde to dává smysl.

> **Pozor na jedinečnost začátků textů.** Automatický test (`tools/autosolve.py`) hledá položky podle prvních 30 až 60 znaků. Otázky kvízu se musí lišit už v prvních 35 znacích, položky `match`/`classify`/`spot` v prvních 30–40 znacích a možnosti odpovědí jedné otázky nesmí být svým začátkem podmnožinou druhé (např. „Cíl“ a „Cíl hodiny“).

### quiz: kvíz s vysvětlením

```json
{ "title": "…", "pass": 0.7, "shuffleItems": true,
  "items": [
    { "q": "Otázka?", "pick": ["A","B","C","D"], "answer": 2, "why": "Proč je to správně (vždy vysvětlete)." },
    { "q": "Vyberte všechny správné.", "pick": ["A","B","C"], "answer": [0,2], "why": "…" },
    { "q": "Tvrzení.", "tf": true, "ok": false, "why": "…" },
    { "q": "Vlastní možnosti s vysvětlením u každé.", "opts": [ { "t": "A", "ok": true, "why": "…" }, { "t": "B", "why": "…" } ] }
  ] }
```

Odpověď `answer` je index v `pick`. Možnosti se míchají. Formulujte chytáky z praxe, ne otázky na zpaměť. Správná odpověď nemá být vždy nejdelší.

### match: přiřazování dvojic

```json
{ "title": "…", "leftTitle": "Situace", "rightTitle": "Pojem", "pairs": [ { "l": "…", "r": "…" } ], "extra": ["Rušivá možnost vpravo"], "after": "Závěrečná poznámka po splnění." }
```

4–7 párů. Pravé strany nesmí být zaměnitelné.

### classify: třídění karet do skupin

```json
{ "title": "…", "instant": true,
  "bins": [ { "id": "a", "name": "Skupina A", "hint": "nepovinné vodítko" }, { "id": "b", "name": "Skupina B" } ],
  "cards": [ { "t": "Text karty", "bin": "a", "why": "Proč sem patří." } ] }
```

2–4 skupiny, 6–12 karet. S `instant: true` student hned vidí, zda trefil (vhodné pro učení). Bez něj se odesílá tlačítkem „Zkontrolovat“ (vhodné pro procvičování).

### order: seřazení do správného pořadí

```json
{ "title": "…", "items": [ { "t": "První krok", "why": "Proč je první." }, "Druhý krok (jen text)" ], "after": "Poznámka." }
```

Položky napište ve správném pořadí (míchají se samy). 4–8 položek, pořadí musí být jednoznačné.

### cloze: doplňování do textu

```json
{ "title": "…", "text": "Cíl začíná [[žákem]] a popisuje jeho [[činnost]].", "bank": ["učitelem", "látkou"], "after": "…" }
```

Správné odpovědi v `[[…]]`. Doplňujte pojmy, které dávají smysl, ne náhodná slova. Volitelná `bank` obsahuje jen **rušivé** (nesprávné) možnosti navíc; správné odpovědi se do nabídky přidají samy.

### flashcards: kartičky

```json
{ "title": "…", "cards": [ { "q": "Otázka?", "a": "Odpověď (může obsahovat <ul>…)" } ] }
```

### scenario: modelová situace s větvením

```json
{ "title": "…", "start": "n1",
  "nodes": {
    "n1": { "who": "nepovinné jméno", "text": "Situace…",
            "choices": [ { "t": "Volba", "to": "n2", "pts": 2, "fb": "Okamžitá zpětná vazba" }, { "t": "Jiná volba", "to": "e1", "pts": 0, "fb": "…" } ] },
    "e1": { "end": true, "title": "Výsledek", "text": "Co se stalo.", "lesson": "Poučení." } } }
```

Body `pts` 0–2 (2 = nejlepší). Každá cesta musí skončit koncem (`end`). Aspoň jedna cesta vede k nejlepšímu konci a existují alespoň dva různé konce. Situace musí být realistická a volby přijatelné (žádné karikatury).

### reflect: vlastní zápis (uloží se, jde exportovat)

```json
{ "title": "…", "file": "dop-kapitola-2-plan", "header": "Nadpis exportovaného souboru", "min": 30,
  "prompts": [ { "id": "tema", "q": "Otázka", "ph": "Nápověda v poli" } ] }
```

`min` je minimální počet znaků na pole. `id` promptů se nemění (používá je portfolio).

### spot: najděte chybu v textu

```json
{ "title": "…", "needed": 0.7,
  "parts": [ "prostý text ", { "t": "klikací úsek, který je špatně", "bad": true, "why": "Proč je to problém." }, " ", { "t": "úsek, který je v pořádku", "bad": false, "why": "Proč je v pořádku." } ] }
```

Text čtěte jako souvislý příběh (`\n\n` = odstavec). 5 chyb a 2–3 nechyby.

### annotate: označte úseky textu kategoriemi

```json
{ "title": "…", "pass": 0.7,
  "categories": [ { "id": "reg", "name": "Regulativní" }, { "id": "afe", "name": "Afektivní" } ],
  "parts": [ "text ", { "t": "úsek", "cat": "reg", "why": "Proč." }, " ", { "t": "úsek bez kategorie", "cat": null, "why": "Proč nic." } ] }
```

Student vybere kategorii a klepe na úseky. 6–12 označitelných úseků, každá kategorie aspoň jednou.

### rewrite: přepište špatný text a dostanete kontrolu

```json
{ "title": "…", "need": 0.7,
  "items": [ {
    "title": "Nadpis příkladu", "situation": "Kontext (HTML).", "bad": "Špatný text, který student přepisuje.",
    "task": "Zadání (např. Přepište zadání tak, aby…).",
    "checks": [
      { "label": "Uvádí kritérium úspěchu", "any": ["\\d+ ?(min|%)", "nejvyse", "aspon"], "hint": "Řekněte, podle čeho poznám úspěch." },
      { "label": "Obsahuje konkrétní čas", "all": ["\\d"], "hint": "…" }
    ],
    "model": "Vzorové řešení. MUSÍ projít všemi vlastními kontrolami.", "minLen": 40 } ] }
```

**Regulární výrazy** v `any`/`all` se testují na textu **malými písmeny a bez diakritiky**, proto je také píšeme bez diakritiky a malými písmeny. `any` = stačí jeden, `all` = musí platit všechny. Backslash v JSON zdvojte (`\\d`). Každá kontrola je „poctivá“: má chytit i alternativní správné formulace (proto víc variant v `any`) a nemá propouštět zjevně špatný text. `tools/autosolve.py` ověří, že `model` projde všemi kontrolami; `check.mjs` hlídá diakritiku.

### checklist: kontrolní seznam / hodnocení na škále

```json
{ "title": "…", "file": "dop-kontrolni-seznam", "header": "Nadpis exportu",
  "items": [ "Položka", { "t": "Položka", "sub": "Vysvětlivka", "group": "Skupina" } ],
  "scale": ["1 – neumím", "2 – učím se", "3 – zvládám"] }
```

Bez `scale` se položky jen zaškrtávají (kontrolní seznam). Se `scale` student každou položku ohodnotí (sebehodnocení, pozorovací arch). Stav se ukládá.

### rubric: nástroj na tvorbu hodnoticí rubriky

```json
{ "title": "…", "levels": ["Výborně", "Dobře", "Nedostatečně"], "minCriteria": 3, "task": "Vytvořte rubriku pro…",
  "example": [ { "name": "Přesnost", "cells": ["odchylka do 0,1 mm", "odchylka do 0,3 mm", "odchylka nad 0,3 mm"] } ],
  "file": "dop-rubrika" }
```

Nástroj kontroluje aspoň `minCriteria` pojmenovaných kritérií, vyplněné buňky (≥ 12 znaků), nejasná slova („dobře“, „pěkně“, „snaží se“) a odlišnost úrovní. `example` musí mít `levels.length` buněk na řádek a alespoň `minCriteria` řádků.

### examsim: trenažér ústní zkoušky

```json
{ "title": "…", "prep": 10, "answer": 15, "needed": 1,
  "pools": [ { "id": "ped", "name": "Pedagogika", "items": [ { "q": "Otázka", "points": ["Bod dobré odpovědi 1", "Bod 2", "Bod 3"], "tip": "Jak odpověď postavit." } ] } ],
  "criteria": ["Uvedl jsem příklad z praxe"] }
```

Losuje 1 otázku z každého poolu, měří přípravu a odpověď, student si označí, které body zmínil. Pool má aspoň 3 otázky a každá aspoň 3 body.

### portfolio: souhrn výstupů z jiných kapitol (pouze DOP 8)

```json
{ "title": "…", "min": 3, "file": "dop-portfolio", "header": "Portfolio", "sources": [
  { "chapter": "01-zaklady-didaktiky", "id": "cil-nastroj", "title": "Moje výukové cíle", "kind": "goals" },
  { "chapter": "01-zaklady-didaktiky", "id": "plan-hodiny", "title": "Plán hodiny", "kind": "reflect", "labels": { "cil": "Cíl hodiny" } } ] }
```

`kind`: `reflect` | `goals` | `rubric` (přidejte `levels`) | `timeplanner` (přidejte `labels`) | `checklist` (přidejte `total`). `id` musí odpovídat `data-id` cvičení v cílové kapitole a u `reflect` `labels` klíčům `id` promptů.

### taxonomy a goalbuilder a timeplanner (specializované nástroje)

Viz vzorová kapitola DOP 1 (`taxonomy` s `domains`, `goalbuilder` s `examples` pro 6 profilů, `timeplanner` s `phases`, `rules`, `presets`). **Předvolby (`presets`) musí dávat součet přesně `duration` a alespoň jedna splňuje všechna pravidla.** Tyto nástroje neopakujte v kapitolách, kde už jsou, pokud to není nutné: použijte je jen v kapitole, kam patří (DOP 1), nebo pro jiný účel s novou konfigurací.

## 6. Jak vybírat typ cvičení

| Cíl | Typ |
|---|---|
| Rozlišit pojmy, pochopit hranice | `classify`, `match` |
| Pochopit postup, logiku | `order`, `cloze`, `scenario` |
| Rozpoznat chybu, kvalitu | `spot`, `annotate`, `quiz` (chytáky) |
| Vytvořit vlastní výstup s kontrolou | `rewrite`, `rubric`, `goalbuilder`, `checklist` |
| Rozhodovat v situaci | `scenario` |
| Uložit vlastní návrh, promýšlet praxi | `reflect`, `checklist`, `timeplanner` |
| Opakovat | `flashcards`, `quiz` |
| Nacvičit zkoušku | `examsim` |

Vyvarujte se kvízu jako jediného cvičení. Jednu kapitolu netvořte jen z výběru odpovědí.

## 7. Kontrola před předáním (povinná)

```bash
node tools/check.mjs courses/<kurz>/<soubor>.html
python3 tools/autosolve.py --all-profiles --shots /tmp/shots courses/<kurz>/<soubor>.html
```

- `check.mjs` hlídá strukturu HTML, platnost JSON, schémata cvičení, diakritiku v regulárních výrazech. **Cíl: 0 chyb a co nejméně varování.**
- `autosolve.py` v prohlížeči projde každé cvičení podle jeho klíče (pro všech 6 profilů, na počítači i mobilu) a hlásí přetečení, chyby v konzoli a nedosažitelná řešení. **Cíl: samé PASS.**
- Prohlédněte si alespoň 2 screenshoty (desktop `_d.png`, mobil `_m.png`; jsou to celé stránky, proto je ořízněte nebo použijte `Read` s ukázkou části) a ověřte, že text není přetékající, cvičení jsou čitelná a rámečky mají správný typ.
- Před dokončením si text přečtěte jako student: nejsou tam pojmy bez vysvětlení, věty zbytečně složité, chybí příklad?

## 8. Časté chyby

- **Cvičení, které hádá.** Odpovědi kvízu se dají vyloučit podle délky, „vždy/nikdy“ je vždy špatně. Přepište.
- **Text jako přednáška.** Více než 250 slov bez cvičení nebo příkladu. Rozdělte nebo doplňte příklad.
- **Pouze IT příklady.** Původní prezentace byly IT/elektro. Příklady z dílny, ekonomiky, veřejné správy a cestovního ruchu jsou zde dostupné přes `byProfile`.
- **Neověřitelné příklady a čísla.** Data a legislativu ověřujte. Údaje, které se mění (RVP, vyhlášky, počty), píšeme s odkazem „stav k 9/2026, ověřte v aktuálním znění“.
- **Označování „správně/špatně“ bez vysvětlení.** Každý `why` má říct **proč**, ne jen že to tak je.
- **Sekce bez `id`, dvojí `data-id`, nevyvážené značky, koncové čárky v JSON.** Chytí `check.mjs`.
