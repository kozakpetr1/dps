# DOP 8 – Závěrečné kolokvium: příprava a portfolio – ověřená fakta

Poznámka: DOP 8 je syntetická kapitola (portfolio + kontrolní seznam + trenažér otázek), nová fakta o odborných tématech didaktiky nezavádí – ta jsou už ověřená a zdrojovaná v kapitolách 1–7 (viz `docs/fakta/dop-02.md`, `dop-03.md`, `dop-04-05.md`, `dop-06-07.md`). Zde jsou proto jen věci specifické pro tuto kapitolu.

## (a) Nalezené chyby/nedostatky ve starých slidech

Staré prezentace (`do.txt`) samostatnou kapitolu ke kolokviu neobsahují – shrnující, propojující kapitola je koncepčně nová (viz `course.js`, kap. 8: „Přehled výstupů z jednotlivých kapitol“, „Kontrolní seznam ke kolokviu“, „Export portfolia“). Nebylo tedy co opravovat; tabulka slide/problém/řešení se proto nevyplňuje.

## (b) Ověřená fakta se zdroji

| Tvrzení ve webu | Ověření / zdroj |
|---|---|
| Kolokvium bývá tradičně spíše ústní, méně formalizovaná forma ukončení předmětu než klasická zkouška – často podoba rozpravy nad odevzdanou prací, projektem nebo portfoliem, ne systém uzavřených otázek | FI MU, Zápočet, kolokvium, zkouška (fi.muni.cz/students/exam.html.cs): „Kolokvium je méně náročná zkouška… může být v podobě eseje, projektu, testu nebo rozhovoru.“ Obecná charakteristika, ne specifikace přímo pro DPS – proto ve webu formulováno opatrně („kolokvium bývá“, „ověřte si u vyučujícího přesnou podobu“) a doplněno `callout--rev`. |
| Popis zápočtu kolokviem u kurzu DOP (důraz na propojení teorie s praxí, podklady vznikají průběžně z cvičení v kapitolách) | Přímo z `course.js` kurzu DOP, pole `examDetail` – autoritativní zdroj v rámci projektu, není třeba ověřovat externě. |
| Výstupy kurzu (8 bodů) použité jako osnova kontrolního seznamu `pripravenost-kolokvium` | Přímo z `course.js` kurzu DOP, pole `outcomes`. Kontrolní seznam jen přeformuloval každý výstup do sebehodnoticí věty (případně rozdělil jeden výstup do dvou položek, když zahrnoval dvě dovednosti), fakticky nic nepřidává. |
| Data-id klíčových uložitelných cvičení z kapitol 1–7 použitá jako `sources` portfolia | Ověřeno přímým čtením zdrojových souborů kapitol 1–7 (grep na `data-type="(reflect|rubric|checklist|goalbuilder|timeplanner)"` + `data-id`), ne z tohoto zadání natvrdo. Přesný výčet a typ (`kind`) u portfolia byl dále ověřen v `assets/js/ex-more.js` (funkce `collect()` u `portfolio`), aby datové klíče (`goals`, `rows`, `rows[].cells`, prompt id u `reflect`, index položek u `checklist`) odpovídaly tomu, co ukládají cvičení `goalbuilder`, `reflect`, `rubric`, `checklist` v `assets/js/ex-widgets.js` a `assets/js/ex-more.js`. |
| Formát ukládání do `localStorage` (jeden klíč `dps.v1`, vnořená cesta `progress.<kurz>.<kapitola>.data.<id>`) | Ověřeno čtením `assets/js/core.js` (`DPS.store`, `DPS.progress.getData/setData`) – použito při přípravě testovacího seedu pro portfolio (viz kontrola níže), ne jako tvrzení v textu kapitoly. |

## (c) Tvrzení k ověření vyučujícím

- Přesná podoba kolokvia (kolik otázek, zda společně nebo jednotlivě, zda se portfolio odevzdává předem nebo se nosí s sebou) není v zadání kurzu specifikována nad rámec `course.js` (`examDetail`). V kapitole je to záměrně formulováno obecně a s doporučením ověřit si konkrétní formu u vyučujícího (`callout--rev` v úvodní sekci).
- Trenažér kolokvia (`examsim`) používá orientační časy přípravy a odpovědi (8 a 10 minut) jen jako nácvikový rámec, ne jako tvrzení o skutečné délce zkoušení – v textu je to výslovně uvedeno, aby si to student nespletl se skutečným formátem (na rozdíl od OPD, kde je 10/15 minut dané zadáním kurzu).
- Osm otázek trenažéru byly sestaveny nově pro tuto kapitolu (syntéza témat kapitol 1–7), nejde o citace ze starých slidů ani o převzaté zkušební otázky školy – vyučující by je měl před ostrým použitím projít, zda odpovídají tomu, na co se u kolokvia skutečně ptá.

## Technická kontrola (viz konečná zpráva)

Kontrola `check.mjs`, `autosolve.py --all-profiles` (včetně `portfolio`, kde autosolve pouze ověří vykreslení) a ruční Playwright test se zaseteými daty v `localStorage` (ověření, že `portfolio` správně načte zdroje ze všech pěti typů – `goals`, `reflect`, `checklist`, `rubric` – a že export/kopírování funguje) jsou popsané v závěrečné zprávě agenta, ne v tomto souboru.
