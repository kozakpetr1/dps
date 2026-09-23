# Revize obsahu původních prezentací

Tento dokument shrnuje, co bylo při přípravě webu změněno oproti původním prezentacím, kde se v nich našly nepřesnosti a co je ještě potřeba ověřit. Obsahuje zjištění ze všech 19 kapitol obou kurzů (stav: web dokončen, září 2026). Podrobnější poznámky jednotlivých autorů kapitol (včetně úplných seznamů zdrojů a navržených zkouškových otázek) zůstávají pro referenci ve složce `docs/fakta/` – tento dokument je jejich shrnutím pro rychlou orientaci a review.

## Zásady přepisu

1. **Praxe před teorií.** Kapitola začíná situací (hodina, která se nepovedla, spor s rodičem, žák bez motivace), teprve potom následuje pojem „v kostce“ a cvičení. Definice a výčty, které se dají dohledat v učebnici, jsou zkrácené na nezbytné minimum.
2. **Příklady pro odborné vzdělávání.** Původní příklady byly téměř výhradně z informatiky a elektrotechniky (šifrování, Ohmův zákon, kybernetická bezpečnost). Studium je určeno učitelům odborného výcviku a odborných předmětů, proto jsou příklady rozdělené podle zaměření (přepínač vpravo nahoře): odborný výcvik, informatika, ekonomika, veřejná správa, cestovní ruch a umělecké obory.
3. **Chybějící témata se doplňují.** Ze sylabu na kurz nebo u zkoušky se objevují témata, která v prezentacích chyběla (společné vzdělávání a podpůrná opatření, Montessori a Začít spolu, organizační formy výuky, individualizace, pedagogická diagnostika). Ta jsou napsaná nově z ověřených zdrojů (viz níže u jednotlivých kapitol).
4. **Zkouškové okruhy zůstávají.** Obsah kapitol pokrývá okruhy z prezentace „Obecná pedagogika“ a z požadavků na kurz. Závěrečná kapitola kurzu Úvod do obecné pedagogiky a didaktiky (OPD 11) i kurzu Didaktika odborných předmětů (DOP 8) jsou určené k nácviku zkoušky/kolokvia – obsahují trenažér sestavený z otázek navržených a ověřených u jednotlivých kapitol (viz `docs/fakta/opd-*.md`, část (d), a `docs/fakta/dop-08.md`).

---

## Kurz Didaktika odborných předmětů (DOP)

### Kapitola 1 – Základy didaktiky (pilot)

Nalezené problémy v původních slidech a jejich řešení:

| Slide | Problém | Jak je to ve webu |
|---|---|---|
| 9 (afektivní cíle) | Příklady neodpovídají úrovním. „Žák hodnotí význam kybernetické bezpečnosti pro firmu“ a „srovná různé strategie řešení a vytvoří vlastní doporučenou strategii“ jsou kognitivní cíle (Hodnotit, Tvořit), ne afektivní. | Afektivní úrovně se ilustrují postoji a chováním (dodržuje zásady i bez kontroly, hájí je před ostatními). |
| 8 | Čtvrtá úroveň je pojmenovaná „Integrování hodnot“. V české literatuře se používá i „Organizace hodnot“ (Krathwohl: *organization*). | Používá se „Organizace hodnot“. |
| 10, 11 (psychomotorické cíle) | „Automatizace – vynaložení minimální energie při maximálním výkonu“ je nepřesné. Příklad k Automatizaci („žák navrhne a sestaví vlastní obvod, vyřeší vzniklé problémy“) popisuje tvořivou kognitivní úlohu, ne zautomatizovanou dovednost. | Automatizace = činnost provedená plynule a bez vědomého řízení. Příklady jsou dovednostní. |
| 19 | Rozlišuje cíle obecné, tematické a dílčí, ale neříká, kdo je stanovuje a že cíl hodiny odvozuje učitel. | Doplněno v sekci „Kdo cíle stanovuje“. |
| 12, 13 | E-learning je uveden jako metoda vyučování. Je to spíše organizační forma nebo prostředek. Provázanost cíl – metoda – hodnocení chybí. | Nová sekce o provázanosti (constructive alignment, Biggs) s cvičením. |
| 14 | Fáze hodiny jsou popsány jen pro teoretickou hodinu. Odborný výcvik má vlastní strukturu (úvodní, průběžná, závěrečná instruktáž). | Doplněno včetně metody TWI a plánovače času pro 90minutový blok výcviku. |
| všechny | Chybí ověřování pochopení, obcházení třídy a závěr hodiny, tedy to, co se v praxi nejčastěji nedaří. | Úvodní cvičení „hodina, která se nepovedla“ a modelová situace s větvením. |

