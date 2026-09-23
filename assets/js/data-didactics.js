/* ==========================================================================
   Sdílená data pro didaktické widgety: taxonomie cílů (kognitivní, afektivní,
   psychomotorické), příklady podle zaměření, „vágní“ slovesa.
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS;

  var COL = ['#6ea8ff', '#4fd1c5', '#5fdb9a', '#ffd166', '#ff9f6b', '#ff7a9c'];

  var kog = {
    id: 'kog', name: 'Kognitivní', sub: 'poznávání, myšlení', author: 'Bloom (1956), revize Anderson & Krathwohl (2001)',
    levels: [
      {
        id: 'zapamatovat', name: 'Zapamatovat', q: 'Dokážu si vybavit a rozpoznat fakta?',
        def: 'Žák si vybaví informaci z paměti. Zatím nemusí chápat, proč platí.',
        verbs: ['vyjmenuje', 'pojmenuje', 'definuje', 'uvede', 'označí', 'přiřadí', 'rozpozná', 'zopakuje', 'vybere ze seznamu'],
        ex: {
          ov: 'Žák vyjmenuje osobní ochranné pracovní prostředky používané při svařování.',
          inf: 'Žák pojmenuje základní součásti počítačové sítě (switch, router, přístupový bod).',
          eko: 'Žák vyjmenuje povinné náležitosti faktury.',
          vs: 'Žák uvede orgány obce a jejich základní role.',
          cr: 'Žák vyjmenuje základní služby cestovního ruchu (ubytování, stravování, doprava, průvodcovské služby).',
          um: 'Žák pojmenuje základní a doplňkové barvy na barevném kruhu.'
        },
        ex2: {
          ov: 'Žák uvede správné pořadí kroků při zapnutí a vypnutí soustruhu podle provozního řádu.',
          inf: 'Žák vyjmenuje sedm vrstev modelu ISO/OSI.',
          eko: 'Žák uvede sazby DPH platné v České republice.',
          vs: 'Žák uvede lhůtu pro podání odvolání proti rozhodnutí správního orgánu.',
          cr: 'Žák vyjmenuje hlavní turistické oblasti České republiky.',
          um: 'Žák pojmenuje základní grafické techniky (linoryt, dřevoryt, lept).'
        }
      },
      {
        id: 'porozumet', name: 'Porozumět', q: 'Chápu, co to znamená a proč to platí?',
        def: 'Žák vlastními slovy vysvětlí význam, uvede vlastní příklad nebo věc shrne.',
        verbs: ['vysvětlí', 'shrne', 'popíše vlastními slovy', 'uvede příklad', 'porovná', 'klasifikuje', 'interpretuje', 'odhadne'],
        ex: {
          ov: 'Žák vlastními slovy vysvětlí, proč se při soustružení volí jiné řezné rychlosti pro ocel a pro hliník.',
          inf: 'Žák vysvětlí rozdíl mezi symetrickým a asymetrickým šifrováním na příkladu ze života.',
          eko: 'Žák vysvětlí rozdíl mezi náklady a výdaji na příkladu malé firmy.',
          vs: 'Žák vysvětlí rozdíl mezi samostatnou a přenesenou působností obce.',
          cr: 'Žák vysvětlí rozdíl mezi individuální a organizovanou turistikou.',
          um: 'Žák vysvětlí, jak rozložení prvků v kompozici ovlivňuje vnímání obrazu.'
        },
        ex2: {
          ov: 'Žák vysvětlí, proč se před svařováním musí materiál očistit od rzi a mastnoty.',
          inf: 'Žák vlastními slovy vysvětlí, k čemu slouží server DHCP.',
          eko: 'Žák vysvětlí, proč firma s vysokým ziskem může mít problémy s platební schopností.',
          vs: 'Žák vysvětlí, proč se správní orgán nemůže rozhodovat mimo rámec zákona (zásada legality).',
          cr: 'Žák vysvětlí, co znamená sezónnost v cestovním ruchu a jak ovlivňuje ceny.',
          um: 'Žák vysvětlí, proč se pro tisk a pro obrazovku používají jiné barevné modely (CMYK a RGB).'
        }
      },
      {
        id: 'aplikovat', name: 'Aplikovat', q: 'Umím to použít v konkrétní situaci?',
        def: 'Žák použije naučený postup nebo pravidlo v konkrétním úkolu.',
        verbs: ['použije', 'provede', 'vypočítá', 'vyřeší', 'změří', 'zapojí', 'nastaví', 'předvede'],
        ex: {
          ov: 'Žák podle výkresu změří průměr hřídele posuvným měřidlem a výsledek zapíše s přesností 0,05 mm.',
          inf: 'Žák napíše SQL dotaz, který z tabulky zákazníků vybere ty z Ostravy seřazené podle příjmení.',
          eko: 'Žák vypočítá prodejní cenu zboží včetně 21 % DPH a 15 % marže.',
          vs: 'Žák v modelovém případu určí lhůtu pro vydání rozhodnutí podle správního řádu.',
          cr: 'Žák podle ceníku vypočítá cenu zájezdu pro skupinu 20 osob včetně slev.',
          um: 'Žák použije techniku lavírování k vytvoření plynulého barevného přechodu podle zadání.'
        },
        ex2: {
          ov: 'Žák podle tabulky řezných podmínek nastaví otáčky vřetena pro soustružení hřídele z oceli.',
          inf: 'Žák nastaví na routeru statickou IP adresu a ověří spojení příkazem ping.',
          eko: 'Žák zaúčtuje přijatou fakturu za materiál podle zadaných údajů.',
          vs: 'Žák podle zadání vyplní formulář žádosti o vydání dokladu a určí příslušný správní orgán.',
          cr: 'Žák podle zadaných údajů sestaví kalkulaci ceny pobytu pro rodinu.',
          um: 'Žák podle zadání vytvoří stínování válce pomocí šrafování.'
        }
      },
      {
        id: 'analyzovat', name: 'Analyzovat', q: 'Vím, z čeho se to skládá a proč to nefunguje?',
        def: 'Žák rozloží problém na části, hledá vztahy a příčiny.',
        verbs: ['rozliší', 'rozebere', 'určí příčiny', 'porovná', 'odhalí chybu', 'zařadí', 'diagnostikuje', 'vyhledá souvislosti'],
        ex: {
          ov: 'Žák porovná dva svarové spoje a určí příčiny zjištěných vad (póry, zápaly).',
          inf: 'Žák v logu serveru odhalí podezřelé přihlášení a určí, co mu předcházelo.',
          eko: 'Žák rozebere výkaz zisku a ztráty a určí položky, které nejvíc ovlivnily výsledek hospodaření.',
          vs: 'Žák v modelové žádosti rozliší náležitosti, které chybí, a ty, které jsou v pořádku.',
          cr: 'Žák rozebere recenze hotelu a určí nejčastější příčiny nespokojenosti hostů.',
          um: 'Žák rozebere dílo zvoleného autora z hlediska kompozice a barevnosti.'
        },
        ex2: {
          ov: 'Žák u poruchového stroje určí, která z možných příčin (mazání, upnutí, nástroj) způsobuje vibrace, a svůj závěr podpoří měřením.',
          inf: 'Žák v dané síti určí, kde vzniká výpadek spojení, a popíše postup, jakým k tomu došel.',
          eko: 'Žák rozliší v rozvaze aktiva a pasiva a určí položky, které nejvíc ovlivňují likviditu.',
          vs: 'Žák v modelovém spisu určí, které dokumenty jsou podkladem pro rozhodnutí a které jsou nadbytečné.',
          cr: 'Žák porovná dvě destinace podle nákladů, dostupnosti a sezónnosti a určí, v čem se liší.',
          um: 'Žák rozliší v ukázkách plakátů ty, které pracují s hierarchií písma, od těch, které ne.'
        }
      },
      {
        id: 'hodnotit', name: 'Hodnotit', q: 'Dokážu posoudit kvalitu a své stanovisko zdůvodnit?',
        def: 'Žák posoudí řešení podle kritérií a rozhodnutí obhájí argumenty.',
        verbs: ['posoudí', 'zdůvodní', 'obhájí', 'zhodnotí', 'doporučí', 'vybere nejvhodnější', 'zkontroluje podle kritérií'],
        ex: {
          ov: 'Žák posoudí hotový výrobek podle kontrolního listu a zdůvodní, zda vyhovuje toleranci.',
          inf: 'Žák posoudí dvě navržená hesla z hlediska bezpečnosti a své doporučení zdůvodní.',
          eko: 'Žák posoudí dvě investiční varianty a zdůvodní, kterou by firmě doporučil.',
          vs: 'Žák posoudí, zda je rozhodnutí v modelovém případu v souladu s předpisy, a zdůvodní to.',
          cr: 'Žák posoudí dvě nabídky pobytu a zdůvodní, která lépe vyhovuje rodině s dětmi.',
          um: 'Žák posoudí vlastní návrh podle stanovených kritérií a odůvodní navržené úpravy.'
        },
        ex2: {
          ov: 'Žák posoudí bezpečnost pracoviště podle kontrolního seznamu a navrhne pořadí nápravných opatření.',
          inf: 'Žák posoudí, zda je zvolené zálohovací řešení pro malou firmu dostatečné, a své rozhodnutí odůvodní.',
          eko: 'Žák posoudí reklamní kampaň podle stanovených kritérií a své hodnocení zdůvodní.',
          vs: 'Žák posoudí, zda má být řízení zahájeno z moci úřední, nebo na žádost, a zdůvodní to.',
          cr: 'Žák posoudí kvalitu služeb v ubytovacím zařízení podle zadaných kritérií.',
          um: 'Žák zhodnotí hotový návrh loga z hlediska čitelnosti a použitelnosti a navrhne úpravy.'
        }
      },
      {
        id: 'tvorit', name: 'Tvořit', q: 'Dokážu vytvořit něco nového z toho, co znám?',
        def: 'Žák z dílčích poznatků sestaví nový celek: návrh, postup, produkt.',
        verbs: ['navrhne', 'vytvoří', 'zkonstruuje', 'naplánuje', 'sestaví vlastní', 'vymyslí', 'vyvine'],
        ex: {
          ov: 'Žák navrhne technologický postup výroby jednoduchého držáku včetně pořadí operací a nástrojů.',
          inf: 'Žák navrhne strukturu databáze pro školní knihovnu včetně vazeb mezi tabulkami.',
          eko: 'Žák sestaví jednoduchý podnikatelský plán pro malou službu.',
          vs: 'Žák vypracuje návrh odpovědi na žádost občana včetně poučení o opravných prostředcích.',
          cr: 'Žák navrhne dvoudenní program školní exkurze do historického města.',
          um: 'Žák vytvoří původní návrh plakátu ke školní události včetně typografie.'
        },
        ex2: {
          ov: 'Žák navrhne vlastní přípravek pro upnutí součásti a nakreslí jeho výkres.',
          inf: 'Žák navrhne a naprogramuje jednoduchou aplikaci, která řeší zadaný problém.',
          eko: 'Žák sestaví rozpočet školní akce včetně zdůvodnění jednotlivých položek.',
          vs: 'Žák vypracuje návrh vnitřního předpisu obce podle zadání.',
          cr: 'Žák vytvoří propagační materiál pro nový turistický produkt regionu.',
          um: 'Žák navrhne vlastní sérii tří ilustrací propojených společným stylem.'
        }
      }
    ]
  };

  var psy = {
    id: 'psy', name: 'Psychomotorické', sub: 'praktické dovednosti', author: 'Dave (1970)',
    levels: [
      {
        id: 'imitace', name: 'Imitace', q: 'Dokážu činnost napodobit podle ukázky?',
        def: 'Žák opakuje činnost, kterou právě viděl. Pracuje pomalu a nejistě, pod dohledem.',
        verbs: ['napodobí', 'zopakuje po instruktorovi', 'zopakuje podle ukázky'],
        ex: {
          ov: 'Žák po ukázce instruktora zopakuje upnutí obrobku do sklíčidla soustruhu.',
          inf: 'Žák po ukázce zopakuje odizolování kabelu UTP a zasunutí vodičů do konektoru RJ-45.',
          cr: 'Žák po ukázce zopakuje správné nesení tří talířů na jedné ruce.',
          um: 'Žák po ukázce zopakuje vedení štětce při lavírování.',
          _: 'Žák po ukázce učitele zopakuje pracovní postup ve stejném pořadí kroků.'
        }
      },
      {
        id: 'manipulace', name: 'Manipulace', q: 'Dokážu činnost provést podle návodu?',
        def: 'Žák pracuje podle písemných či ústních pokynů, už nepotřebuje přímý vzor.',
        verbs: ['provede podle návodu', 'sestaví podle pokynů', 'nastaví podle tabulky'],
        ex: {
          ov: 'Žák podle technologického postupu upne obrobek, nastaví otáčky a soustruží válcovou plochu na předepsaný průměr.',
          inf: 'Žák podle schématu T568B seřadí vodiče a zakrimpuje konektor RJ-45.',
          cr: 'Žák podle standardu prostře stůl pro slavnostní tabuli.',
          um: 'Žák podle návodu namíchá barvu a vytvoří přechod.',
          _: 'Žák podle písemného návodu provede pracovní úkon.'
        }
      },
      {
        id: 'zpresneni', name: 'Zpřesnění', q: 'Dokážu činnost provést přesně a s minimem chyb?',
        def: 'Žák pracuje s vyšší přesností a menším počtem chyb. Dodržuje tolerance.',
        verbs: ['provede přesně', 'dodrží toleranci', 'upraví', 'vylepší'],
        ex: {
          ov: 'Žák soustruží hřídel s dodržením tolerance ±0,1 mm.',
          inf: 'Žák zhotoví kabel, který projde testerem bez chyby v zapojení.',
          cr: 'Žák prostře stůl přesně podle standardu (vzdálenosti, pořadí příborů) bez opravy.',
          um: 'Žák vytvoří plynulý přechod bez viditelných skvrn.',
          _: 'Žák provede úkon s dodržením stanovených tolerancí.'
        }
      },
      {
        id: 'koordinace', name: 'Koordinace', q: 'Dokážu sladit více činností v předepsaném sledu a čase?',
        def: 'Žák kombinuje několik činností za sebou v požadovaném sledu a tempu.',
        verbs: ['zkombinuje', 'provede v předepsaném sledu', 'sladí', 'zvládne v časovém limitu'],
        ex: {
          ov: 'Žák v limitu 90 minut vyrobí hřídel z polotovaru: upnutí, hrubování, dokončení, kontrola v předepsaném sledu.',
          inf: 'Žák v limitu 15 minut zhotoví přímý i křížený kabel a oba otestuje.',
          cr: 'Žák v limitu 10 minut prostře stůl a připraví uvítací nápoj.',
          um: 'Žák zkombinuje kresbu perem a lavírování v jedné kompozici v časovém limitu.',
          _: 'Žák provede sled navazujících činností v časovém limitu.'
        }
      },
      {
        id: 'automatizace', name: 'Automatizace', q: 'Dokážu činnost provádět plynule a přizpůsobit ji podmínkám?',
        def: 'Žák pracuje plynule a spolehlivě, bez přemýšlení nad každým krokem, a zvládne i změněné podmínky.',
        verbs: ['provede plynule', 'provede spolehlivě', 'přizpůsobí postup', 'řeší běžné odchylky'],
        ex: {
          ov: 'Žák plynule vyrobí hřídel a při změně materiálu sám upraví řezné podmínky.',
          inf: 'Žák plynule zhotovuje kabely různých typů a sám odhalí a opraví chybu v zapojení.',
          cr: 'Žák plynule obslouží celou tabuli a reaguje na změny (host se opozdí, změní se počet osob).',
          um: 'Žák přizpůsobí techniku různým podkladům a formátům a pracuje plynule.',
          _: 'Žák provádí činnost plynule a přizpůsobí ji změněným podmínkám.'
        }
      }
    ]
  };

  var afe = {
    id: 'afe', name: 'Afektivní', sub: 'postoje, hodnoty', author: 'Krathwohl (1964)',
    levels: [
      {
        id: 'prijimani', name: 'Přijímání', q: 'Vnímám a jsem otevřený novým podnětům?',
        def: 'Žák je ochoten věnovat pozornost, všímá si podnětu.',
        verbs: ['vyslechne', 'naslouchá', 'všímá si'],
        ex: { ov: 'Žák pozorně vyslechne instruktáž o bezpečnosti práce v dílně.', _: 'Žák pozorně vyslechne úvodní instruktáž o pravidlech práce s osobními údaji.' }
      },
      {
        id: 'reagovani', name: 'Reagování', q: 'Reaguji, zapojuji se?',
        def: 'Žák se z vlastní vůle zapojí, projeví zájem.',
        verbs: ['zapojí se', 'reaguje', 'dobrovolně odpoví'],
        ex: { ov: 'Žák se dobrovolně zapojí do diskuse o příčinách pracovních úrazů.', _: 'Žák se aktivně zapojí do diskuse o etice práce s daty.' }
      },
      {
        id: 'ocenovani', name: 'Oceňování hodnot', q: 'Přisuzuji tomu hodnotu?',
        def: 'Žák přijímá hodnotu jako svou, dokáže zdůvodnit její význam.',
        verbs: ['zdůvodní význam', 'projeví zájem o', 'ocení'],
        ex: { ov: 'Žák zdůvodní, proč je dodržování BOZP důležité pro něj i pro kolegy.', _: 'Žák zdůvodní, proč je ochrana osobních údajů důležitá pro firmu i pro klienta.' }
      },
      {
        id: 'organizace', name: 'Organizace hodnot', q: 'Umím hodnoty porovnat a stanovit priority?',
        def: 'Žák uspořádá vlastní hodnoty do systému, řeší střety hodnot.',
        verbs: ['porovná hodnoty', 'stanoví priority', 'formuluje zásady'],
        ex: { ov: 'Žák porovná tlak na rychlost výroby s požadavkem bezpečnosti a formuluje vlastní pravidlo priorit.', _: 'Žák porovná tlak na rychlost práce s nároky na kvalitu a formuluje vlastní pravidlo priorit.' }
      },
      {
        id: 'internalizace', name: 'Internalizace', q: 'Jednám v souladu s hodnotou trvale?',
        def: 'Hodnota je součástí charakteru, projevuje se konzistentně i bez dohledu.',
        verbs: ['dodržuje důsledně', 'jedná zodpovědně', 'chová se v souladu s'],
        ex: { ov: 'Žák dodržuje bezpečnostní zásady důsledně i bez připomínání a dohledu.', _: 'Žák důsledně chrání osobní údaje ve všech svých pracích, i když ho nikdo nekontroluje.' }
      }
    ]
  };

  var domains = { kog: kog, psy: psy, afe: afe };
  kog.levels.forEach(function (l, i) { l.color = COL[i]; });
  psy.levels.forEach(function (l, i) { l.color = COL[i]; });
  afe.levels.forEach(function (l, i) { l.color = COL[i]; });

  /* slovesa, která nelze pozorovat ani ověřit */
  var vague = ['vědět', 'ví', 'znát', 'zná', 'chápat', 'chápe', 'rozumět', 'rozumí', 'pochopit', 'pochopí', 'porozumí', 'umět', 'umí', 'uvědomit', 'uvědomí',
    'seznámit', 'seznámí', 'naučit', 'naučí', 'zvládnout', 'zvládne', 'mít přehled', 'má přehled', 'orientovat', 'orientuje', 'ovládat', 'ovládá', 'osvojit', 'osvojí',
    'získá', 'získat', 'prohloubí', 'nabude', 'projít', 'probrat', 'absolvuje'];

  function levelOf(verbText) {
    var t = DPS.norm(verbText || '');
    if (!t) return null;
    var found = null;
    Object.keys(domains).forEach(function (dk) {
      domains[dk].levels.forEach(function (lv, li) {
        lv.verbs.forEach(function (v) {
          var nv = DPS.norm(v);
          if (!found && (t === nv || t.indexOf(nv) === 0 || nv.indexOf(t) === 0 && t.length >= 4)) found = { domain: dk, index: li, level: lv, domainName: domains[dk].name };
        });
      });
    });
    return found;
  }
  function isVague(verbText) {
    var t = DPS.norm(verbText || '');
    if (!t) return false;
    return vague.some(function (v) { var nv = DPS.norm(v); return t === nv || t.indexOf(nv + ' ') === 0 || t.indexOf(nv) === 0; });
  }

  DPS.data.domains = domains;
  DPS.data.bloom = kog;
  DPS.data.vagueVerbs = vague;
  DPS.data.levelOf = levelOf;
  DPS.data.isVague = isVague;
  DPS.data.levelColors = COL;
})();
