/* ==========================================================================
   DPS shell – dashboard, přehled kurzu, stránka kapitoly
   (horní lišta, levá navigace, TOC, dolní stránkování, dialogy)
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS;
  var $ = DPS.$, $$ = DPS.$$, el = DPS.el, icon = DPS.icon;

  /* ---------- pomocné ---------- */
  function hoursLabel(h) {
    if (h == null) return '';
    return h + ' ' + DPS.plural(h, 'vyučovací hodina', 'vyučovací hodiny', 'vyučovacích hodin');
  }
  function html(str) { var t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstChild; }

  function ringEl(st) {
    var r = el('span', { class: 'ring' + (st.complete ? ' is-done' : ''), style: { '--p': st.pct }, title: st.complete ? 'Dokončeno' : (st.pct ? st.pct + ' %' : 'Nezahájeno') });
    r.innerHTML = icon('check', 12);
    return r;
  }

  /* ---------- popover ---------- */
  var openPopEl = null;
  function closePop() { if (openPopEl) { openPopEl.remove(); openPopEl = null; } }
  document.addEventListener('click', function (e) {
    if (openPopEl && !openPopEl.contains(e.target) && !e.target.closest('[data-pop-anchor]')) closePop();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePop();
      if (document.body.classList.contains('nav-open')) document.body.classList.remove('nav-open');
    }
  });
  function showPop(anchor, content) {
    closePop();
    var pop = el('div', { class: 'pop', role: 'menu' }, content);
    document.body.appendChild(pop);
    var r = anchor.getBoundingClientRect();
    var w = pop.offsetWidth;
    var left = Math.min(window.innerWidth - w - 12, Math.max(12, r.right - w));
    pop.style.left = left + window.scrollX + 'px';
    pop.style.top = r.bottom + window.scrollY + 8 + 'px';
    pop.style.position = 'absolute';
    openPopEl = pop;
    return pop;
  }

  /* ---------- dialogy ---------- */
  function dialog(build) {
    var dlg = el('dialog', { class: 'dlg' });
    var inner = el('div', { class: 'dlg-in' });
    dlg.appendChild(inner);
    build(inner, function close(v) { dlg.close(v); });
    document.body.appendChild(dlg);
    dlg.addEventListener('close', function () { setTimeout(function () { dlg.remove(); }, 50); });
    dlg.showModal();
    return dlg;
  }

  DPS.confirm = function (title, text, okLabel) {
    return new Promise(function (resolve) {
      var result = false;
      var dlg = dialog(function (box, close) {
        box.appendChild(el('h2', { text: title }));
        box.appendChild(el('p', { class: 'sub', text: text }));
        box.appendChild(el('div', { class: 'btn-row' },
          el('button', { class: 'btn btn-primary', onclick: function () { result = true; close('ok'); } }, okLabel || 'Potvrdit'),
          el('button', { class: 'btn', onclick: function () { close('cancel'); } }, 'Zrušit')));
      });
      dlg.addEventListener('close', function () { resolve(result); });
    });
  };

  function profileDialog(onDone) {
    var chosen = DPS.profile.id();
    var dlg = dialog(function (box, close) {
      box.appendChild(el('h2', { text: 'Jaké je vaše zaměření?' }));
      box.appendChild(el('p', { class: 'sub', text: 'Příklady a cvičení přizpůsobíme tomu, co učíte. Zaměření můžete kdykoli změnit v horní liště.' }));
      var list = el('div', { class: 'dlg-list', role: 'radiogroup' });
      DPS.PROFILES.forEach(function (p) {
        var b = el('button', { class: 'dlg-opt', role: 'radio', 'aria-checked': String(p.id === chosen), 'data-id': p.id, html: icon(p.icon, 22) + '<span><span class="n">' + DPS.esc(p.name) + '</span><br><span class="d">' + DPS.esc(p.desc) + '</span></span>' });
        b.addEventListener('click', function () {
          chosen = p.id;
          $$('.dlg-opt', list).forEach(function (x) { x.setAttribute('aria-checked', String(x.dataset.id === chosen)); });
        });
        list.appendChild(b);
      });
      box.appendChild(list);
      box.appendChild(el('div', { class: 'btn-row' },
        el('button', { class: 'btn btn-primary', onclick: function () { close('ok'); } }, 'Potvrdit'),
        el('span', { class: 'src' }, 'Volba se ukládá jen ve vašem prohlížeči.')));
    });
    dlg.addEventListener('close', function () {
      var changed = DPS.profile.id() !== chosen || !DPS.profile.isSet();
      DPS.profile.set(chosen);
      if (onDone) onDone(changed);
    });
  }

  function ensureProfile() {
    if (DPS.profile.isSet()) return;
    setTimeout(function () { profileDialog(function () { location.reload(); }); }, 350);
  }

  /* ---------- nastavení (export / import / smazání) ---------- */
  function settingsMenu(anchor) {
    var content = el('div', null,
      el('div', { class: 'pop-title' }, 'Váš postup'),
      popItem('download', 'Zálohovat postup', 'Stáhne soubor JSON s výsledky a poznámkami', function () {
        var d = new Date();
        DPS.download('dps-postup-' + d.toISOString().slice(0, 10) + '.json', DPS.store.exportJSON(), 'application/json');
        closePop();
      }),
      popItem('upload', 'Obnovit ze zálohy', 'Načte dříve stažený soubor (např. na jiném zařízení)', function () {
        closePop();
        var inp = el('input', { type: 'file', accept: 'application/json,.json', style: { display: 'none' } });
        inp.addEventListener('change', function () {
          var f = inp.files[0]; if (!f) return;
          var rd = new FileReader();
          rd.onload = function () {
            try { DPS.store.importJSON(String(rd.result)); DPS.toast('Postup byl obnoven'); setTimeout(function () { location.reload(); }, 600); }
            catch (e) { DPS.toast(e.message || 'Soubor se nepodařilo načíst'); }
          };
          rd.readAsText(f);
        });
        document.body.appendChild(inp); inp.click(); setTimeout(function () { inp.remove(); }, 4000);
      }),
      el('hr'),
      popItem('trash', 'Smazat veškerý postup', 'Odstraní výsledky cvičení i uložené poznámky', function () {
        closePop();
        DPS.confirm('Smazat veškerý postup?', 'Výsledky cvičení, poznámky i dokončené kapitoly se odstraní z tohoto prohlížeče. Tuto akci nelze vrátit zpět.', 'Smazat').then(function (ok) {
          if (ok) { var prof = DPS.profile.id(), th = DPS.theme.get(); DPS.store.reset(); DPS.store.set('profile', prof); DPS.store.set('theme', th); location.reload(); }
        });
      }));
    if (!DPS.store.available()) content.appendChild(el('div', { class: 'pop-title', style: { color: 'var(--warn)' } }, 'Prohlížeč neumožňuje ukládání – postup se po zavření ztratí.'));
    showPop(anchor, content);
  }
  function popItem(ico, name, desc, fn, checked) {
    var b = el('button', { class: 'pop-item', role: 'menuitem', 'aria-checked': checked ? 'true' : null, html: '<span class="pi-ico">' + icon(ico, 18) + '</span><span><span class="pi-name">' + DPS.esc(name) + '</span>' + (desc ? '<span class="pi-desc" style="display:block">' + DPS.esc(desc) + '</span>' : '') + '</span>' });
    b.addEventListener('click', fn);
    return b;
  }

  /* ---------- horní lišta ---------- */
  function buildTopbar(opts) {
    opts = opts || {};
    var bar = el('header', { class: 'topbar' });

    if (opts.menu) {
      bar.appendChild(el('button', { class: 'icon-btn only-md', 'aria-label': 'Otevřít navigaci', html: icon('menu', 22), onclick: function () { document.body.classList.toggle('nav-open'); } }));
    }
    bar.appendChild(el('a', { class: 'brand', href: DPS.root + 'index.html', 'aria-label': DPS.site.title },
      el('span', { class: 'brand-mark', html: icon('cap', 19) }),
      el('span', { text: DPS.site.short }),
      el('span', { class: 'brand-sub hide-md', text: DPS.site.title.replace(/^Doplňkové pedagogické studium$/, 'Doplňkové pedagogické studium') })));

    var crumbs = el('nav', { class: 'crumbs hide-sm', 'aria-label': 'Drobečková navigace' });
    (opts.crumbs || []).forEach(function (c, i) {
      if (i) crumbs.appendChild(el('span', { class: 'sep', text: '/' }));
      crumbs.appendChild(c.href ? el('a', { href: c.href, text: c.text }) : el('span', { class: 'cur', text: c.text }));
    });
    bar.appendChild(crumbs);
    bar.appendChild(el('div', { class: 'topbar-spacer' }));

    var actions = el('div', { class: 'topbar-actions' });
    var prof = DPS.profile.get();
    var profBtn = el('button', { class: 'chip-btn', 'data-pop-anchor': '', title: 'Změnit zaměření', 'aria-haspopup': 'dialog' },
      el('span', { class: 'chip-icon', html: icon(prof.icon, 16) }),
      el('span', { class: 'hide-sm', text: prof.name }));
    profBtn.addEventListener('click', function () { profileDialog(function (changed) { if (changed) location.reload(); }); });
    actions.appendChild(profBtn);

    var themeBtn = el('button', { class: 'icon-btn', 'aria-label': 'Přepnout světlý / tmavý režim', title: 'Světlý / tmavý režim' });
    function syncTheme() { themeBtn.innerHTML = icon(DPS.theme.get() === 'dark' ? 'sun' : 'moon', 19); }
    syncTheme();
    themeBtn.addEventListener('click', function () { DPS.theme.toggle(); syncTheme(); });
    actions.appendChild(themeBtn);

    var setBtn = el('button', { class: 'icon-btn', 'data-pop-anchor': '', 'aria-label': 'Nastavení a záloha postupu', title: 'Postup a záloha', html: icon('more', 20) });
    setBtn.addEventListener('click', function (e) { e.stopPropagation(); settingsMenu(setBtn); });
    actions.appendChild(setBtn);

    bar.appendChild(actions);
    return bar;
  }

  /* ---------- levá navigace ---------- */
  function buildSidebar(course, current) {
    var ps = DPS.progress.course(course);
    var side = el('aside', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Navigace kurzu' });

    var head = el('div', { class: 'sb-head' },
      el('a', { class: 'sb-back', href: DPS.root + 'index.html', html: icon('arrow-left', 14) + ' Všechny kurzy' }),
      el('div', { class: 'sb-title' }, el('span', { class: 'dot' }), el('span', { text: course.title })),
      el('div', { class: 'sb-progress' },
        el('div', { class: 'row' }, el('span', { text: 'Dokončeno kapitol' }), el('span', { class: 'sb-count', text: ps.complete + ' / ' + ps.total })),
        el('div', { class: 'bar' }, el('i', { style: { '--v': ps.pct } }))));
    side.appendChild(head);

    var nav = el('nav', { class: 'sb-nav' });
    nav.appendChild(el('a', { class: 'nav-item', href: DPS.courseUrl(course.slug), 'aria-current': current === -1 ? 'page' : null },
      el('span', { class: 'num', html: icon('layout', 15) }),
      el('span', { class: 'nm' }, 'Přehled kurzu', el('small', { text: 'Výstupy, osnova, ukončení' })),
      el('span')));
    nav.appendChild(el('div', { class: 'sb-label', text: 'Kapitoly' }));
    course.chapters.forEach(function (ch, i) {
      var st = DPS.progress.chapter(course.slug, ch);
      var meta = (ch.hours ? ch.hours + ' h' : (ch.note || 'doplněk')) + (ch.status === 'planned' ? ' · brzy' : '');
      nav.appendChild(el('a', {
        class: 'nav-item' + (ch.status === 'planned' ? ' is-planned' : ''),
        href: DPS.chapterUrl(course.slug, ch.slug),
        'aria-current': i === current ? 'page' : null,
        'data-ch': ch.slug
      },
        el('span', { class: 'num', text: String(i + 1) }),
        el('span', { class: 'nm' }, ch.title, el('small', { text: meta })),
        ringEl(st)));
    });
    side.appendChild(nav);

    side.appendChild(el('div', { class: 'sb-foot' }, DPS.site.author + (DPS.site.institution ? ' · ' + DPS.site.institution : '')));

    // živá aktualizace postupu
    document.addEventListener('dps:progress', function () {
      var p2 = DPS.progress.course(course);
      var cnt = $('.sb-count', side); if (cnt) cnt.textContent = p2.complete + ' / ' + p2.total;
      var b = $('.sb-progress .bar > i', side); if (b) b.style.setProperty('--v', p2.pct);
      course.chapters.forEach(function (ch) {
        var a = $('.nav-item[data-ch="' + ch.slug + '"]', side); if (!a) return;
        var old = $('.ring', a); if (old) old.replaceWith(ringEl(DPS.progress.chapter(course.slug, ch)));
      });
    });
    return side;
  }

  /* ---------- dolní stránkování ---------- */
  function pgBtn(kind, href, opts) {
    var a = el('a', {
      class: 'pg-btn ' + kind + (opts.disabled ? ' is-disabled' : ''),
      href: opts.disabled ? null : href,
      'aria-label': opts.aria, title: opts.aria, 'aria-disabled': opts.disabled ? 'true' : null,
      rel: kind === 'next' ? 'next' : (kind === 'prev' ? 'prev' : null)
    });
    var parts = [];
    if (kind === 'prev') parts = [icon('chevron-left', 18), lbl(opts)];
    else if (kind === 'next') parts = [lbl(opts), icon('chevron-right', 18)];
    else parts = [icon(kind === 'first' ? 'first' : 'last', 18)];
    a.innerHTML = parts.map(function (p) { return typeof p === 'string' ? p : p.outerHTML; }).join('');
    if (kind === 'first' || kind === 'last') a.classList.add('icon');
    return a;
  }
  function lbl(o) {
    return el('span', { class: 'lbl' }, el('small', { text: o.small }), el('span', { text: o.text || '' }));
  }

  function buildPager(course, current) {
    var n = course.chapters.length;
    var chs = course.chapters;
    var prevHref, nextHref, prevOpts, nextOpts;

    if (current === -1) {
      prevOpts = { disabled: true, aria: 'Předchozí', small: 'Zpět', text: 'Začátek kurzu' };
      nextOpts = { disabled: !n, aria: 'Začít kurz', small: 'Začít', text: n ? chs[0].title : '' };
      nextHref = n ? DPS.chapterUrl(course.slug, chs[0].slug) : null;
    } else {
      var prev = chs[current - 1], next = chs[current + 1];
      prevOpts = { disabled: false, aria: 'Předchozí kapitola', small: 'Zpět', text: prev ? prev.title : 'Přehled kurzu' };
      prevHref = prev ? DPS.chapterUrl(course.slug, prev.slug) : DPS.courseUrl(course.slug);
      nextOpts = { disabled: !next, aria: 'Další kapitola', small: 'Dále', text: next ? next.title : '' };
      nextHref = next ? DPS.chapterUrl(course.slug, next.slug) : null;
    }
    var pos = current === -1 ? 'Úvod ke kurzu' : 'Kapitola ' + (current + 1) + ' z ' + n;
    var pct = current === -1 ? 0 : Math.round((current + 1) / n * 100);

    var bar = el('nav', { class: 'pager', 'aria-label': 'Stránkování kapitol' },
      el('div', { class: 'pager-in' },
        el('div', { class: 'pg-group' },
          pgBtn('first', DPS.courseUrl(course.slug), { aria: 'Na začátek kurzu', disabled: current === -1 }),
          pgBtn('prev', prevHref, prevOpts)),
        el('div', { class: 'pg-mid' },
          el('div', { class: 'pos', text: pos }),
          el('div', { class: 'bar' }, el('i', { style: { '--v': pct } }))),
        el('div', { class: 'pg-group' },
          pgBtn('next', nextHref, nextOpts),
          pgBtn('last', n ? DPS.chapterUrl(course.slug, chs[n - 1].slug) : null, { aria: 'Na konec kurzu (poslední kapitola)', disabled: !n || current === n - 1 }))));
    return bar;
  }

  /* ---------- filtrování obsahu podle zaměření ---------- */
  function applyProfileVisibility(root) {
    var id = DPS.profile.id();
    $$('[data-only]', root).forEach(function (n) {
      var list = n.dataset.only.split(/[\s,]+/);
      n.hidden = list.indexOf(id) === -1;
    });
    $$('[data-not]', root).forEach(function (n) {
      var list = n.dataset.not.split(/[\s,]+/);
      n.hidden = list.indexOf(id) !== -1;
    });
    $$('[data-profile-name]', root).forEach(function (n) { n.textContent = DPS.profile.get().name; });
  }
  DPS.applyProfileVisibility = applyProfileVisibility;

  /* callouty psané ručně v HTML nemusí obsahovat ikonu – doplní se podle varianty */
  function decorateCallouts(root) {
    var map = { tip: 'bulb', warn: 'alert', def: 'book', practice: 'flag', rev: 'refresh' };
    $$('.callout', root).forEach(function (c) {
      if (c.querySelector(':scope > svg')) return;
      var kind = Object.keys(map).find(function (k) { return c.classList.contains('callout--' + k); }) || 'info';
      var wrap = document.createElement('div');
      while (c.firstChild) wrap.appendChild(c.firstChild);
      c.innerHTML = icon(map[kind] || 'info', 22);
      c.appendChild(wrap);
    });
  }

  /* ==========================================================================
     Dashboard
     ========================================================================== */
  function renderDashboard() {
    document.title = DPS.site.title;
    var courses = DPS.manifest.map(function (s) { return DPS.getCourse(s); }).filter(Boolean);

    var totalDone = 0, totalCh = 0;
    courses.forEach(function (c) { var p = DPS.progress.course(c); totalDone += p.complete; totalCh += p.total; });

    document.body.appendChild(buildTopbar({ crumbs: [] }));

    var dash = el('main', { class: 'dash' });
    var hero = el('section', { class: 'hero' },
      el('h1', { html: 'Pedagogika a didaktika <em>v praxi</em>' }),
      el('p', { text: DPS.site.tagline + '. Méně teorie, víc cvičení: kvízy, modelové situace a nástroje, které využijete při přípravě vlastních hodin.' }),
      el('div', { class: 'hero-row' },
        el('span', { class: 'meta-chip', html: icon('users', 15) + ' Zaměření: <strong>' + DPS.esc(DPS.profile.get().name) + '</strong>' }),
        el('span', { class: 'meta-chip', html: icon('check', 15) + ' Dokončeno <strong>' + totalDone + ' z ' + totalCh + '</strong> kapitol' }),
        el('span', { class: 'meta-chip', html: icon('lock', 15) + ' Bez přihlášení, postup se ukládá ve vašem prohlížeči' })));
    dash.appendChild(hero);

    dash.appendChild(el('div', { class: 'sec-title' }, el('h2', { text: 'Kurzy' })));
    var grid = el('div', { class: 'course-grid' });
    courses.forEach(function (c) { grid.appendChild(courseCard(c)); });
    grid.appendChild(el('div', { class: 'course-card is-ghost' },
      el('div', { class: 'cc-ico', html: icon('layers', 24) }),
      el('h3', { text: 'Další kurzy' }),
      el('p', { text: 'Sem přibudou další kurzy doplňkového pedagogického studia. Postup ve stávajících kurzech zůstane zachován.' })));
    dash.appendChild(grid);

    dash.appendChild(el('footer', { class: 'dash-foot' },
      el('span', { text: '© ' + DPS.site.year + ' ' + DPS.site.author + (DPS.site.institution ? ' · ' + DPS.site.institution : '') }),
      el('span', { text: 'Výukové materiály pro účastníky doplňkového pedagogického studia' })));

    document.body.appendChild(dash);
    ensureProfile();
  }

  function courseCard(c) {
    var p = DPS.progress.course(c);
    var ready = c.chapters.filter(function (x) { return x.status !== 'planned'; }).length;
    var target, cta;
    if (!p.started) { target = DPS.courseUrl(c.slug); cta = 'Začít kurz'; }
    else {
      var idx = p.nextIdx !== -1 ? p.nextIdx : (p.lastIdx !== -1 ? p.lastIdx : 0);
      target = DPS.chapterUrl(c.slug, c.chapters[idx].slug);
      cta = 'Pokračovat: ' + (idx + 1) + '. ' + c.chapters[idx].title;
    }
    var card = el('article', { class: 'course-card', style: { '--c': c.accent } },
      el('div', { class: 'cc-top' },
        el('div', { class: 'cc-ico', html: icon(c.icon || 'book', 24) }),
        el('span', { class: 'cc-tag', text: c.short })),
      el('div', null,
        el('h3', null, el('a', { class: 'stretch', href: DPS.courseUrl(c.slug), text: c.title })),
        el('p', { style: { marginTop: '8px' }, text: c.description })),
      el('div', { class: 'cc-stats' },
        el('span', { class: 'meta-chip', html: icon('list', 14) + ' ' + c.chapters.length + ' ' + DPS.plural(c.chapters.length, 'kapitola', 'kapitoly', 'kapitol') }),
        el('span', { class: 'meta-chip', html: icon('clock', 14) + ' ' + c.hours + ' h výuky' }),
        el('span', { class: 'meta-chip', html: icon('flag', 14) + ' ' + DPS.esc(c.examShort || c.exam) })),
      el('div', { class: 'cc-foot' },
        el('div', { class: 'cc-prog' },
          el('div', { class: 'row' }, el('span', { text: p.complete + ' z ' + p.total + ' kapitol dokončeno' }), el('span', { text: p.pct + ' %' })),
          el('div', { class: 'bar' }, el('i', { style: { '--v': p.pct } }))),
        el('div', { class: 'btn-row', style: { position: 'relative', zIndex: 2 } },
          el('a', { class: 'btn btn-primary', href: target, html: DPS.esc(cta) + ' ' + icon('arrow-right', 16) }),
          ready < c.chapters.length ? el('span', { class: 'src', text: 'Připraveno ' + ready + ' z ' + c.chapters.length + ' kapitol' }) : null)));
    return card;
  }

  /* ==========================================================================
     Stránkový rámec kurzu (sdílený přehledem i kapitolou)
     ========================================================================== */
  function frame(course, current, crumbs) {
    document.body.appendChild(buildTopbar({ menu: true, crumbs: crumbs }));
    document.body.appendChild(buildSidebar(course, current));
    var scrim = el('div', { class: 'scrim', onclick: function () { document.body.classList.remove('nav-open'); } });
    document.body.appendChild(scrim);
    var main = el('main', { class: 'main', id: 'main' });
    document.body.appendChild(main);
    document.body.appendChild(buildPager(course, current));
    // po kliknutí na odkaz v navigaci na mobilu zavřít
    $('.sidebar').addEventListener('click', function (e) { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });
    return main;
  }

  /* ==========================================================================
     Přehled kurzu
     ========================================================================== */
  function renderOverview(course) {
    document.title = course.title + ' · ' + DPS.site.short;
    var main = frame(course, -1, [
      { text: 'Kurzy', href: DPS.root + 'index.html' },
      { text: course.title }
    ]);
    var ps = DPS.progress.course(course);
    var page = el('div', { class: 'page no-toc' });
    var art = el('article', { class: 'chapter' });

    var head = el('header', { class: 'ch-head' },
      el('div', { class: 'kicker', text: 'Kurz · ' + course.short }),
      el('h1', { class: 'ch-title', text: course.title }),
      el('p', { class: 'ch-lead', text: course.lead || course.description }),
      el('div', { class: 'ch-meta' },
        el('span', { class: 'meta-chip', html: icon('users', 14) + ' ' + DPS.esc(course.audience || DPS.site.tagline) })));
    art.appendChild(head);

    art.appendChild(el('div', { class: 'ov-grid' },
      stat(String(course.chapters.length), 'kapitol'),
      stat(String(course.hours) + ' h', 'vyučovacích hodin'),
      stat(course.examShort || course.exam, 'ukončení kurzu'),
      stat(ps.pct + ' %', 'váš postup')));

    var go = ps.nextIdx !== -1 ? ps.nextIdx : 0;
    art.appendChild(el('div', { class: 'btn-row', style: { marginBottom: '2.6rem' } },
      el('a', { class: 'btn btn-primary', href: DPS.chapterUrl(course.slug, course.chapters[go].slug), html: (ps.started ? 'Pokračovat: ' + (go + 1) + '. ' + DPS.esc(course.chapters[go].title) : 'Začít první kapitolou') + ' ' + icon('arrow-right', 16) })));

    if (course.outcomes && course.outcomes.length) {
      art.appendChild(el('section', null,
        el('h2', { text: 'Co po kurzu zvládnete' }),
        el('ul', { html: course.outcomes.map(function (o) { return '<li>' + DPS.esc(o) + '</li>'; }).join('') })));
    }

    var sec = el('section', null, el('h2', { text: 'Osnova' }));
    var syl = el('div', { class: 'syllabus' });
    course.chapters.forEach(function (ch, i) {
      var st = DPS.progress.chapter(course.slug, ch);
      syl.appendChild(el('a', { class: 'syl-row' + (ch.status === 'planned' ? ' is-planned' : ''), href: DPS.chapterUrl(course.slug, ch.slug) },
        el('span', { class: 'num', text: String(i + 1) }),
        el('div', null, el('h3', { text: ch.title }), el('p', { text: ch.summary || '' })),
        el('div', { class: 'end' }, ch.hours ? el('span', { text: ch.hours + ' h' }) : null, ringEl(st))));
    });
    sec.appendChild(syl);
    art.appendChild(sec);

    if (course.exam) {
      art.appendChild(el('section', null,
        el('h2', { text: 'Ukončení kurzu' }),
        html('<div class="callout callout--def">' + icon('flag', 22) + '<div><div class="cl-title">' + DPS.esc(course.exam) + '</div><p>' + (course.examDetail || '') + '</p></div></div>')));
    }

    if (course.sources && course.sources.length) {
      var d = el('details', { class: 'acc' }, el('summary', { text: 'Doporučená literatura a zdroje' }),
        el('div', { class: 'acc-body', html: '<ul>' + course.sources.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' }));
      art.appendChild(d);
    }

    page.appendChild(art);
    main.appendChild(page);
    ensureProfile();
  }
  function stat(b, s) { return el('div', { class: 'ov-stat' }, el('b', { text: b }), el('span', { text: s })); }

  /* ==========================================================================
     Kapitola
     ========================================================================== */
  function renderChapter(course, chSlug) {
    var idx = course.chapters.findIndex(function (c) { return c.slug === chSlug; });
    if (idx < 0) { document.body.textContent = 'Kapitola nenalezena: ' + chSlug; return; }
    var ch = course.chapters[idx];
    document.title = ch.title + ' · ' + course.title;

    var article = $('#chapter');
    if (!article) { article = el('article', { id: 'chapter' }); document.body.appendChild(article); }
    article.classList.add('chapter');
    article.remove();

    var main = frame(course, idx, [
      { text: 'Kurzy', href: DPS.root + 'index.html' },
      { text: course.short, href: DPS.courseUrl(course.slug) },
      { text: (idx + 1) + '. ' + ch.title }
    ]);

    var planned = ch.status === 'planned' && !article.children.length;
    if (planned) plannedBody(article, ch);

    applyProfileVisibility(article);
    decorateCallouts(article);

    // sekce, číslování, TOC
    var toc = [];
    $$(':scope > section', article).forEach(function (sec, i) {
      var h2 = $('h2', sec); if (!h2) return;
      var id = sec.id || DPS.slug(h2.textContent) || ('s' + (i + 1));
      sec.id = id;
      var label = h2.textContent;
      h2.innerHTML = '<span class="h-num">' + (toc.length + 1) + '</span><span>' + h2.innerHTML + '</span>';
      toc.push({ id: id, label: label });
    });

    // cvičení
    var count = planned ? 0 : DPS.exercises.mountAll(article, { course: course.slug, chapter: ch.slug });
    if (!planned) applyProfileVisibility(article);
    if (!planned) DPS.progress.visit(course.slug, ch.slug, count);

    // hlavička
    var head = el('header', { class: 'ch-head' },
      el('div', { class: 'kicker', text: 'Kapitola ' + (idx + 1) + ' · ' + course.short }),
      el('h1', { class: 'ch-title', text: ch.title }),
      ch.lead ? el('p', { class: 'ch-lead', html: ch.lead }) : null,
      el('div', { class: 'ch-meta' },
        ch.hours ? el('span', { class: 'meta-chip', html: icon('clock', 14) + ' ' + hoursLabel(ch.hours) }) : null,
        ch.minutes ? el('span', { class: 'meta-chip', html: icon('timer', 14) + ' samostudium ≈ ' + ch.minutes + ' min' }) : null,
        count ? el('span', { class: 'meta-chip', html: icon('puzzle', 14) + ' ' + count + ' ' + DPS.plural(count, 'cvičení', 'cvičení', 'cvičení') }) : null,
        planned ? el('span', { class: 'badge warn', text: 'Připravuje se' }) : null));
    article.insertBefore(head, article.firstChild);

    if (!planned) article.appendChild(finishBlock(course, idx, ch, count));

    var page = el('div', { class: 'page' + (toc.length < 2 ? ' no-toc' : '') });
    page.appendChild(article);
    if (toc.length >= 2) page.appendChild(buildToc(toc));
    main.appendChild(page);

    initScrollSpy(toc);
    ensureProfile();
  }

  function plannedBody(article, ch) {
    var sec = el('section', null, el('h2', { text: 'Osnova kapitoly' }));
    if (ch.outline && ch.outline.length) {
      sec.appendChild(el('ul', { html: ch.outline.map(function (o) { return '<li>' + DPS.esc(o) + '</li>'; }).join('') }));
    }
    article.appendChild(sec);
    article.appendChild(html('<div class="callout callout--practice">' + icon('spark', 22) + '<div><div class="cl-title">Kapitola se připravuje</div><p>Obsah je nyní ve fázi revize a tvorby interaktivních cvičení. Osnova výše vychází z učebního plánu kurzu.</p></div></div>'));
  }

  function buildToc(items) {
    var ol = el('ol');
    items.forEach(function (it) { ol.appendChild(el('li', null, el('a', { href: '#' + it.id, text: it.label, 'data-id': it.id }))); });
    return el('aside', { class: 'toc', 'aria-label': 'Na této stránce' }, el('div', { class: 'toc-title', text: 'Na této stránce' }), ol);
  }

  function initScrollSpy(items) {
    if (!('IntersectionObserver' in window) || !items.length) return;
    var links = {};
    $$('.toc a').forEach(function (a) { links[a.dataset.id] = a; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var first = items.find(function (it) { return visible[it.id]; });
      if (first) { Object.keys(links).forEach(function (k) { links[k].classList.toggle('is-active', k === first.id); }); }
    }, { rootMargin: '-72px 0px -60% 0px' });
    items.forEach(function (it) { var s = document.getElementById(it.id); if (s) io.observe(s); });
    var f = links[items[0].id]; if (f) f.classList.add('is-active');
  }

  function finishBlock(course, idx, ch, count) {
    var box = el('div', { class: 'finish' });
    function paint() {
      var st = DPS.progress.chapter(course.slug, ch);
      var next = course.chapters[idx + 1];
      box.classList.toggle('is-done', st.complete);
      box.innerHTML = '';
      box.appendChild(el('h3', { text: st.complete ? 'Kapitola dokončena' : 'Dokončení kapitoly' }));
      box.appendChild(el('p', { text: count ? 'Splněno ' + st.done + ' z ' + count + ' ' + DPS.plural(count, 'cvičení', 'cvičení', 'cvičení') + '. Kapitolu můžete označit jako dokončenou i ručně.' : 'Kapitolu můžete označit jako dokončenou.' }));
      var row = el('div', { class: 'btn-row' });
      row.appendChild(el('button', {
        class: 'btn ' + (st.complete ? 'btn-ok' : 'btn-primary'),
        html: icon('check', 16) + (st.complete ? ' Označeno jako dokončené' : ' Označit jako dokončenou'),
        onclick: function () { DPS.progress.setComplete(course.slug, ch.slug, !st.complete); }
      }));
      if (next) row.appendChild(el('a', { class: 'btn', href: DPS.chapterUrl(course.slug, next.slug), html: 'Další kapitola ' + icon('arrow-right', 16) }));
      box.appendChild(row);
    }
    paint();
    document.addEventListener('dps:progress', function (e) { if (!e.detail || e.detail.chapter === ch.slug) paint(); });
    return box;
  }

  /* ==========================================================================
     Start
     ========================================================================== */
  DPS.start = function (page) {
    DPS.theme.apply();
    if (page === 'dashboard') { renderDashboard(); return; }
    var course = DPS.getCourse(document.body.dataset.course);
    if (!course) { document.body.textContent = 'Kurz nenalezen.'; return; }
    DPS._course = course;
    document.body.style.setProperty('--accent', course.accent);
    DPS.theme.syncAccent();
    document.body.style.setProperty('--on-accent', course.onAccent || '#08101f');
    if (page === 'overview') renderOverview(course);
    else renderChapter(course, document.body.dataset.chapter);
  };
})();
