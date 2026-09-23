/* ==========================================================================
   Interaktivní nástroje (widgety)
   – taxonomy: průzkumník taxonomií cílů (kognitivní, psychomotorické, afektivní)
   – goalbuilder: sestavování a kontrola výukového cíle (model ABCD)
   – timeplanner: plánování času hodiny / výukového bloku s kontrolou pravidel
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS, el = DPS.el, icon = DPS.icon;

  /* ==========================================================================
     TAXONOMY
     cfg: { domains:['kog','psy','afe'], requireAll?:true }
     ========================================================================== */
  DPS.exercises.register('taxonomy', {
    label: 'Průzkumník taxonomií', icon: 'layers',
    render: function (api) {
      var cfg = api.cfg;
      var domainIds = cfg.domains || ['kog'];
      var seen = api.data.get({}) || {};
      var domId = domainIds[0];
      var lvlIdx = -1;
      var wrap = el('div');
      api.body.appendChild(wrap);

      function persist() { api.data.set(seen); }
      function allSeen() {
        return domainIds.every(function (d) {
          var arr = seen[d] || [];
          return DPS.data.domains[d].levels.every(function (_, i) { return arr.indexOf(i) !== -1; });
        });
      }

      function paint() {
        wrap.innerHTML = '';
        var dom = DPS.data.domains[domId];
        if (domainIds.length > 1) {
          var tabs = el('div', { class: 'bz-tabs', role: 'group', 'aria-label': 'Oblast cílů' });
          domainIds.forEach(function (d) {
            var D = DPS.data.domains[d];
            tabs.appendChild(el('button', { class: 'seg-btn', 'aria-pressed': String(d === domId), onclick: function () { domId = d; lvlIdx = -1; paint(); } }, D.name + ' · ' + D.sub));
          });
          wrap.appendChild(tabs);
        }
        var n = dom.levels.length;
        var grid = el('div', { class: 'bz' });
        var pyr = el('div', { class: 'bz-pyr', role: 'list' });
        dom.levels.slice().reverse().forEach(function (lv, ri) {
          var i = n - 1 - ri;
          var w = 58 + 42 * (1 - i / (n - 1));
          var isSeen = (seen[domId] || []).indexOf(i) !== -1;
          var b = el('button', {
            class: 'bz-lvl' + (i === lvlIdx ? ' is-sel' : '') + (isSeen ? ' is-seen' : ''), type: 'button',
            style: { '--w': w + '%', '--lc': lv.color }, role: 'listitem',
            html: '<span class="n">' + (i + 1) + '</span><span>' + DPS.esc(lv.name) + '</span><span class="seen" title="Prozkoumáno"></span>'
          });
          b.addEventListener('click', function () {
            lvlIdx = i;
            seen[domId] = seen[domId] || [];
            if (seen[domId].indexOf(i) === -1) seen[domId].push(i);
            persist(); paint();
            if (allSeen() && !(api.state() && api.state().done)) { api.complete(1, 1); }
          });
          pyr.appendChild(b);
        });
        pyr.appendChild(el('div', { class: 'bz-cap', text: '▲ náročnější' + ' · ' + DPS.esc(dom.author) }));
        grid.appendChild(pyr);

        var det = el('div', { class: 'bz-detail' });
        if (lvlIdx < 0) {
          det.innerHTML = '<h4>Vyberte úroveň</h4><p class="q">Klepněte na kterýkoli stupeň. Uvidíte, jak se na něm formuluje cíl, jaká slovesa se hodí a příklad pro vaše zaměření (' + DPS.esc(DPS.profile.get().name) + ').</p>' +
            '<p class="hint-line">Prozkoumáno ' + ((seen[domId] || []).length) + ' z ' + n + '.</p>';
        } else {
          var lv = dom.levels[lvlIdx];
          var ex = DPS.byProfile(lv.ex, ['_', 'ov']);
          det.innerHTML = '<h4 style="color:' + lv.color + '">' + (lvlIdx + 1) + '. ' + DPS.esc(lv.name) + '</h4>' +
            '<div class="q">' + DPS.esc(lv.q) + '</div>' +
            '<p>' + DPS.esc(lv.def) + '</p>' +
            '<div class="lab">Slovesa pro formulaci cíle</div><div class="verbs">' + lv.verbs.map(function (v) { return '<span>' + DPS.esc(v) + '</span>'; }).join('') + '</div>' +
            '<div class="lab">Příklad – ' + DPS.esc(DPS.profile.get().name) + '</div><div class="bz-ex">' + DPS.esc(ex) + '</div>';
        }
        grid.appendChild(det);
        wrap.appendChild(grid);
        if (allSeen()) wrap.appendChild(api.fb('ok', 'Prošli jste všechny úrovně. Tento nástroj se hodí i při přípravě: než cíl napíšete, projděte si slovesa na požadované úrovni.'));
      }
      paint();
    }
  });

  /* ==========================================================================
     GOALBUILDER – cíl ve struktuře A (adresát) · C (podmínky) · B (chování) · O (obsah) · D (kritérium)
     cfg: { examples:{ profil: { bad:{a,c,b,o,d}, good:{…} } } }
     ========================================================================== */
  DPS.exercises.register('goalbuilder', {
    label: 'Nástroj: výukový cíl', icon: 'target',
    render: function (api) {
      var cfg = api.cfg;
      var saved = api.data.get({}) || {};
      var goals = saved.goals || [];
      var f = Object.assign({ a: 'Žák', c: '', b: '', o: '', d: '' }, saved.draft || {});
      var domId = 'kog', lvlIdx = -1;

      var wrap = el('div', { class: 'gb' });
      api.body.appendChild(wrap);

      function persist() { api.data.set({ goals: goals, draft: f }); }

      function compose() {
        var parts = [];
        if (f.a.trim()) parts.push('<span class="p-a">' + DPS.esc(f.a.trim()) + '</span>');
        if (f.c.trim()) parts.push('<span class="p-c">' + DPS.esc(lc(f.c.trim())) + '</span>');
        if (f.b.trim()) parts.push('<span class="p-b">' + DPS.esc(f.b.trim()) + '</span>');
        if (f.o.trim()) parts.push('<span class="p-o">' + DPS.esc(f.o.trim()) + '</span>');
        if (f.d.trim()) parts.push('<span class="p-d">' + DPS.esc(f.d.trim()) + '</span>');
        return parts.length ? parts.join(' ') + '.' : '';
      }
      function plain() {
        return [f.a, lc(f.c), f.b, f.o, f.d].map(function (x) { return (x || '').trim(); }).filter(Boolean).join(' ') + '.';
      }
      function lc(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

      function checks() {
        var n = DPS.norm;
        var res = [];
        var a = n(f.a);
        var teacher = /ucitel|instruktor|lektor|vyucujici/.test(a);
        var student = /(zak|zaci|student|absolvent|ucastnik|ucen|ucni)/.test(a);
        res.push({ ok: student && !teacher, t: '<b>Adresát</b> je žák (cíl popisuje, co udělá <i>žák</i>, ne co udělá učitel).', bad: teacher ? 'Cíl popisuje činnost učitele. Přepište ho z pohledu žáka.' : 'Napište, kdo má cíle dosáhnout (Žák, Student…).' });
        var vg = DPS.data.isVague(f.b);
        var info = DPS.data.levelOf(f.b);
        var bok = f.b.trim().length >= 3 && !vg;
        res.push({ ok: bok, t: '<b>Sloveso</b> vyjadřuje činnost, kterou lze <b>pozorovat a ověřit</b>.', bad: vg ? '„' + DPS.esc(f.b.trim()) + '“ nelze pozorovat ani změřit (jak poznám, že žák „pochopil“?). Zvolte sloveso, které uvidím nebo uslyším.' : 'Zvolte sloveso (např. vyjmenuje, změří, posoudí).' });
        res.push({ ok: f.o.trim().length >= 5, t: '<b>Obsah</b> – je jasné, s čím žák pracuje.', bad: 'Doplňte, s jakým učivem, předmětem nebo úkolem žák pracuje.' });
        res.push({ ok: f.c.trim().length >= 5, t: '<b>Podmínky</b> – za jakých okolností (pomůcky, zadání, čas, způsob).', bad: 'Doplňte podmínky: „podle výkresu…“, „bez použití poznámek…“, „s pomocí tabulek…“.' });
        var crit = f.d.trim();
        var critOk = crit.length >= 4 && (/\d/.test(crit) || /bez chyb|spravn|alespon|nejmene|nejvyse|max|min\.|presnost|toleranc|podle kriterii|vsech|vsechny|bezchybn|do \d|z \d/.test(n(crit)));
        res.push({ ok: critOk, t: '<b>Kritérium</b> – podle čeho poznám, že cíle dosáhl (počet, přesnost, čas, kritéria).', bad: 'Doplňte měřítko úspěchu: počet chyb, přesnost, časový limit, splněná kritéria…' });
        return { list: res, level: info, vague: vg };
      }

      function ui() {
        wrap.innerHTML = '';
        var dom = DPS.data.domains[domId];

        // volba slovesa
        var tabs = el('div', { class: 'bz-tabs', role: 'group', 'aria-label': 'Oblast cílů' });
        Object.keys(DPS.data.domains).forEach(function (d) {
          tabs.appendChild(el('button', { class: 'seg-btn', 'aria-pressed': String(d === domId), onclick: function () { domId = d; lvlIdx = -1; ui(); } }, DPS.data.domains[d].name));
        });
        var lvlSel = el('select', { 'aria-label': 'Úroveň' }, el('option', { value: '-1' }, '— zvolte úroveň —'));
        dom.levels.forEach(function (lv, i) { lvlSel.appendChild(el('option', { value: i, selected: i === lvlIdx }, (i + 1) + '. ' + lv.name)); });
        lvlSel.addEventListener('change', function () { lvlIdx = parseInt(lvlSel.value, 10); ui(); });
        var chips = el('div', { class: 'gb-verbs' });
        if (lvlIdx >= 0) dom.levels[lvlIdx].verbs.forEach(function (v) {
          chips.appendChild(el('button', { type: 'button', onclick: function () { f.b = v; persist(); ui(); } }, v));
        });

        function field(key, label, ph, sub, full) {
          var inp = el('input', { type: 'text', value: f[key], placeholder: ph, 'aria-label': label });
          inp.addEventListener('input', function () { f[key] = inp.value; persist(); update(); });
          return el('div', { class: 'gb-f' + (full ? ' full' : '') }, el('label', { html: label + (sub ? ' <span>' + sub + '</span>' : '') }), inp);
        }

        wrap.appendChild(el('div', null, tabs));
        var grid = el('div', { class: 'gb-grid' });
        grid.appendChild(field('a', 'Kdo (adresát)', 'Žák', ''));
        grid.appendChild(field('c', 'Za jakých podmínek', 'podle výkresu a s použitím posuvného měřidla', ''));
        var verbBox = el('div', { class: 'gb-f' },
          el('label', { html: 'Co udělá (sloveso) <span>– pomůže výběr úrovně</span>' }),
          el('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '8px' } }, lvlSel, (function () {
            var inp = el('input', { type: 'text', value: f.b, placeholder: 'např. změří', 'aria-label': 'Sloveso' });
            inp.addEventListener('input', function () { f.b = inp.value; persist(); update(); });
            inp.id = 'gb-verb-' + api.id; return inp;
          })()),
          chips);
        grid.appendChild(verbBox);
        grid.appendChild(field('o', 'S čím / co (obsah)', 'průměr hřídele', ''));
        grid.appendChild(field('d', 'Jak dobře (kritérium)', 's přesností 0,05 mm, nejvýše 1 chyba z 10 měření', '', true));
        wrap.appendChild(grid);

        var pv = el('div', { class: 'gb-preview', 'aria-live': 'polite' });
        wrap.appendChild(pv);
        wrap.appendChild(el('div', { class: 'gb-legend' },
          leg('#9fc0ff', 'Adresát (A)'), leg('#ffd58a', 'Podmínky (C)'), leg('#7fe6b8', 'Chování / sloveso (B)'), leg('var(--tx)', 'Obsah'), leg('#ff9fb0', 'Kritérium (D)')));
        var lvlInfo = el('div', { class: 'gb-lvl' });
        wrap.appendChild(lvlInfo);
        var list = el('ul', { class: 'gb-check' });
        wrap.appendChild(list);
        var actions = el('div', { class: 'ex-tools' });
        wrap.appendChild(actions);
        var saveBox = el('div', { class: 'gb-saved' });
        wrap.appendChild(saveBox);

        var ex = DPS.byProfile(cfg.examples, ['_', 'ov']);
        function setEx(k) { var e = ex && ex[k]; if (!e) return; f = Object.assign({ a: 'Žák', c: '', b: '', o: '', d: '' }, e); persist(); ui(); }

        function update() {
          var html = compose();
          pv.innerHTML = html || '<span class="empty">Sem se skládá váš cíl. Začněte vyplňovat pole výše.</span>';
          var r = checks();
          list.innerHTML = '';
          r.list.forEach(function (c) {
            var li = el('li', { class: c.ok ? 'ok' : 'bad' });
            li.innerHTML = '<span class="st">' + icon(c.ok ? 'check' : 'x', 12) + '</span><span>' + c.t + (c.ok ? '' : '<br><span style="color:var(--tx-3)">' + c.bad + '</span>') + '</span>';
            list.appendChild(li);
          });
          var lv = r.level;
          lvlInfo.innerHTML = lv ? ('Sloveso odpovídá úrovni: <span class="badge acc">' + DPS.esc(lv.domainName) + ' · ' + DPS.esc(lv.level.name) + '</span> <span class="src">(orientačně – rozhoduje zadaný úkol, ne samotné sloveso)</span>') : '';
          var allOk = r.list.every(function (c) { return c.ok; });
          actions.replaceChildren();
          if (ex && ex.bad) actions.appendChild(el('button', { class: 'btn btn-sm', onclick: function () { setEx('bad'); } }, 'Ukázat špatný cíl'));
          if (ex && ex.good) actions.appendChild(el('button', { class: 'btn btn-sm', onclick: function () { setEx('good'); } }, 'Ukázat dobrý cíl'));
          actions.appendChild(el('button', { class: 'btn btn-sm btn-ghost', onclick: function () { f = { a: 'Žák', c: '', b: '', o: '', d: '' }; persist(); ui(); } }, 'Vymazat'));
          actions.appendChild(el('button', {
            class: 'btn btn-sm btn-primary', disabled: !allOk, html: icon('save', 15) + ' Uložit cíl', onclick: function () {
              goals.unshift(plain()); goals = goals.slice(0, 8); persist(); renderSaved();
              if (!(api.state() && api.state().done)) api.complete(1, 1);
              DPS.toast('Cíl uložen');
            }
          }));
          if (!allOk) actions.lastChild.title = 'Uložit lze cíl, který splňuje všech pět kontrol.';
        }
        function renderSaved() {
          saveBox.replaceChildren();
          if (!goals.length) return;
          saveBox.appendChild(el('div', { class: 'lab', style: { fontSize: '0.72rem', letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--tx-3)', fontWeight: 650 }, text: 'Vaše uložené cíle' }));
          goals.forEach(function (g, i) {
            saveBox.appendChild(el('div', null, el('span', { text: g }),
              el('span', { class: 'od-btns' },
                el('button', { class: 'icon-btn', 'aria-label': 'Kopírovat', title: 'Kopírovat', html: icon('copy', 15), onclick: function () { DPS.copy(g); } }),
                el('button', { class: 'icon-btn', 'aria-label': 'Smazat', title: 'Smazat', html: icon('trash', 15), onclick: function () { goals.splice(i, 1); persist(); renderSaved(); } }))));
          });
        }
        update(); renderSaved();
      }
      function leg(c, t) { return el('span', { html: '<i style="background:' + c + '"></i>' + t }); }
      ui();
    }
  });

  /* ==========================================================================
     TIMEPLANNER
     cfg: { duration:45, step?:1, unit?:'min', phases:[{id,name,sub?,color,min,rec?}],
            rules:[{kind:'phaseMin', id, op:'>='|'<=', value, text}
                   | {kind:'sumShare', ids:[..], op, pct, text}],
            presets:[{name, values:{id:min}}], task? }
     ========================================================================== */
  DPS.exercises.register('timeplanner', {
    label: 'Nástroj: plán času', icon: 'timer',
    render: function (api) {
      var cfg = api.cfg;
      var D = cfg.duration;
      var step = cfg.step || 1;
      var unit = cfg.unit || 'min';
      var vals = {};
      var saved = api.data.get(null);
      cfg.phases.forEach(function (p) { vals[p.id] = saved && saved[p.id] != null ? saved[p.id] : p.min; });

      var wrap = el('div', { class: 'tp' });
      api.body.appendChild(wrap);
      var sumBox = el('div', { class: 'tp-sum' });
      var line = el('div', { class: 'tp-line', role: 'img', 'aria-label': 'Časová osa' });
      var rows = el('div', { class: 'tp-rows' });
      var rules = el('ul', { class: 'tp-rules' });
      var presets = el('div', { class: 'ex-tools' });

      var inputs = {};
      cfg.phases.forEach(function (p) {
        var range = el('input', { type: 'range', min: 0, max: D, step: step, value: vals[p.id], 'aria-label': p.name });
        var num = el('input', { type: 'number', min: 0, max: D, step: step, value: vals[p.id], 'aria-label': p.name + ' (' + unit + ')' });
        function set(v) {
          v = DPS.clamp(parseInt(v, 10) || 0, 0, D);
          vals[p.id] = v; range.value = v; num.value = v; update(true);
        }
        range.addEventListener('input', function () { set(range.value); });
        num.addEventListener('input', function () { set(num.value); });
        inputs[p.id] = { range: range, num: num };
        rows.appendChild(el('div', { class: 'tp-row', style: { '--pc': p.color } },
          el('div', { class: 'nm' }, el('i'), el('span', { html: DPS.esc(p.name) + (p.sub ? '<small>' + DPS.esc(p.sub) + '</small>' : '') })),
          range, num));
      });

      (cfg.presets || []).forEach(function (pr) {
        presets.appendChild(el('button', {
          class: 'btn btn-sm', onclick: function () {
            cfg.phases.forEach(function (p) { vals[p.id] = pr.values[p.id] != null ? pr.values[p.id] : 0; inputs[p.id].range.value = vals[p.id]; inputs[p.id].num.value = vals[p.id]; });
            update(true);
          }
        }, pr.name));
      });

      function total() { return cfg.phases.reduce(function (a, p) { return a + (vals[p.id] || 0); }, 0); }
      function sum(ids) { return ids.reduce(function (a, id) { return a + (vals[id] || 0); }, 0); }
      function cmp(v, op, t) { return op === '>=' ? v >= t : (op === '<=' ? v <= t : (op === '>' ? v > t : (op === '<' ? v < t : v === t))); }

      function update(persist) {
        var t = total();
        sumBox.className = 'tp-sum ' + (t === D ? 'ok' : (t > D ? 'bad' : ''));
        sumBox.innerHTML = 'Naplánováno <b>' + t + '</b> z ' + D + ' ' + unit + (t === D ? ' – sedí' : (t > D ? ' – o ' + (t - D) + ' ' + unit + ' moc' : ' – zbývá ' + (D - t) + ' ' + unit));
        line.replaceChildren();
        cfg.phases.forEach(function (p) {
          var v = vals[p.id] || 0; if (!v) return;
          line.appendChild(el('div', { class: 'tp-seg', style: { flexGrow: v, flexBasis: 0, '--pc': p.color }, title: p.name + ': ' + v + ' ' + unit, text: v >= D * 0.08 ? v : '' }));
        });
        if (t < D) line.appendChild(el('div', { style: { flexGrow: D - t, flexBasis: 0 } }));
        rules.replaceChildren();
        var allOk = t === D;
        var res = [{ ok: t === D, t: 'Součet časů odpovídá délce (<b>' + D + ' ' + unit + '</b>).' }];
        (cfg.rules || []).forEach(function (r) {
          var ok;
          if (r.kind === 'phaseMin') ok = cmp(vals[r.id] || 0, r.op, r.value);
          else if (r.kind === 'sumShare') ok = cmp(D ? sum(r.ids) / D * 100 : 0, r.op, r.pct);
          else ok = true;
          res.push({ ok: ok, t: r.text });
        });
        res.forEach(function (r) {
          if (!r.ok) allOk = false;
          var li = el('li', { class: r.ok ? 'ok' : 'bad' });
          li.innerHTML = '<span class="st">' + icon(r.ok ? 'check' : 'x', 12) + '</span><span>' + r.t + '</span>';
          rules.appendChild(li);
        });
        if (persist) api.data.set(vals);
        if (allOk && !(api.state() && api.state().done)) { api.complete(1, 1); }
      }

      if (cfg.task) api.body.insertBefore(el('div', { class: 'callout callout--practice', html: icon('flag', 22) + '<div><div class="cl-title">Zadání</div>' + cfg.task + '</div>' }), api.body.firstChild);
      wrap.appendChild(el('div', { class: 'tp-top' }, sumBox));
      wrap.appendChild(line);
      wrap.appendChild(rows);
      if ((cfg.presets || []).length) wrap.appendChild(el('div', null, el('div', { class: 'hint-line', style: { marginTop: 0, marginBottom: '8px' }, text: 'Výchozí rozvrhy k porovnání:' }), presets));
      wrap.appendChild(rules);
      update(false);
    }
  });
})();