Ověřeno: revidovaná Bloomova taxonomie (Anderson, Krathwohl, 2001) má šest úrovní se slovesnými názvy: Zapamatovat, Porozumět, Aplikovat, Analyzovat, Hodnotit, Tvořit. Původní taxonomie (1956) měla Znalost, Porozumění, Aplikaci, Analýzu, Syntézu a Hodnocení. Daveho taxonomie (1970) má pět úrovní, afektivní taxonomie (Krathwohl, Bloom, Masia, 1964) také pět. Constructive alignment: BIGGS, J. Enhancing teaching through constructive alignment. *Higher Education*, 1996, 32, s. 347–364.

### Kapitola 2 – Didaktická analýza a transformace učiva

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 16–17 | Odporují si v pořadí. Slide 17 říká „odborný obsah → transformace → učivo → analýza → výuka“ (transformace první), slide 16 definuje analýzu jako výběr, strukturování a úpravu učiva a zahrnuje i určení metod. | Jednotný postup **analýza (CO učit) → transformace (JAK přeložit) → metody a plán (JAK učit a ověřit)**, se schématem a rámečkem „Proč je analýza první“. |
| 16 | Výběr metod, forem a prostředků je uveden jako součást didaktické analýzy učiva. | Analýza = výběr a struktura učiva (CO). Metody a formy jsou třetí, samostatný krok. |
| 15, 26 | Nesoulad názvů klíčových kompetencí: slide 20 uvádí šest kompetencí, v RVP SOV jich je osm. | Opatrný výčet názvů z RVP SOV + `callout--rev` s pokynem ověřit názvy v RVP oboru a ve ŠVP školy. |
| 20 | Klíčové kompetence jsou uvedeny s příklady jen z IT. | Cvičení s neutrálními činnostmi (přístroj či program, záznam o závadě, životopis). |
| 22–23 | Přehled metod je dlouhá tabulka s IT příklady, bez úloh. | Detailní přehled metod přesunut do kurzu OPD; DOP 2 má jen výběr šesti metod podle cíle a situace (`byProfile`). |
| 26 | Struktura přípravy nemá BOZP, rezervu ani zjišťování předchozích znalostí. | Tabulka 11 složek přípravy (téma, předchozí znalosti, cíl ABCD, jádro, překlad, metody, pomůcky, časový plán, ověření cíle, BOZP, rezerva). |
| 27 | Ukázka přípravy jen na MS Teams (phishing). | Chybná příprava ve cvičení `spot` (varianty ov/inf/ostatní) a vlastní zápis. |

Ověřená fakta: didaktická transformace (Möhlenbrock, 1982, podle Knechta 2007, s. 73 – „přenesení vědeckého obsahu do podoby srozumitelné žákům“); dvoustupňový systém RVP–ŠVP (edu.gov.cz); osm klíčových kompetencí v RVP SOV (kompetence k učení, k řešení problémů, komunikativní, personální a sociální, občanské, k pracovnímu uplatnění, matematické, digitální/ICT – zdroj NÚOV/nuov.cz, koncepce klíčových kompetencí, a RVP oborů na edu.gov.cz); aktualizace RVP SOV o ICT k 1. 9. 2023, povinnost od 1. 9. 2025, od 9/2025 běží příprava revize RVP SOV (revize.rvp.cz).

**K ověření:** přesné názvy a počet klíčových kompetencí se u různých RVP oborů mírně liší – ověřit v RVP konkrétního oboru; datum zahájení revize RVP SOV je stav k 9/2026.

### Kapitola 3 – Hodnocení ve výuce

Právní stav ověřen proti úplnému znění vyhlášky č. 13/2005 Sb. ke dni 1. 1. 2026 (archiv.msmt.gov.cz).

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 30 | Klasifikace uvedena jako „1–5, A–F“ – písmenná stupnice v předpisu není. | Tabulka „Co stanoví předpisy“ (stupně 1–5, slovní hodnocení, chování, pravidla ve školním řádu). |
| 29 | Míchá funkce hodnocení (informační, motivační…) s typem podle času (diagnostické, formativní, sumativní). | Používá se jen dělení diagnostické/formativní/sumativní + „Formativní neznamená bez známky“. |
| 31–33 | Objektivita, validita, reliabilita bez odlišení, příklady z IT. | Tabulka s otázkou učitele + `byProfile`; reliabilita = náhoda, objektivita = osoba hodnotitele. |
| 36 | Kritéria typu „aktivně přispívá k řešení úkolu“ jsou nepozorovatelná. | Pravidlo pozorovatelnosti + cvičení „přepište vágní kritérium“. |
| 38 | Tykání a rozkazovací způsob v tabulce zpětné vazby; míchá se snaha (nepozorovatelná) s postupem. | Zásady psané oznamovacím způsobem, rozlišen postup od snahy; callout „Sendvič není univerzální“. |
| 57 | Typy zpětné vazby míchají dvě kritéria dělení (funkce × zaměření). | Tabulka funkce × podoba + cvičení „Přepište špatnou zpětnou vazbu“. |
| 29–40 | Všechny příklady z IT/kryptografie. | `byProfile` u 5 cvičení. |

