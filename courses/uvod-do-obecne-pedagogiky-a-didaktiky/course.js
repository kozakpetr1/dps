/* Kurz: Úvod do obecné pedagogiky a didaktiky
   status: 'ready' = kapitola je hotová, 'planned' = zatím jen osnova */
DPS.registerCourse({
  slug: 'uvod-do-obecne-pedagogiky-a-didaktiky',
  title: 'Úvod do obecné pedagogiky a didaktiky',
  short: 'OPD',
  icon: 'book',
  accent: '#b39bff',
  accentLight: '#6a45dc',
  onAccent: '#140c33',
  hours: 24,
  exam: 'Ústní zkouška (ZK)',
  examShort: 'Ústní zkouška',
  examDetail: 'Losují se 2 otázky z okruhů (1 z pedagogiky, 1 z didaktiky), na přípravu máte 10 minut, na odpověď 15 minut a můžete používat vlastní poznámky. Ověřuje se, zda umíte propojit teorii s praxí ve vyučování. Proto se tu učíme na příkladech, ne nazpaměť.',
  audience: 'Učitelé odborného výcviku a odborných předmětů',
  description: 'Co je výchova a vzdělávání, jak se dorozumět se žáky a rodiči, jak vybrat metodu a formu výuky, jak pracovat s rozdílnými žáky a jak spravedlivě hodnotit. Na příkladech ze střední odborné školy.',
  lead: 'Základy pedagogiky a didaktiky pro každého, kdo učí odborný výcvik nebo odborný předmět. Kratší výklad, víc situací z praxe a cvičení, ve kterých si ověříte, že pojmům opravdu rozumíte.',
  outcomes: [
    'Rozlišíte výchovu, vzdělávání a učení a vysvětlíte, co pedagogika zkoumá.',
    'Poznáte tradiční a moderní přístup ke vzdělávání a umíte je použít při rozboru hodiny.',
    'Použijete vhodné komunikační techniky se žáky, rodiči i kolegy a rozpoznáte komunikační bariéry.',
    'Zformulujete výukové cíle a vyberete vhodné učivo.',
    'Zvolíte výukovou metodu a organizační formu podle cíle, žáků a podmínek školy.',
    'Vysvětlíte principy vybraných alternativních koncepcí (Montessori, Waldorf, Dalton, Jena-plan, Začít spolu) a porovnáte je s tradiční školou.',
    'Orientujete se v podpůrných opatřeních a umíte spolupracovat s asistentem pedagoga.',
    'Zvolíte vhodnou metodu pedagogické diagnostiky a spravedlivě žáky hodnotíte.'
  ],
  sources: [
    'JŮVA, V. <em>Základy pedagogiky pro doplňující pedagogické studium</em>. Brno: Paido, 2001.',
    'SKALKOVÁ, J. <em>Obecná didaktika</em>. Praha: ISV, 1999.',
    'KALHOUS, Z. a kol. <em>Školní didaktika</em>. Praha: Portál, 2002.',
    'PRŮCHA, J., WALTEROVÁ, E., MAREŠ, J. <em>Pedagogický slovník</em>. Praha: Portál.',
    'PROKEŠOVÁ, M. <em>Obecná pedagogika</em>. Ostrava: Ostravská univerzita, 2018.',
    'KOHOUT, K. <em>Obecná pedagogika</em>. Praha: UJAK, 2018.',
    'VALIŠOVÁ, A., KOVAŘÍKOVÁ, M. <em>Obecná didaktika a její širší pedagogické souvislosti v úkolech a cvičeních</em>. Praha: Grada, 2021.',
    'OBST, O. <em>Obecná didaktika</em>. Olomouc: UP, 2017.',
    'MAŇÁK, J., ŠVEC, V. <em>Výukové metody</em>. Brno: Paido, 2003.'
  ],
  chapters: [
    {
      slug: '01-pedagogika-jako-veda', title: 'Pedagogika jako věda o výchově', hours: 2, minutes: 80, status: 'ready',
      lead: 'Než se pustíte do definic, rozhodnete u šesti scének ze školy a dílny, co je výchova, co vzdělávání a co učení – a proč to jako budoucí učitel potřebujete umět rozlišit.',
      summary: 'Vysvětluje pedagogiku jako vědu (předmět, metody výzkumu, vazby na jiné vědy, pedagogické disciplíny) a procvičuje to na scénkách, přiřazování a klasifikaci z praxe.'
    },
    {
      slug: '02-tradicni-a-moderni-pojeti', title: 'Tradiční a moderní pojetí pedagogiky', hours: 2, minutes: 85, status: 'ready',
      lead: 'Na dvou modelových hodinách stejného tématu uvidíte, čím se tradiční a moderní pojetí liší – a natrénujete si, kdy je který přístup ve vaší dílně nebo učebně správná volba.',
      summary: 'Srovnává tradiční a moderní pojetí výuky (role učitele/žáka, cíle, metody, hodnocení, historické kořeny) a učí přepsat zadání instruktáže tak, aby žáci byli aktivní při zachování bezpečnosti.'
    },
    {
      slug: '03-pedagogicka-komunikace', title: 'Pedagogická komunikace', hours: 3, minutes: 100, status: 'ready',
      lead: 'Jedna věta učitele zní žákovi jinak, než jak ji myslel – tahle kapitola vysvětluje proč, a dá vám nástroje, jak ve třídě, s rodiči i s kolegy komunikovat tak, aby vás pochopili.',
      summary: 'Vysvětlí druhy pedagogické komunikace, komunikační modely a pravidla náročného rozhovoru a procvičí je na anotaci přepisu hodiny, třídění situací, přepisu vět a modelových rozhovorech s rodičem a kolegou.'
    },
    {
      slug: '04-vychova-a-vzdelavani', title: 'Výchova a vzdělávání jako pedagogické kategorie', hours: 3, minutes: 90, status: 'ready',
      lead: 'Chlapec, který si sundá brýle u soustruhu, vám ukáže, proč se cíl, prostředek a podmínka výchovy pletou i zkušeným učitelům. Kapitola vám dá pojmy i schéma, které u ústní zkoušky použijete se skutečnými příklady z dílny.',
      summary: 'Student rozliší výchovu, vzdělávání, vzdělání a sebevýchovu, popíše výchovu jako systém (cíl, podmínky, prostředky, výsledky, činitelé) a rozezná styl vedení skupiny od stylu rodičovské výchovy na vignetách z dílny a třídy.'
    },
    {
      slug: '05-obecna-didaktika-cile-ucivo', title: 'Obecná didaktika, výukové cíle a učivo', hours: 3, minutes: 90, status: 'ready',
      lead: 'Kdo vlastně rozhoduje, co dnes budete učit? Projděte si cestu od RVP přes ŠVP k jedné hodině a naučte se plánovat výuku podle didaktických zásad a ověřitelných cílů.',
      summary: 'Vysvětluje předmět obecné didaktiky, didaktické zásady, výukové cíle a systém kurikulárních dokumentů (RVP, ŠVP) a procvičuje je na příkladech z dílny a odborného předmětu.'
    },
    {
      slug: '06-metody-vyuky', title: 'Metody výuky', hours: 2, minutes: 75, status: 'ready',
      lead: 'Zjistíte, čím se metody skutečně liší a jak vybrat tu pravou podle cíle, žáků a podmínek – ne podle zvyku.',
      summary: 'Naučíte se rozlišit klasické, aktivizující a komplexní metody i metodu od organizační formy, a vyzkoušíte si volbu metody v modelových situacích z dílny i odborného předmětu.'
    },
    {
      slug: '07-organizacni-formy-vyuky', title: 'Organizační formy výuky', hours: 2, minutes: 75, status: 'ready',
      lead: 'Stejná metoda dopadne jinak podle toho, jak zorganizujete třídu, skupinu i celý odborný výcvik – tady se naučíte volit formu vědomě.',
      summary: 'Rozlišíte frontální, skupinovou, párovou a individuální výuku i formy odborného vzdělávání (dílna, smluvní pracoviště, exkurze) a naplánujete organizaci vlastní hodiny.'
    },
    {
      slug: '08-individualizace-a-alternativni-skoly', title: 'Individualizace a alternativní školské koncepce', hours: 2, minutes: 75, status: 'ready',
      lead: 'Prohlédněte si, jak výuku přizpůsobit žákům, kteří se učí různým tempem, a co si z Montessori, waldorfské pedagogiky, daltonského plánu, jenského plánu, Winnetky a programu Začít spolu můžete bezpečně odnést do dílny nebo odborné učebny.',
      summary: 'Rozliší individualizaci od diferenciace, pozná principy šesti alternativních školských koncepcí a posoudí, co z nich lze bezpečně přenést do odborného vzdělávání.'
    },
    {
      slug: '09-spolecne-vzdelavani-a-podporna-opatreni', title: 'Společné vzdělávání a podpůrná opatření', hours: 2, minutes: 60, status: 'ready',
      lead: 'Naučíte se, kdy stačí drobná úprava a kdy už je potřeba doporučení poradny, a jak si rozdělit role s asistentem pedagoga – na modelových situacích z dílny a odborného předmětu.',
      summary: 'Stupně podpůrných opatření, PLPP/IVP a spolupráci s asistentem pedagoga procvičíte na scénářích, řazení kroků a vlastní dohodě o spolupráci.'
    },
    {
      slug: '10-diagnostika-a-hodnoceni', title: 'Pedagogická diagnostika a hodnocení ve výuce', hours: 3, minutes: 90, status: 'ready',
      lead: 'Naučíte se systematicky zjišťovat, kde žák je a proč, a odlišit to od nálepkování; kapitola vás provede obecným rámcem hodnocení a chybami, kterých se hodnotitel dopouští.',
      summary: 'Pedagogická a didaktická diagnostika, funkce a formy hodnocení a chyby hodnotitele procvičené na modelové situaci, testové úloze a hodnocení praktického výkonu.'
    },
    {
      slug: '11-priprava-na-zkousku', title: 'Příprava na ústní zkoušku', hours: null, note: 'trénink', minutes: 60, status: 'ready',
      lead: 'Tahle kapitola nemá vlastní novou látku – je to trénink na ústní zkoušku: shrneme osnovu dobré odpovědi, ukážeme, jak využít 10 minut přípravy, a hlavně si zkoušku vyzkoušíte nanečisto v trenažéru.',
      summary: 'Shrne osnovu dobré odpovědi (pojem → příklad z praxe → souvislosti) a nechá si zkoušku nanečisto vyzkoušet v trenažéru s otázkami z celého kurzu (10 min příprava, 15 min odpověď).'
    }
  ]
});
