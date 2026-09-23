/* Kurz: Didaktika odborných předmětů */
DPS.registerCourse({
  slug: 'didaktika-odbornych-predmetu',
  title: 'Didaktika odborných předmětů',
  short: 'DOP',
  icon: 'target',
  accent: '#4dd0e1',
  accentLight: '#0e7f93',
  onAccent: '#04222a',
  hours: 12,
  exam: 'Zápočet formou kolokvia (Z)',
  examShort: 'Zápočet – kolokvium',
  examDetail: 'Kolokvium ověřuje teoretické znalosti i aplikační dovednosti v didaktice odborných předmětů. Důraz je na schopnosti propojit teorii s praxí. Podklady na kolokvium vznikají průběžně: cvičení v kapitolách vám uloží vaše cíle, plán hodiny i reflexi, které si na závěr stáhnete.',
  audience: 'Učitelé odborného výcviku a odborných předmětů',
  description: 'Jak naplánovat, vést a vyhodnotit hodinu odborného předmětu nebo odborného výcviku: cíle, struktura hodiny, hodnocení, hospitace, sebereflexe a komunikace. Vše s nástroji, které použijete ve své třídě či dílně.',
  lead: 'Kurz je postavený na vaší vlastní praxi. V každé kapitole si vyzkoušíte konkrétní dovednost (formulaci cíle, plán hodiny, hodnocení, vedení hospitačního rozhovoru) a odnesete si materiál, který použijete v práci.',
  outcomes: [
    'Rozlišujete obecnou, oborovou didaktiku a didaktiku odborného výcviku a používáte taxonomii cílů.',
    'Formulujete měřitelné výukové cíle a navrhujete strukturu vyučovací jednotky.',
    'Provedete didaktickou analýzu a transformaci odborného obsahu do učiva pro žáky.',
    'Zvolíte vhodné metody a připravíte přípravu hodiny nebo instruktáž.',
    'Hodnotíte žáky i výuku objektivně, validně a poskytujete konstruktivní zpětnou vazbu.',
    'Vedete hospitaci včetně pozorování, analýzy a reflektivního rozhovoru.',
    'Využíváte sebereflexi a autoevaluaci pro svůj profesní rozvoj.',
    'Komunikujete při řízení výuky a zvládáte náročné situace.'
  ],
  sources: [
    'LOVEČEK, A., ČADÍLEK, M. <em>Didaktika odborných předmětů</em>. Brno: CERM, 2005.',
    'DRAHOVZAL, J., KILIÁN, O., KOHOUTEK, R. <em>Didaktika odborných předmětů</em>. Brno: Paido, 1997.',
    'SVOBODA, E., BEČKOVÁ, V., ŠVERCL, J. <em>Kapitoly z didaktiky odborných předmětů</em>. Praha: ČVUT, 2004.',
    'VANĚČEK, D. <em>Didaktika technických odborných předmětů</em>. Praha: ČVUT, 2016.',
    'FRIEDMANN, Z., PECINA, P. <em>Didaktika odborných předmětů technického charakteru</em>. Brno: MU, 2013.',
    'MALACH, J. <em>Obecná didaktika pro učitelství odborných předmětů</em>. Ostrava: OU, 2002.',
    'ANDERSON, L. W., KRATHWOHL, D. R. (eds.) <em>A Taxonomy for Learning, Teaching, and Assessing</em>. New York: Longman, 2001.'
  ],
  chapters: [
    {
      slug: '01-zaklady-didaktiky', title: 'Základy didaktiky a výukového procesu', hours: 2, minutes: 75, status: 'ready',
      lead: 'Než začnete plánovat hodinu, musíte vědět, čeho mají žáci dosáhnout a jak to poznáte. V této kapitole se naučíte psát cíle, které jde ověřit, a rozdělit hodinu do fází s rozumným časem.',
      summary: 'Cíle výuky a taxonomie (Bloom, Dave, Krathwohl), provázanost cílů, obsahu, metod a forem. Struktura hodiny a odborného výcviku, plánování času.'
    },
    {
      slug: '02-didakticka-analyza-uciva', title: 'Didaktická analýza a transformace učiva', hours: 2, minutes: 90, status: 'ready',
      lead: 'Odborník často vysvětlí věc správně a žák z ní přesto nepochopí nic. V kapitole se naučíte vybrat jádro učiva, přeložit ho do řeči žáka, zvolit metodu a sestavit přípravu hodiny včetně BOZP a rezervy.',
      summary: 'Postup analýza, transformace, metody a plán a jeho procvičení na 12 cvičeních: výběr jádra učiva, převod odborného textu pro žáka, volba metody a vlastní příprava hodiny.'
    },
    {
      slug: '03-hodnoceni-ve-vyuce', title: 'Hodnocení ve výuce', hours: 2, minutes: 105, status: 'ready',
      lead: 'Uvidíte, proč dvě stejné práce dostanou dvě různé známky a jak tomu předejít kritérii, která žák zná předem. Vyzkoušíte si hodnocení praktického výkonu, přepisování zpětné vazby a napíšete si vlastní rubriku pro úkol, který opravdu zadáváte.',
      summary: 'Rozlišíte funkce a formy hodnocení, poznáte chyby hodnotitele a napíšete pozorovatelná kritéria, rubriku i zpětnou vazbu; vše procvičíte v 15 cvičeních.'
    },
    {
      slug: '04-hospitacni-cinnost', title: 'Hospitační činnost', hours: 1, minutes: 80, status: 'ready',
      lead: 'Hospitace nemusí být stres: naučíte se ji připravit, pozorovat fakta a vést rozhovor, po kterém kolega ví, co dál. Vyzkoušíte si to na dialozích i vlastním pozorovacím archu.',
      summary: 'Rozlišíte typy hospitace, oddělíte popis od hodnocení, vyplníte pozorovací arch a procvičíte reflektivní rozhovor.'
    },
    {
      slug: '05-pedagogicka-sebereflexe', title: 'Pedagogická sebereflexe', hours: 1, minutes: 70, status: 'ready',
      lead: 'Po hodině se dá udělat víc než říct „šlo to“. Naučíte se napsat krátký reflexní zápis, vybrat nástroj sebereflexe a naplánovat vlastní rozvoj.',
      summary: 'Projdete Gibbsův cyklus, vyzkoušíte nástroje sebereflexe, napíšete reflexní zápis a plán profesního růstu.'
    },
    {
      slug: '06-komunikacni-dovednosti-ucitele', title: 'Komunikační dovednosti učitele', hours: 2, minutes: 90, status: 'ready',
      lead: 'Stejné zadání, otázka nebo pokárání může třídu rozjet, nebo zastavit. Vyzkoušíte si konkrétní věty a chování, které si můžete hned ověřit ve vlastní dílně či třídě.',
      summary: 'Naučíte se zadávat úkoly, ptát se, vysvětlovat, používat JÁ-výroky a číst nonverbální signály, a procvičíte to na přepisech vět a dvou scénářích s větvením.'
    },
    {
      slug: '07-aplikace-v-odbornem-predmetu', title: 'Aplikace didaktiky v odborném předmětu', hours: 2, minutes: 110, status: 'ready',
      lead: 'Tady poprvé složíte cíl, aktivitu, ověření, čas a bezpečnost do jedné výukové jednotky, kterou můžete opravdu učit. Odnesete si hotový plán a kontrolní seznam.',
      summary: 'Navrhnete a zkontrolujete celou výukovou jednotku (cíl, jádro učiva, aktivizující metoda, ověření, časový plán, rizika a plán B) a naučíte se vyhodnotit její efektivitu.'
    },
    {
      slug: '08-zaverecne-kolokvium', title: 'Závěrečné kolokvium: příprava a portfolio', hours: null, note: 'závěr kurzu', minutes: 45, status: 'planned',
      summary: 'Sestavte portfolio z cvičení, zkontrolujte se podle kritérií a připravte se na zápočtové kolokvium.',
      outline: ['Přehled výstupů z jednotlivých kapitol', 'Kontrolní seznam ke kolokviu', 'Export portfolia (cíle, plán hodiny, reflexe)']
    }
  ]
});