Ověřená fakta (právní): vyhláška č. 13/2005 Sb., § 3 (stupně 1–5, slovní hodnocení, chování, prospěl s vyznamenáním, nehodnocen), § 4 (pravidla hodnocení součástí školního řádu); zákon č. 561/2004 Sb., § 69 odst. 2 (klasifikace/slovně/kombinace), právo na komisionální přezkoušení do 3 pracovních dnů. Zdroj: archiv.msmt.gov.cz (úplné znění k 1. 1. 2026), lawgpt.cz, pracepropravniky.cz, Eurydice. Literatura: Hattie & Timperley 2007 (tři otázky zpětné vazby); Black & Wiliam 1998; Starch & Elliott 1912/1913 (nespolehlivost hodnocení); Thorndike 1920 (halo efekt); Rosenthal & Jacobson 1968 (Pygmalion efekt, metodika kritizována); Chráska 1999; Kolář & Šikulová 2009; Starý & Laufková 2016.

**K ověření:** aktuálnost vyhlášky mezi 1/2026 a 9/2026; přesné číslo odstavce u komisionálního přezkoušení.

### Kapitola 4 – Hospitační činnost

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 42–43 vs. 49 | Slide 42–43 popisují kontrolní hospitaci, slide 49 říká, že hospitující „nehodnotí“ – bez rozlišení typu si odporují. | Tři typy (kontrolní, rozvojová/kolegiální, hospitace začínajícího učitele) v tabulce; hodnotí jen při kontrolní hospitaci. |
| 42 | Pět „cílů“ hospitace se míchá s „typy“ na slidu 43. | Dělení podle toho, kdo hospituje a s jakým účelem. |
| 44 | Tři fáze spojují analýzu a rozhovor do jedné a chybí návazná dohoda. | Pět fází: příprava, pozorování, analýza, reflektivní rozhovor, návazná dohoda. |
| 47 | Splývá popis, interpretace a hodnocení. | Samostatná sekce: popis × interpretace × hodnocení, „zkouška dvou pozorovatelů“. |
| 45 | Odkaz na „protokol v MS Teams“. | Vlastní pozorovací arch (`checklist` se škálou zřetelnosti jevu, ne kvality). |
| 49 | Uzavřené otázky mířící na pocity, chybí příklad špatného rozhovoru. | Dva modelové dialogy (špatný × dobrý), cvičení přepisu soudu na fakt + otevřenou otázku. |

Ověřená fakta: školský zákon č. 561/2004 Sb., § 164 (ředitel odpovídá za odbornou a pedagogickou úroveň); zákon č. 563/2004 Sb., § 24b (uvádějící učitel, adaptační období 2 roky); NPI ČR / projekt SYPO (fáze hospitace, rozlišení studijní × kontrolní). Zdroje: pracepropravniky.cz, edu.gov.cz, zacinajiciucitel.projektsypo.cz.

**K ověření:** aktuálnost § 164 a § 24b; natáčení hodiny se žáky (osobní údaje) – řešeno jen obecným upozorněním.

### Kapitola 5 – Pedagogická sebereflexe

Sebereflexe byla ve slidech uvedena jako výčet nástrojů bez modelu reflexe a bez kritérií úspěchu u plánu rozvoje; doplněny ověřené modely a postup.

Ověřená fakta: Gibbs (1988) – reflexivní cyklus (popis, pocity, hodnocení, analýza, závěr, akční plán); Korthagen (1985) – model ALACT; Schön (1983) – reflektivní praktik; Doran (1981) – SMART cíle (česká varianta písmen se liší od originálu, uvedeno).

**K ověření:** natáčení vlastní hodiny se týká osobních údajů žáků – ve webu jen obecné upozornění „domluvte s vedením školy“, bez odkazu na konkrétní paragraf.

### Kapitola 6 – Komunikační dovednosti učitele

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 57 | „Ověřit porozumění před zadáním“ – lze ověřit až po zadání. | Pořadí zadání a ověření žákovým zopakováním. |
| 57 | Typy zpětné vazby míchají kritéria (viz i DOP 3). | Zpětná vazba přes JÁ-výrok a rozlišení k úkolu/postupu vs. k osobě (Hattie, Timperley). |
| 58 | „Diagnostické × reflektivní“ otázky míchají funkci s tvarem. | Dvě osy: tvar odpovědi × náročnost myšlení. |
| 59 | Chybí bezpečnost (nebezpečné chování se nediskutuje, nejdřív se zastaví). | Scénář nebezpečného chování s větvením. |

Ověřená fakta: Rowe (1986) – čekání po otázce (wait time), při 3 s a víc se zlepšuje kvalita odpovědí; Gordon (Teacher Effectiveness Training, 1974) – JÁ-výrok (3 části); Hattie & Timperley (2007) – 4 úrovně zpětné vazby; Mehrabian (1967) – pravidlo 7-38-55 platí jen pro rozporné signály pocitů, autor sám zdůrazňuje omezenou platnost; školský zákon § 29 odst. 2 (škola zajišťuje bezpečnost a informuje o rizicích).

**K ověření:** bibliografický údaj českého vydání Gordonovy knihy (Malvern, 2015) a Mehrabianova *Silent Messages* (1971) nebyly ověřeny v knihovním katalogu.

### Kapitola 7 – Aplikace v odborném předmětu

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 20, 26, 62 | Klíčové kompetence zkráceně a bez odkazu na RVP (má jich být osm, ne šest). | `callout--rev` s osmi názvy + `match` cvičení. |
| 21 | Ke každému příkladu přiřazeny všechny čtyři kompetence najednou. | Pravidlo: uvádět jen 1–2 kompetence, které je opravdu vidět. |
| 22–23 | Metody míchají kritéria dělení, příklady z IT. | Soustředěno na aktivizující metody, rozhodování situace → metoda, `byProfile`. |
| 26, 61 | Chybí časový plán, bezpečnost, plán B. | Šest částí jednotky (cíl, jádro, aktivita, ověření, čas, rizika/plán B). |
| 63 | PBL a projektová výuka jako totéž; kvíz jako „didaktická hra“. | Rozlišena problémová úloha/případová studie a projekt. |
| 64 | Efektivita výuky smíchána s hodnocením žáků, postoje jako „co hodnotit“. | Efektivita = 4 zdroje dat (výsledky, pozorování, zpětná vazba žáků, čas) + práh úspěchu. |

Ověřená fakta: osm klíčových kompetencí RVP SOV (NÚOV, infoabsolvent.cz); poslední aktualizace RVP SOV 8/2023, povinná od 9/2025 (edu.gov.cz, revize.rvp.cz); aktivizující metody – Maňák & Švec, *Výukové metody*, Paido 2003; constructive alignment – Biggs 1996 (viz DOP 1).

**K ověření:** aktuální znění RVP konkrétního oboru (PDF se nepodařilo vždy dohledat); bibliografie Kalhous & Obst 2002.

### Kapitola 8 – Závěrečné kolokvium: příprava a portfolio

Syntetická kapitola (portfolio + kontrolní seznam + trenažér otázek) – staré prezentace samostatnou kapitolu ke kolokviu neobsahují, je koncepčně nová a nezavádí nová odborná fakta nad rámec kapitol 1–7. Obsah (kontrolní seznam, přiřazení výstupů) vychází přímo z `course.js` (pole `outcomes`, `examDetail`). Trenažér (8 otázek) je nová syntéza témat kapitol 1–7, ne citace ze starých slidů – doporučeno projít před ostrým použitím.

Ověřeno: kolokvium bývá tradičně méně formalizovaná ústní forma zkoušky, často rozprava nad odevzdanou prací/portfoliem (FI MU, *Zápočet, kolokvium, zkouška*) – formulováno opatrně, s doporučením ověřit přesnou podobu u vyučujícího.

---

## Kurz Úvod do obecné pedagogiky a didaktiky (OPD)

### Kapitoly 1–2 – Pedagogika jako věda; Tradiční a moderní pojetí

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 3, 15–24 | Definice a výčty bez příkladu z praxe (přednáškový styl). | Kapitola začíná scénkami ze školy/dílny, teprve pak pojem „v kostce“, s dvojicí příklad/protipříklad. |
| 24 | Tři kritéria dělení disciplín (věk, oblast, zařízení) uvedena vedle dělení základní/hraniční/aplikované – splývá. | Použito jen dělení základní/hraniční/aplikované (odpovídá okruhům ke zkoušce). |
| 25–27 | Výčet 10+ disciplín bez jasného zařazení; zdroje se u některých disciplín rozcházejí. | V `classify` použity jen disciplíny, na kterých se zdroje shodují; u zbytku poznámka v textu. |
| 9–12 | Charakteristiky tradičního/moderního pojetí podány jako uzavřený výčet, moderní sugestivně jako „lepší“. | Podáno jako dva zjednodušené ideální typy, které se v praxi prolínají; `rewrite`/scénář, kdy je tradiční přístup správnou volbou. |
| 8–12 | Chybí příklad z odborného vzdělávání (dílna, SOU). | Modelové hodiny z dílny/odborné učebny. |
| (nikde) | Chybí historické kořeny (Komenský, Herbart, Dewey, konstruktivismus). | Doplněno stručně, jen ověřená fakta. |

Ověřená fakta: definice výchova/vzdělávání/edukace – Průcha, Walterová, Mareš, *Pedagogický slovník*, Portál 2004+; dělení disciplín základní/hraniční/aplikované potvrzeno na dvou nezávislých zdrojích (e-learning.vscht.cz, wiki.knihovna.cz); Komenský (1592–1670, *Didaktika velká*), Herbart (1776–1841, stupně vyučování), Dewey (1859–1952, learning by doing), konstruktivismus (Piaget, Vygotskij) – obecně doložená fakta z dějin pedagogiky.

**K ověření:** zařazení jednotlivých disciplín se u autorů liší (explicitně uvedeno ve webu); přesné roky/díla u klasiků ověřit, pokud je vyučující chce vyžadovat doslovně.

### Kapitola 3 – Pedagogická komunikace

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 53 | „3 základní věty teorie komunikace“ jsou ve skutečnosti 2 z 5 Watzlawickových axiomů + vlastní parafráze, která není samostatným axiomem. | Vysvětleny a procvičeny jen 2 ověřené axiomy, s poznámkou, že jich je celkem pět. |
| 55 | Proxemické zóny bez zdroje, čísla mírně odlišná od ověřeného zdroje. | Čísla opravena podle Halla (cit. dle Wikisofia), označena jako přibližná. |
| 59–69 | 10 pravidel na 10 snímcích, částečně se překrývají, bez příkladu. | Sloučeno do 6 prakticky procvičovaných pravidel s příklady „špatně/dobře“. |
| 72–79 | 4–5 modelů bez schémat (prázdné snímky) a bez ověřených roků/autorů. | Doplněny roky a autoři (Shannon–Weaver 1949, Osgood–Schramm 1954, Barnlund 1970) + čitelná SVG schémata. |
| 78 | Trojúhelník pedagogické komunikace přisouzen „J. Průcha“ bez ověřitelného zdroje. | Uveden bez vázání na konkrétního autora. |
| 80–86 | Nezmiňuje rozdíl zletilý/nezletilý žák SŠ u práva na informace. | Doplněna sekce dle školského zákona § 21, formulováno opatrně. |
| 87–92 | Prázdné snímky o komunikaci mezi kolegy. | Nahrazeno scénářem konfliktu mistr OV × učitel odborných předmětů. |

Ověřená fakta: Watzlawick, Beavin Bavelasová, Jackson (1967) – 5 axiomů komunikace; Shannon–Weaver (1949) – lineární model; Osgood–Schramm (1954) – cyklický model; Barnlund (1970) – transakční model; proxemické zóny (E. T. Hall, dle Wikisofia); školský zákon § 21 odst. 2–3 – právo na informace u nezletilého žáka mají zákonní zástupci, u zletilého i jeho rodiče (výživová povinnost).

**K ověření:** § 21 odst. 3 citován z právnických portálů, ne přímo z e-sbírky; přesné bibliografické údaje (ISBN) českého vydání Watzlawicka.

### Kapitola 4 – Výchova a vzdělávání jako pedagogické kategorie

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 31 | Míchá styl vedení skupiny (Lewin, 1939) se stylem rodičovské výchovy (Baumrindová), nejasné, jde-li o rodinu, nebo třídu. | Důsledně rozlišeny dva výzkumy a kontexty (Lewin – vedení skupiny; Baumrindová – rodičovská výchova), s cvičením na přiřazení. |
| 32 | „Opičí láska“ – hovorový, hodnoticí termín. | Nahrazeno „nadměrně ochranná výchova“. |
| 32 | 3+3 typy výchovy v jednom seznamu bez zdroje. | Doplněno, že čtvrtý styl (zanedbávající) doplnili Maccoby a Martin (1983). |
| 49 | Lewinova topologie učitele (demokratický/autokratický/liberální) uvedena s odkazem jen v poznámkách, bez vazby na slide 31–32 se stejnými nálepkami pro rodinu. | Topologie učitele explicitně spojena s Lewinovým výzkumem, rodičovské styly jako oddělený pojem pro srovnání. |
| 33 | Chybí „záměrnost“ jako klíčový rys výchovy. | Doplněna mezi obecné rysy s protipříkladem. |
| 34–47 | Prvky systému výchovy jako suchý výčet bez schématu. | SVG schéma + `classify` situace → prvek systému. |

Ověřená fakta: Lewin, Lippitt, White (1939) – styly vedení skupiny (autokratický, demokratický, laissez-faire); Baumrind (1966, 1967) – styly rodičovské výchovy (autoritářský, autoritativní, permisivní); Maccoby & Martin (1983) – čtvrtý styl (zanedbávající/odmítavý); základní pedagogické kategorie a systém výchovy – Jůva 2001, Prokešová 2018, Kohout 2018 (literatura ze sylabu kurzu); Průcha, Walterová, Mareš – *Pedagogický slovník* (sebevýchova).

**K ověření:** přesný počet/znění „obecných rysů výchovy“ se mezi učebnicemi liší; termín „laissez-faire“ vs. „liberální“ – potvrdit preferovaný termín u zkoušky.

### Kapitola 5 – Obecná didaktika, výukové cíle a učivo

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 7–12 | Šest „úrovní poznání“ nekonzistentně míchá Bloomovu taxonomii (syntéza a aplikace spolu, dedukce/indukce jako úrovně). | Nepřebírá se jako samostatný model; odkaz na taxonomii procvičenou v DOP 1 (Anderson, Krathwohl, 2001). |
| 13–20 | Sedm didaktických zásad bez zdroje a bez upozornění na rozdíly mezi autory. | Sedm zásad s příkladem z odborného výcviku + upozornění na rozdíly mezi autory; zásada vědeckosti vynechána z hlavního výčtu. |
| 21–23 | Cíle jen výčtem vlastností, bez rozlišení úrovně stanovení. | Rozlišení cíl vzdělávání (RVP, oboru) × cíl hodiny (učitel), důraz na ověřitelnost. |
| 24–32 | Zastaralé detaily (odkaz na zaniklý NÚV, rok 2004), ŠVP bez zmínky, že osnovy jsou dnes jeho součástí. | Aktuální popis dvoustupňového modelu RVP–ŠVP, `callout--rev` k ověření aktuálního stavu revize RVP SOV. |

Ověřená fakta: dvoustupňový systém RVP–ŠVP (edu.gov.cz); typy RVP (PV, ZV, G, SOV, SV); revize RVP SOV probíhá průběžně (kurikula.ai, stav 9/2026); učební plán a osnovy jsou součástí ŠVP; didaktické zásady tradičně spojované s Komenským, seznam se liší 7–9 zásad dle autora (wiki.knihovna.cz s odkazem na Podlahovou 2012, Malacha 2003, Pavlíka 1949).

**K ověření:** přesný seznam a počet didaktických zásad; aktuální harmonogram revize RVP SOV se může měnit; zásada vědeckosti – potvrdit, zda ji vyučující vyžaduje samostatně.

### Kapitoly 6–7 – Metody výuky; Organizační formy výuky

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 39 | „Komplexní výukové metody“ míchají metody, organizační formy a prostředky bez rozlišení. | Vysvětleno, že Maňák a Švec (2003) je sami takto souhrnně označují; `classify` na rozlišení metoda/forma/prostředek. |
| 34 | Tři funkce metod bez příkladu a bez vazby na volbu metody. | Funkce se neučí izolovaně; návaznost na cíl z OPD 5/DOP 1. |
| 66 | Čísla u brainstormingu (7–12 účastníků, 30–45 min) bez zdroje, jako fakt. | Označeno jako orientační doporučení, ne norma. |
| 57 | Situační metody jen z prostředí dospělých/managementu. | Příklad z reálné praxe oboru (reklamace v cestovním ruchu/dílně), `byProfile`. |
| 69 | Organizační formy míchají skutečné formy, metody (problémové/projektové vyučování) a produkty (referáty) v jednom seznamu. | Formy důsledně odděleny od metod; `classify` „forma, metoda, nebo prostředek?“. |
| 69 | Chybí specifika organizace praktického vyučování (dílna vs. pracoviště zaměstnavatele, limit žáků na instruktora). | Sekce „Organizace odborného výcviku“ s ověřenými fakty z vyhlášky č. 13/2005 Sb. |

Ověřená fakta: Maňák & Švec (2003) – klasifikace výukových metod (slovní, názorně-demonstrační, dovednostně-praktické; aktivizující; komplexní), ověřeno i sekundárně (Červenková, OU Ostrava); vyhláška č. 13/2005 Sb., § 13 odst. 1 a 6 – instruktor na smluvním pracovišti vede nejvýše 6 žáků; § 2 odst. 5 – o dělení tříd na skupiny rozhoduje ředitel podle bezpečnosti a náročnosti předmětu (zkola.cz, úplné znění k 1. 1. 2025).

**K ověření:** čísla u brainstormingu; maximální počty žáků ve skupině přímo ve škole (na rozdíl od jasného limitu 6 žáků u instruktora na smluvním pracovišti) nejsou v kapitole uvedeny číslem – svěřeno rozhodnutí ředitele školy podle vyhlášky, přesná čísla u jednotlivých činností (§ 13–15) nebyla do detailu ověřována.

### Kapitola 8 – Individualizace a alternativní školské koncepce

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 75 | Daltonský plán datován „1905“ – nepřesné. | Opraveno na rok 1920 (Dalton, Massachusetts), autorka Helen Parkhurstová. |
| 82 | Jenská škola „založena 1923“ – neodpovídá zdrojům. | Opraveno na rok 1927 (kongres, kdy koncept dostal jméno), autor Peter Petersen, formulace „od poloviny 20. let“. |
| 68, 84, 85 | „Otevřené učení“, „otevřená škola“, „Francouzská moderní škola“ bez jmen a dat, riziko záměny s pojmenovanými koncepcemi. | Soustředěno na dobře doložitelné koncepce (Montessori, Waldorf, Dalton, Jenský plán, Winnetka, Začít spolu); Freinet zmíněn stručně v `details.acc`. |
| 74–85 | Chybí Montessori a Začít spolu, přestože je vyžaduje sylabus. | Doplněno z ověřených zdrojů. |

Ověřená fakta: individualizace (přizpůsobení jednotlivci) × diferenciace (organizační rozdělení do skupin) – DIGIFOLIO RVP.cz, CAPV; Montessori (1870–1952) – 1907 Casa dei Bambini, Řím; Waldorf – Rudolf Steiner, 1919 Stuttgart; Daltonský plán – Helen Parkhurstová, 1920, Dalton (Massachusetts); Jenský plán – Peter Petersen, koncept pojmenován 1927; Winnetka plan – Carleton Washburne, od 1919; Začít spolu (Step by Step) – v ČR od 1994 (MŠ) a 1996 (1. stupeň ZŠ). Systém škol v ČR: i alternativní školy vyučují podle ŠVP navazujícího na RVP, nejde o samostatný právní typ školy.

**K ověření:** přesný právní status alternativních škol v ČR (financování) – jen obecně, `callout--rev`; rok 1927 u Jenského plánu je datum pojmenování konceptu, samotná škola mohla fungovat o něco dříve.

### Kapitola 9 – Společné vzdělávání a podpůrná opatření

Staré prezentace téma vůbec neobsahují (ověřeno grep na klíčová slova „podporn“, „asisten“, „SVP“, „inkluz“, „integrac“, „nadan“ – nic nenalezeno) – kapitola psaná zcela nově podle sylabu (`req_uop.txt`). Zdroje zákona/vyhlášky se nepodařilo stáhnout přímo (zakonyprolidi.cz vrací 403, PDF MŠMT nešlo stáhnout přes WebFetch), proto jsou formulace v kapitole záměrně opatrné s `callout--rev`.

Ověřená fakta (ze sekundárních zdrojů: pracepropravniky.cz, e-sbirka.gov.cz, sancedetem.cz, zapojmevsechny.cz, katalogpo.upol.cz, edu.gov.cz): právní rámec – školský zákon č. 561/2004 Sb. § 16 a vyhláška č. 27/2016 Sb.; žák se SVP = širší okruh než jen zdravotní postižení; 5 stupňů podpůrných opatření (1. stupeň řeší škola sama plánem pedagogické podpory PLPP, bez doporučení ŠPZ; od 2. stupně nutné doporučení školského poradenského zařízení – PPP/SPC – a písemný souhlas zákonného zástupce, zpracovává se individuální vzdělávací plán IVP); od 1. 1. 2026 se mění financování (zřizovatel hradí i materiální náklady), samotné stupně/PLPP/IVP se nemění; asistent pedagoga pracuje podle pokynů učitele, plánování a hodnocení zůstává odpovědností učitele, náplň práce se liší podle kvalifikace asistenta; rozdíl integrace (žák se přizpůsobuje systému) × inkluze/společné vzdělávání (systém se přizpůsobuje žákovi); nadaní žáci jsou řešeni ve stejné vyhlášce (č. 27/2016 Sb.).

**K ověření (důležité – právní téma, doporučeno ověřit před výukou):** přesná hranice mezi 1. stupněm a nutností doporučení ŠPZ; zda se od 1. stupně vyžaduje písemný souhlas zákonného zástupce, nebo jen informování; přesné číslo paragrafů k nadaným žákům (§ 27–31 uvedeno jako nejisté); zda mezi 9/2025 a 9/2026 nedošlo k další novele nad rámec změny financování od 1. 1. 2026; přesná definice kvalifikačních stupňů asistenta pedagoga.

### Kapitola 10 – Pedagogická diagnostika a hodnocení ve výuce

| Slide | Problém | Řešení ve webu |
|---|---|---|
| 86–91 | Odrážkové výčty bez příkladů, definice diagnostiky opsaná téměř doslovně z jednoho zdroje. | Kapitola začíná konkrétní situací (nový žák, který „nedrží postup“), definice staví na rozdílu od „nálepkování“. |
| 87 | Rovnítko „evaluace“ = „hodnocení“ bez odlišení od klasifikace a známky. | Rozlišení hodnocení (proces) × klasifikace (forma) × známka (stupeň) s cvičením. |
| 88 | Osm zásad diagnostiky vyjmenovaných bez příkladu. | Zůstávají jen zásady prakticky ukazatelné na úvodní situaci. |
| 89–91 | Metody ve třech oddělených seznamech bez příkladu použití, didaktický test mezi nimi bez odlišení. | Tabulka „potřeba → metoda“; didaktický test vyčleněn do samostatné sekce. |
| 90 | Sociometrická šetření zmíněna jedním slovem. | Doplněn autor (J. L. Moreno) a vysvětlení (sociogram). |
| chybí | Validita/reliabilita/objektivita testu, typy úloh, chyby hodnotitele. | Doplněno nově, s odkazem na hlubší rozpracování v DOP 3 (aby se obsah nekryl). |

Ověřená fakta: definice pedagogické diagnostiky – Pedagogický lexikon RVP (wiki.rvp.cz); metody diagnostiky (pozorování, rozhovor, dotazník, analýza produktů, didaktický test, sociometrie); J. L. Moreno – autor sociometrie; didaktický test – standardizovaný × nestandardizovaný, otevřené × uzavřené úlohy (Pedagogický lexikon RVP, ČŠI, Chráska 1999); klasifikace je užším pojmem hodnocení, známka je konkrétní stupeň; chyby hodnotitele (halo efekt, Pygmalion efekt – převzato z DOP 3) doplněné o Golem efekt a chybu centrální tendence (obecně známé jevy, bez jednoho konkrétního zdroje).

**K ověření:** přesná hranice „pedagogická × didaktická diagnostika“ – v dostupných zdrojích nejednotná; Golem efekt a vztahové normy hodnocení (normativní/kriteriální/ipsativní) čerpány z obecné znalosti oboru bez jednoho konkrétního citovatelného zdroje.

### Kapitola 11 – Příprava na ústní zkoušku

Kapitola nemá vlastní novou odbornou látku – je to závěrečný trénink analogický ke kapitole DOP 8, nevychází ze starých prezentací (netýkají se přípravy na zkoušku). Rámec zkoušky (2 losované otázky – 1 pedagogika + 1 didaktika, 10 min příprava, 15 min odpověď, poznámky povoleny) je převzat z `course.js` (`examDetail`), zadal ho vyučující. Trenažér (`examsim`) sestavuje dva pooly po 10 otázkách (Pedagogika z kapitol 1–4, Didaktika z kapitol 5–10) výběrem z otázek navržených a ověřených autory jednotlivých kapitol (`docs/fakta/opd-*.md`, část (d)); věcný obsah nebyl měněn, jen jazykově sjednocen. Nepoužité otázky zůstávají věcně platné v `docs/fakta/`, jen se nevešly do limitu ~10 otázek na pool.

**K ověření:** přesná podoba zkoušky (losování z lístků apod.) – v kapitole jen rámec z `examDetail`.

---

## Souhrn: nejdůležitější věci k ověření před použitím kurzu

Napříč všemi kapitolami se opakují tři okruhy, kde web záměrně volí opatrné formulace (`callout--rev`) místo tvrdého tvrzení, a kde by vyučující měl před výukou ověřit aktuální stav:

1. **Právní úprava a kurikulární dokumenty** – zejména kapitola OPD 9 (podpůrná opatření, PLPP/IVP, asistent pedagoga – zdroje se nepodařilo stáhnout přímo z e-sbírky, jen sekundárně), dále klasifikace a hodnocení na SŠ (DOP 3, vyhláška č. 13/2005 Sb., ověřeno k 1. 1. 2026), organizace odborného výcviku (OPD 7, vyhláška č. 13/2005 Sb.) a klíčové kompetence v RVP SOV (DOP 2, DOP 7 – názvy se u jednotlivých oborů mírně liší). Doporučeno ověřit zejména před výukou OPD 9.
2. **Probíhající revize RVP** – zmíněna v DOP 2, DOP 7 a OPD 5 jako „stav k 9/2026, ověřte aktuální znění“; harmonogram se může v průběhu roku měnit.
3. **Pojmy bez jednoho jasně citovatelného zdroje** – ve webu uvedeny jako obecně užívané, ale bez tvrdého přiřazení autorství (např. didaktický trojúhelník v OPD 3, Golem efekt a vztahové normy hodnocení v OPD 10, „laissez-faire“ vs. „liberální“ v OPD 4). U těchto pojmů web vždy říká, že jde o zjednodušení nebo že se zdroje rozcházejí.

Podrobný seznam zdrojů, citací a dalších bodů k ověření u každé jednotlivé kapitoly je v `docs/fakta/<kurz>-<NN>.md`.
