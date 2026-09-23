/* ==========================================================================
   Další typy cvičení
   – annotate:  přiřazování kategorií částem textu (např. činnost učitele / žáků)
   – rewrite:   přepište špatný text (zpětná vazba, zadání, cíl…), kontrola podle kritérií
   – checklist: kontrolní seznam nebo škálové hodnocení (pozorovací arch, sebehodnocení)
   – rubric:    tvorba hodnoticí rubriky s kontrolou kvality
   – examsim:   trenažér ústní zkoušky (losování, časomíra, sebehodnocení)
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS, el = DPS.el, icon = DPS.icon, esc = DPS.esc;
  var PALETTE = ['#7aa2ff', '#4dd0e1', '#ffb86b', '#b39bff', '#7fe6b8', '#ff9fb0', '#e6d36a', '#9aa7ff'];

  /* ==========================================================================
     ANNOTATE
     cfg: { categories:[{id,name,color?}], parts:[ "text" | {t, cat:id|null, why?} ], pass?:0.7 }
     ========================================================================== */
  DPS.exercises.register('annotate', {
    label: 'Označte v textu', icon: 'cursor',
    render: function (api) {
      var cfg = api.cfg, cats = cfg.categories;
      var col = {}; cats.forEach(function (c, i) { col[c.id] = c.color || PALETTE[i % PALETTE.length]; });
      var active = cats[0].id, checked = false;
      var assign = [];
      var wrap = el('div', { class: 'an' });
      var palette = el('div', { class: 'an-pal', role: 'group', 'aria-label': 'Kategorie' });
      var text = el('div', { class: 'an-text' });
      var info = el('div');
      var segs = [];

      cats.forEach(function (c) {
        var b = el('button', { type: 'button', class: 'an-cat', 'aria-pressed': String(c.id === active), style: { '--cc': col[c.id] }, html: '<i></i>' + esc(c.name) });
        b.addEventListener('click', function () { active = c.id; paintPal(); });
        c._b = b; palette.appendChild(b);
      });
      function paintPal() { cats.forEach(function (c) { c._b.setAttribute('aria-pressed', String(c.id === active)); }); }

      cfg.parts.forEach(function (p) {
        if (typeof p === 'string') { text.appendChild(document.createTextNode(p)); return; }
        var idx = segs.length; assign[idx] = null;
        var b = el('button', { type: 'button', class: 'an-seg', html: p.t });
        b._p = p;
        b.addEventListener('click', function () {
          if (checked) return;
          assign[idx] = assign[idx] === active ? null : active;
          paintSeg(idx);
          btn.disabled = assign.every(function (a) { return a === null; });
        });
        segs.push(b); text.appendChild(b);
      });
      function paintSeg(i) {
        var b = segs[i], a = assign[i];
        b.style.setProperty('--cc', a ? col[a] : 'transparent');
        b.classList.toggle('is-set', !!a);
        var tag = b.querySelector('.an-tag'); if (tag) tag.remove();
        if (a) { var c = cats.find(function (x) { return x.id === a; }); b.appendChild(el('span', { class: 'an-tag', text: c.name })); }
      }

      var btn = el('button', {
        class: 'btn btn-primary', disabled: true, onclick: function () {
          checked = true;
          var ok = 0, notes = [];
          segs.forEach(function (b, i) {
            var want = b._p.cat == null ? null : b._p.cat, got = assign[i];
            b.classList.remove('is-ok', 'is-bad');
            var good = want === got;
            if (good) ok++;
            b.classList.add(good ? 'is-ok' : 'is-bad');
            if (!good) {
              var wc = want ? cats.find(function (c) { return c.id === want; }).name : 'nic (bez kategorie)';
              notes.push('<div><b>„' + b._p.t.replace(/<[^>]+>/g, '') + '“</b> → ' + esc(wc) + (b._p.why ? ' – ' + b._p.why : '') + '</div>');
            }
          });
          var pass = cfg.pass != null ? cfg.pass : 0.7, ratio = ok / segs.length;
          var good = ratio >= pass;
          info.replaceChildren(api.fb(ratio === 1 ? 'ok' : (good ? 'warn' : 'bad'),
            '<strong>' + ok + ' z ' + segs.length + ' správně.</strong>' + (notes.length ? '<div class="sp-list">' + notes.join('') + '</div>' : '')));
          btn.hidden = true;
          tools.replaceChildren(el('button', {
            class: 'btn', onclick: function () {
              checked = false; btn.hidden = false;
              segs.forEach(function (b) { b.classList.remove('is-ok', 'is-bad'); });
              info.replaceChildren(); tools.replaceChildren(btn);
            }
          }, 'Opravit odpovědi'));
          if (good) api.complete(ok, segs.length);
        }
      }, 'Zkontrolovat');
      var tools = el('div', { class: 'ex-tools' }, btn);

      wrap.appendChild(el('div', { class: 'hint-line', style: { marginTop: 0, marginBottom: '8px' }, text: 'Vyberte kategorii a klepněte na části textu, které do ní patří. Klepnutím na označenou část kategorii zrušíte. Ne vše musí patřit do některé kategorie.' }));
      wrap.appendChild(palette); wrap.appendChild(text); wrap.appendChild(tools); wrap.appendChild(info);
      api.body.appendChild(wrap);
    }
  });

  /* ==========================================================================
     REWRITE
     cfg: { items:[{ title?, situation?, bad, task?, checks:[{label, any:[regex bez diakritiky], hint?}], model, minLen?:25 }], need?:0.7 }
     Regulární výrazy se testují na textu bez diakritiky a malými písmeny.
     ========================================================================== */
  DPS.exercises.register('rewrite', {
    label: 'Přepište', icon: 'pencil',
    render: function (api) {
      var cfg = api.cfg, need = cfg.need != null ? cfg.need : 0.7;
      var saved = api.data.get({}) || {};
      var texts = saved.texts || [], passed = saved.passed || [];
      var cur = 0;
      var wrap = el('div', { class: 'rw' });
      api.body.appendChild(wrap);

      function persist() { api.data.set({ texts: texts, passed: passed }); }
      function evaluate(item, value) {
        var n = DPS.norm(value);
        return item.checks.map(function (c) {
          var ok = (c.any || []).some(function (p) { try { return new RegExp(p, 'i').test(n); } catch (e) { return false; } });
          if (c.all) ok = c.all.every(function (p) { try { return new RegExp(p, 'i').test(n); } catch (e) { return false; } });
          return { c: c, ok: ok };
        });
      }

      function paint() {
        wrap.innerHTML = '';
        var item = cfg.items[cur];
        var minLen = item.minLen != null ? item.minLen : 25;
        var nav = el('div', { class: 'qz-top' });
        var dots = el('div', { class: 'qz-dots' });
        cfg.items.forEach(function (_, i) { dots.appendChild(el('i', { class: i === cur ? 'cur' : (passed[i] ? 'ok' : ''), onclick: function () { cur = i; paint(); }, style: { cursor: 'pointer' } })); });
        nav.appendChild(dots); nav.appendChild(el('span', { class: 'qz-count', text: (cur + 1) + ' / ' + cfg.items.length }));
        wrap.appendChild(nav);
        if (item.title) wrap.appendChild(el('h4', { class: 'rw-title', text: item.title }));
        if (item.situation) wrap.appendChild(el('p', { class: 'rw-sit', html: item.situation }));
        wrap.appendChild(el('div', { class: 'rw-bad' }, el('div', { class: 'lab', text: 'Původní text' }), el('div', { class: 'txt', html: item.bad })));
        if (item.task) wrap.appendChild(el('p', { class: 'rw-task', html: item.task }));
        var ta = el('textarea', { placeholder: 'Napište vlastní verzi…', 'aria-label': 'Vaše verze' });
        ta.value = texts[cur] || '';
        var res = el('div');
        var tools = el('div', { class: 'ex-tools' });
        ta.addEventListener('input', DPS.debounce(function () { texts[cur] = ta.value; persist(); }, 300));
        var check = el('button', {
          class: 'btn btn-primary', onclick: function () {
            texts[cur] = ta.value;
            var len = ta.value.trim().length;
            if (len < minLen) { res.replaceChildren(api.fb('warn', 'Napište alespoň jednu celou větu (minimálně ' + minLen + ' znaků).')); return; }
            var r = evaluate(item, ta.value);
            var okN = r.filter(function (x) { return x.ok; }).length;
            var good = okN / r.length >= need;
            passed[cur] = good; persist();
            var ul = '<ul class="rw-checks">' + r.map(function (x) {
              return '<li class="' + (x.ok ? 'ok' : 'bad') + '"><span class="st">' + icon(x.ok ? 'check' : 'x', 12) + '</span><span>' + x.c.label + (x.ok ? '' : (x.c.hint ? '<br><span style="color:var(--tx-3)">' + x.c.hint + '</span>' : '')) + '</span></li>';
            }).join('') + '</ul>';
            var box = api.fb(okN === r.length ? 'ok' : (good ? 'warn' : 'bad'),
              '<strong>' + okN + ' z ' + r.length + ' kritérií splněno.</strong> <span style="color:var(--tx-3)">(Kontrola je orientační, hledá klíčové znaky ve vašem textu.)</span>' + ul);
            res.replaceChildren(box);
            if (good || okN > 0) {
              res.appendChild(el('details', { class: 'acc', open: good }, el('summary', { text: 'Ukázkové řešení' }), el('div', { class: 'acc-body', html: item.model })));
            }
            if (passed.every(Boolean) && passed.length === cfg.items.length) api.complete(cfg.items.length, cfg.items.length);
            paintNext();
          }
        }, 'Zkontrolovat');
        tools.appendChild(check);
        var nextBox = el('span');
        tools.appendChild(nextBox);
        function paintNext() {
          nextBox.replaceChildren();
          if (cur < cfg.items.length - 1 && passed[cur]) nextBox.appendChild(el('button', { class: 'btn', onclick: function () { cur++; paint(); } }, 'Další příklad'));
        }
        wrap.appendChild(ta); wrap.appendChild(tools); wrap.appendChild(res);
        paintNext();
      }
      paint();
    }
  });

  /* ==========================================================================
     CHECKLIST
     cfg: { items:[ "text" | {t, sub?, group?} ], scale?:["1 – …","2 – …"], file?, header? }
     bez scale: zaškrtávání; se scale: každá položka se hodnotí na škále
     ========================================================================== */
  DPS.exercises.register('checklist', {
    label: 'Kontrolní seznam', icon: 'list',
    render: function (api) {
      var cfg = api.cfg;
      var items = cfg.items.map(function (x) { return typeof x === 'string' ? { t: x } : x; });
      var scale = cfg.scale || null;
      var st = api.data.get({}) || {};
      var wrap = el('div', { class: 'ck' });
      var bar = el('div', { class: 'bar', style: { maxWidth: '260px' } }, el('i'));
      var count = el('span', { class: 'ck-count' });
      var info = el('div');
      var rows = [];
      var lastGroup = null;
      items.forEach(function (it, i) {
        if (it.group && it.group !== lastGroup) { wrap.appendChild(el('h4', { class: 'ck-group', text: it.group })); lastGroup = it.group; }
        var row = el('div', { class: 'ck-row' });
        var label = el('div', { class: 'ck-t', html: it.t + (it.sub ? '<small>' + it.sub + '</small>' : '') });
        if (!scale) {
          var b = el('button', { type: 'button', class: 'ck-box', role: 'checkbox', 'aria-checked': String(!!st[i]), 'aria-label': it.t.replace(/<[^>]+>/g, ''), html: icon('check', 14) });
          b.addEventListener('click', function () { st[i] = !st[i]; b.setAttribute('aria-checked', String(!!st[i])); save(); });
          row.appendChild(b); row.appendChild(label);
        } else {
          var seg = el('div', { class: 'ck-scale', role: 'radiogroup' });
          scale.forEach(function (lab, k) {
            var sb = el('button', { type: 'button', class: 'ck-sc', role: 'radio', 'aria-checked': String(st[i] === k + 1), title: lab, text: String(k + 1) });
            sb.addEventListener('click', function () { st[i] = st[i] === k + 1 ? null : k + 1; seg.querySelectorAll('.ck-sc').forEach(function (x, j) { x.setAttribute('aria-checked', String(st[i] === j + 1)); }); save(); });
            seg.appendChild(sb);
          });
          row.appendChild(label); row.appendChild(seg);
        }
        wrap.appendChild(row); rows.push(row);
      });
      function doneCount() { return items.filter(function (_, i) { return scale ? st[i] != null : !!st[i]; }).length; }
      function asText() {
        return (cfg.header ? cfg.header + '\n\n' : '') + items.map(function (it, i) {
          var t = it.t.replace(/<[^>]+>/g, '');
          return scale ? (st[i] != null ? st[i] : '–') + ' | ' + t : (st[i] ? '[x] ' : '[ ] ') + t;
        }).join('\n') + (scale ? '\n\nŠkála: ' + scale.join('; ') : '');
      }
      function save() {
        api.data.set(st);
        var n = doneCount();
        bar.firstChild.style.setProperty('--v', Math.round(n / items.length * 100));
        count.textContent = (scale ? 'Ohodnoceno ' : 'Splněno ') + n + ' z ' + items.length;
        if (n === items.length) {
          if (!(api.state() && api.state().done)) api.complete(n, items.length);
          info.replaceChildren(api.fb('ok', scale ? '<strong>Hotovo.</strong> Přehled si můžete zkopírovat nebo stáhnout a vrátit se k němu za několik týdnů.' : '<strong>Všechny body máte splněné.</strong>'));
        } else info.replaceChildren();
      }
      api.body.appendChild(el('div', { class: 'ck-top' }, count, bar));
      if (scale) api.body.appendChild(el('p', { class: 'hint-line', style: { marginTop: 0 }, html: 'Škála: ' + scale.map(function (s, k) { return /^\s*\d+\s*[=–:.\-)]/.test(s) ? '<b>' + s.replace(/^\s*(\d+)\s*[=–:.\-)]\s*/, '$1</b> = ') : '<b>' + (k + 1) + '</b> = ' + s; }).join(' · ') }));
      api.body.appendChild(wrap);
      api.body.appendChild(el('div', { class: 'ex-tools' },
        el('button', { class: 'btn btn-sm', html: icon('copy', 15) + ' Kopírovat', onclick: function () { DPS.copy(asText()); } }),
        el('button', { class: 'btn btn-sm', html: icon('download', 15) + ' Stáhnout .txt', onclick: function () { DPS.download((cfg.file || 'seznam') + '.txt', asText()); } })));
      api.body.appendChild(info);
      save();
    }
  });

  /* ==========================================================================
     RUBRIC – tvorba hodnoticí rubriky
     cfg: { levels:["Výborně","Dobře","Nedostatečně"], criteria:[ "název" | {name} ], minCriteria?:3,
            example?:[{name, cells:[…]}], task?, file? }
     ========================================================================== */
  var VAGUE = /\b(dobre|spatne|hezk\w*|pekn\w*|slusn\w*|snazi\w*|celkove|obecne|hodne|malo|prilis)\b/;
  DPS.exercises.register('rubric', {
    label: 'Nástroj: hodnoticí rubrika', icon: 'grid',
    render: function (api) {
      var cfg = api.cfg, L = cfg.levels;
      var minC = cfg.minCriteria != null ? cfg.minCriteria : 3;
      var saved = api.data.get(null);
      var rows = saved && saved.rows ? saved.rows : (cfg.criteria || []).map(function (c) { return { name: typeof c === 'string' ? c : c.name, cells: L.map(function () { return ''; }) }; });
      while (rows.length < minC) rows.push({ name: '', cells: L.map(function () { return ''; }) });
      var wrap = el('div', { class: 'rb' });
      var tableBox = el('div', { class: 'table-wrap' });
      var checks = el('ul', { class: 'tp-rules' });
      var tools = el('div', { class: 'ex-tools' });
      var pendingSave = DPS.debounce(function () { api.data.set({ rows: rows }); }, 300);

      function validate() {
        var named = rows.filter(function (r) { return r.name.trim().length >= 3; });
        var res = [];
        res.push({ ok: named.length >= minC, t: 'Rubrika má alespoň <b>' + minC + ' pojmenovaná kritéria</b> (teď ' + named.length + ').' });
        var cellsOk = named.length > 0 && named.every(function (r) { return r.cells.every(function (c) { return c.trim().length >= 12; }); });
        res.push({ ok: cellsOk, t: '<b>Každá úroveň</b> každého kritéria má popis (alespoň krátká věta).' });
        var vague = [];
        named.forEach(function (r) { r.cells.forEach(function (c, k) { if (VAGUE.test(DPS.norm(c))) vague.push(r.name + ' / ' + L[k]); }); });
        res.push({ ok: named.length > 0 && !vague.length, t: 'Popisy jsou <b>pozorovatelné</b>, bez slov jako „dobře“, „špatně“, „pěkně“, „snaží se“.', bad: vague.length ? 'Přepište: ' + esc(vague.slice(0, 3).join('; ')) + (vague.length > 3 ? '…' : '') : '' });
        var diff = named.length > 0 && named.every(function (r) { var s = r.cells.map(function (c) { return DPS.norm(c); }); return new Set(s).size === s.length; });
        res.push({ ok: diff, t: 'Úrovně se v každém kritériu <b>opravdu liší</b> (nejsou to stejné věty).' });
        return res;
      }
      function refreshChecks() {
        checks.replaceChildren();
        var res = validate(), all = true;
        res.forEach(function (r) {
          if (!r.ok) all = false;
          var li = el('li', { class: r.ok ? 'ok' : 'bad' });
          li.innerHTML = '<span class="st">' + icon(r.ok ? 'check' : 'x', 12) + '</span><span>' + r.t + (!r.ok && r.bad ? '<br><span style="color:var(--tx-3)">' + r.bad + '</span>' : '') + '</span>';
          checks.appendChild(li);
        });
        if (all && !(api.state() && api.state().done)) api.complete(1, 1);
      }
      function paintTable() {
        var t = el('table', { class: 'table rb-table' });
        var thead = el('thead'), hr = el('tr');
        hr.appendChild(el('th', { text: 'Kritérium' }));
        L.forEach(function (l) { hr.appendChild(el('th', { text: l })); });
        hr.appendChild(el('th', { text: '' }));
        thead.appendChild(hr); t.appendChild(thead);
        var tb = el('tbody');
        rows.forEach(function (r, i) {
          var tr = el('tr');
          var nm = el('textarea', { rows: 2, placeholder: 'např. Přesnost', 'aria-label': 'Název kritéria' }); nm.value = r.name;
          nm.addEventListener('input', function () { r.name = nm.value; pendingSave(); refreshChecks(); });
          tr.appendChild(el('td', null, nm));
          r.cells.forEach(function (c, k) {
            var ta = el('textarea', { rows: 4, placeholder: 'Co žák udělá nebo předvede…', 'aria-label': r.name + ' – ' + L[k] }); ta.value = c;
            ta.addEventListener('input', function () { r.cells[k] = ta.value; pendingSave(); refreshChecks(); });
            tr.appendChild(el('td', null, ta));
          });
          tr.appendChild(el('td', null, el('button', { class: 'icon-btn', 'aria-label': 'Odebrat kritérium', title: 'Odebrat kritérium', html: icon('trash', 15), disabled: rows.length <= 1, onclick: function () { rows.splice(i, 1); pendingSave(); paintTable(); refreshChecks(); } })));
          tb.appendChild(tr);
        });
        t.appendChild(tb);
        tableBox.replaceChildren(t);
      }
      function asText() {
        var head = '| Kritérium | ' + L.join(' | ') + ' |\n|' + ['---'].concat(L.map(function () { return '---'; })).join('|') + '|';
        return (cfg.header ? cfg.header + '\n\n' : '') + head + '\n' + rows.filter(function (r) { return r.name.trim(); }).map(function (r) {
          return '| ' + r.name.trim() + ' | ' + r.cells.map(function (c) { return c.trim().replace(/\|/g, '/').replace(/\n/g, ' '); }).join(' | ') + ' |';
        }).join('\n');
      }
      function asCsv() {
        var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
        return '﻿' + [['Kritérium'].concat(L)].concat(rows.filter(function (r) { return r.name.trim(); }).map(function (r) { return [r.name].concat(r.cells); })).map(function (r) { return r.map(q).join(';'); }).join('\r\n');
      }
      tools.appendChild(el('button', { class: 'btn btn-sm', html: icon('plus', 15) + ' Přidat kritérium', onclick: function () { rows.push({ name: '', cells: L.map(function () { return ''; }) }); pendingSave(); paintTable(); refreshChecks(); } }));
      if (cfg.example) tools.appendChild(el('button', {
        class: 'btn btn-sm', onclick: function () {
          DPS.confirm('Nahradit vaši rubriku ukázkou?', 'Vaše aktuální text v tabulce se přepíše ukázkovou rubrikou.', 'Nahradit').then(function (ok) {
            if (!ok) return;
            rows = cfg.example.map(function (r) { return { name: r.name, cells: r.cells.slice() }; });
            pendingSave(); paintTable(); refreshChecks();
          });
        }
      }, 'Ukázat příklad'));
      tools.appendChild(el('button', { class: 'btn btn-sm', html: icon('copy', 15) + ' Kopírovat', onclick: function () { DPS.copy(asText()); } }));
      tools.appendChild(el('button', { class: 'btn btn-sm', html: icon('download', 15) + ' Stáhnout .csv', onclick: function () { DPS.download((cfg.file || 'rubrika') + '.csv', asCsv(), 'text/csv;charset=utf-8'); } }));
      if (cfg.task) api.body.appendChild(el('div', { class: 'callout callout--practice', html: icon('flag', 22) + '<div><div class="cl-title">Zadání</div>' + cfg.task + '</div>' }));
      wrap.appendChild(tableBox); wrap.appendChild(tools); wrap.appendChild(checks);
      api.body.appendChild(wrap);
      paintTable(); refreshChecks();
    }
  });

  /* ==========================================================================
     EXAMSIM – trenažér ústní zkoušky
     cfg: { prep?:10, answer?:15, needed?:1, pools:[ {id, name, items:[{id?, q, points:[…], tip?}]} ],
            criteria?:[ "Uvedl jsem příklad z praxe", … ] }
     Losuje se jedna otázka z každého poolu.
     ========================================================================== */
  DPS.exercises.register('examsim', {
    label: 'Trenažér zkoušky', icon: 'timer',
    render: function (api) {
      var cfg = api.cfg;
      var prepMin = cfg.prep != null ? cfg.prep : 10, ansMin = cfg.answer != null ? cfg.answer : 15;
      var needed = cfg.needed != null ? cfg.needed : 1;
      var st = api.data.get({ history: [], used: {} }) || { history: [], used: {} };
      st.history = st.history || []; st.used = st.used || {};
      var wrap = el('div', { class: 'xs' });
      api.body.appendChild(wrap);
      var timer = null;
      function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
      function save() { api.data.set(st); }
      function fmt(s) { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
      function plain(h) { return String(h).replace(/<[^>]+>/g, ''); }

      function draw() {
        return cfg.pools.map(function (pool) {
          var used = st.used[pool.id] || [];
          var free = pool.items.map(function (_, i) { return i; }).filter(function (i) { return used.indexOf(i) === -1; });
          if (!free.length) { used = []; free = pool.items.map(function (_, i) { return i; }); }
          var i = free[Math.floor(Math.random() * free.length)];
          st.used[pool.id] = used.concat([i]);
          return { pool: pool, item: pool.items[i], i: i };
        });
      }

      function idle() {
        stopTimer(); wrap.innerHTML = '';
        var done = st.history.length;
        wrap.appendChild(el('div', { class: 'xs-intro', html:
          '<p>Zkouška probíhá takto: <b>vylosujete ' + cfg.pools.length + ' ' + DPS.plural(cfg.pools.length, 'otázku', 'otázky', 'otázek') + '</b> (' + cfg.pools.map(function (p) { return esc(p.name); }).join(' + ') + '), máte <b>' + prepMin + ' minut na přípravu</b> a <b>' + ansMin + ' minut na odpověď</b>. Poznámky používat smíte. Na konci si odpověď ohodnotíte podle bodů, které mají v dobré odpovědi zaznít.</p>' +
          '<p>Nejlépe se to trénuje nahlas. Odpovídejte, jako by před vámi seděla komise.</p>' }));
        if (done) wrap.appendChild(el('p', { class: 'hint-line', style: { marginTop: 0 }, text: 'Dosavadní pokusy: ' + done + ' (průměr ' + Math.round(st.history.reduce(function (a, h) { return a + h.pct; }, 0) / done) + ' %).' }));
        wrap.appendChild(el('div', { class: 'ex-tools' }, el('button', { class: 'btn btn-primary', onclick: function () { drawn(draw()); } }, done ? 'Losovat další otázky' : 'Losovat otázky')));
        if (done) wrap.appendChild(historyBox());
      }
      function historyBox() {
        var box = el('div', { class: 'xs-hist' });
        box.appendChild(el('div', { class: 'lab', text: 'Předchozí pokusy' }));
        st.history.slice(-5).reverse().forEach(function (h) {
          box.appendChild(el('div', { class: 'xs-h', html: '<b>' + h.pct + ' %</b> ' + h.qs.map(function (q) { return esc(plain(q)); }).join(' · ') }));
        });
        return box;
      }

      function questionsBox(d, showPoints) {
        var box = el('div', { class: 'xs-qs' });
        d.forEach(function (x) {
          box.appendChild(el('div', { class: 'xs-q' }, el('span', { class: 'tag', text: x.pool.name }), el('p', { html: x.item.q })));
        });
        return box;
      }

      function drawn(d) {
        stopTimer(); wrap.innerHTML = '';
        wrap.appendChild(el('div', { class: 'lab xs-lab', text: 'Vylosované otázky' }));
        wrap.appendChild(questionsBox(d));
        wrap.appendChild(el('div', { class: 'ex-tools' },
          el('button', { class: 'btn btn-primary', onclick: function () { phase(d, 'prep'); } }, 'Začít přípravu (' + prepMin + ' min)'),
          el('button', { class: 'btn btn-ghost', onclick: function () { drawn(draw()); } }, 'Vylosovat jiné')));
      }

      function phase(d, which, notesVal) {
        stopTimer(); wrap.innerHTML = '';
        var total = (which === 'prep' ? prepMin : ansMin) * 60;
        var start = Date.now(), paused = false, pausedAt = 0, offset = 0;
        wrap.appendChild(el('div', { class: 'xs-phase', text: which === 'prep' ? 'Příprava' : 'Odpověď' }));
        var clock = el('div', { class: 'xs-clock', text: fmt(total) });
        var bar = el('div', { class: 'bar' }, el('i'));
        wrap.appendChild(el('div', { class: 'xs-time' }, clock, bar));
        wrap.appendChild(questionsBox(d));
        var notes = el('textarea', { placeholder: 'Poznámky k odpovědi (osnova, pojmy, příklad z praxe)…', 'aria-label': 'Poznámky' });
        notes.value = notesVal || '';
        wrap.appendChild(el('label', { class: 'xs-nl', text: 'Vaše poznámky' })); wrap.appendChild(notes);
        var pauseBtn = el('button', { class: 'btn btn-sm btn-ghost', onclick: function () {
          paused = !paused;
          if (paused) { pausedAt = Date.now(); pauseBtn.textContent = 'Pokračovat'; } else { offset += Date.now() - pausedAt; pauseBtn.textContent = 'Pozastavit'; }
        } }, 'Pozastavit');
        var next = el('button', { class: 'btn btn-primary', onclick: function () { if (which === 'prep') phase(d, 'answer', notes.value); else review(d, notes.value); } }, which === 'prep' ? 'Přejít k odpovědi' : 'Skončit a ohodnotit');
        wrap.appendChild(el('div', { class: 'ex-tools' }, next, pauseBtn));
        if (which === 'answer') wrap.appendChild(el('p', { class: 'hint-line', text: 'Odpovídejte nahlas. Když mluvíte, čas neplyne stejně jako při čtení.' }));
        timer = setInterval(function () {
          if (!wrap.isConnected) { stopTimer(); return; }
          if (paused) return;
          var left = total - (Date.now() - start - offset) / 1000;
          clock.textContent = fmt(left);
          bar.firstChild.style.setProperty('--v', Math.round(Math.max(0, Math.min(100, (1 - left / total) * 100))));
          if (left <= 0) { stopTimer(); clock.classList.add('is-end'); DPS.toast(which === 'prep' ? 'Příprava skončila' : 'Čas na odpověď vypršel'); }
        }, 500);
      }

      function review(d, notesVal) {
        stopTimer(); wrap.innerHTML = '';
        wrap.appendChild(el('div', { class: 'xs-phase', text: 'Sebehodnocení' }));
        wrap.appendChild(el('p', { class: 'hint-line', style: { marginTop: 0 }, text: 'Zaškrtněte body, které ve vaší odpovědi zazněly.' }));
        var boxes = [];
        d.forEach(function (x) {
          var blk = el('div', { class: 'xs-rev' });
          blk.appendChild(el('div', { class: 'xs-revq', html: '<span class="tag">' + esc(x.pool.name) + '</span> ' + x.item.q }));
          (x.item.points || []).forEach(function (p) {
            var id = 'xs' + Math.random().toString(36).slice(2, 8);
            var cb = el('input', { type: 'checkbox', id: id });
            cb.addEventListener('change', calc);
            boxes.push(cb);
            blk.appendChild(el('label', { class: 'xs-pt', for: id }, cb, el('span', { html: p })));
          });
          if (x.item.tip) blk.appendChild(el('p', { class: 'xs-tip', html: '<b>Tip:</b> ' + x.item.tip }));
          wrap.appendChild(blk);
        });
        if ((cfg.criteria || []).length) {
          var blk = el('div', { class: 'xs-rev' });
          blk.appendChild(el('div', { class: 'xs-revq', html: '<b>Celkový dojem</b>' }));
          cfg.criteria.forEach(function (p) {
            var id = 'xs' + Math.random().toString(36).slice(2, 8);
            var cb = el('input', { type: 'checkbox', id: id }); cb.addEventListener('change', calc); boxes.push(cb);
            blk.appendChild(el('label', { class: 'xs-pt', for: id }, cb, el('span', { html: p })));
          });
          wrap.appendChild(blk);
        }
        var out = el('div', { class: 'xs-out' });
        wrap.appendChild(out);
        var fin = el('button', { class: 'btn btn-primary', onclick: function () {
          var n = boxes.filter(function (b) { return b.checked; }).length, pct = Math.round(n / boxes.length * 100);
          st.history.push({ ts: Date.now(), pct: pct, qs: d.map(function (x) { return x.item.q; }) }); save();
          if (st.history.length >= needed && !(api.state() && api.state().done)) api.complete(st.history.length, needed);
          idle();
          wrap.insertBefore(api.fb(pct >= 70 ? 'ok' : 'warn', '<strong>Výsledek: ' + pct + ' %.</strong> ' + (pct >= 70 ? 'To je solidní základ. Zkuste další otázky.' : 'Projděte body, které chyběly, a zkuste stejnou otázku znovu. Nejdřív si vždy připravte osnovu.')), wrap.firstChild);
        } }, 'Uložit výsledek');
        wrap.appendChild(el('div', { class: 'ex-tools' }, fin));
        function calc() {
          var n = boxes.filter(function (b) { return b.checked; }).length;
          out.textContent = 'Splněno ' + n + ' z ' + boxes.length + ' bodů (' + Math.round(n / boxes.length * 100) + ' %)';
        }
        calc();
      }

      idle();
    }
  });

  /* ==========================================================================
     PORTFOLIO – souhrn uložených zápisů z jiných kapitol (export .md / .txt)
     cfg: { min?:3, file?, header?, sources:[ { chapter, id, title, kind:'reflect'|'goals'|'rubric'|'timeplanner'|'checklist',
              labels?:{promptId:'Text otázky'}, course? } ] }
     ========================================================================== */
  DPS.exercises.register('portfolio', {
    label: 'Portfolio', icon: 'download',
    render: function (api) {
      var cfg = api.cfg, course = api.ctx.course;
      var min = cfg.min != null ? cfg.min : Math.min(3, cfg.sources.length);
      function collect() {
        return cfg.sources.map(function (s) {
          var d = DPS.progress.getData(s.course || course, s.chapter, s.id, null);
          var body = '', filled = false;
          if (d) {
            if (s.kind === 'goals') {
              var g = (d.goals || []); filled = g.length > 0;
              body = g.map(function (x, i) { return (i + 1) + '. ' + x; }).join('\n');
            } else if (s.kind === 'rubric') {
              var rows = (d.rows || []).filter(function (r) { return (r.name || '').trim(); });
              filled = rows.length > 0;
              body = rows.map(function (r) { return '- **' + r.name.trim() + '**: ' + r.cells.map(function (c, i) { return (s.levels ? s.levels[i] + ' – ' : '') + c.trim(); }).join(' | '); }).join('\n');
            } else if (s.kind === 'timeplanner') {
              var keys = Object.keys(d); filled = keys.length > 0;
              body = keys.map(function (k) { return ((s.labels && s.labels[k]) || k) + ': ' + d[k]; }).join('\n');
            } else if (s.kind === 'checklist') {
              var ks = Object.keys(d).filter(function (k) { return d[k]; }); filled = ks.length > 0;
              body = ks.length + ' splněných bodů z ' + (s.total || '?');
            } else { // reflect
              var out = [];
              Object.keys(d).forEach(function (k) {
                var v = String(d[k] || '').trim(); if (!v) return;
                out.push('**' + ((s.labels && s.labels[k]) || k) + '**\n' + v);
              });
              filled = out.length > 0; body = out.join('\n\n');
            }
          }
          return { s: s, filled: filled, body: body };
        });
      }
      var wrap = el('div', { class: 'pf' });
      var info = el('div');
      function asText(items) {
        var head = '# ' + (cfg.header || 'Portfolio') + '\n\nVytvořeno: ' + new Date().toLocaleDateString('cs-CZ') + '\n';
        return head + '\n' + items.filter(function (x) { return x.filled; }).map(function (x) { return '## ' + x.s.title + '\n\n' + x.body; }).join('\n\n');
      }
      function paint() {
        wrap.innerHTML = '';
        var items = collect();
        var n = items.filter(function (x) { return x.filled; }).length;
        items.forEach(function (x) {
          var href = DPS.chapterUrl(x.s.course || course, x.s.chapter);
          wrap.appendChild(el('div', { class: 'pf-row' + (x.filled ? ' is-on' : '') },
            el('span', { class: 'pf-st', html: icon(x.filled ? 'check' : 'x', 13) }),
            el('div', { class: 'pf-t' }, el('b', { text: x.s.title }), el('small', { text: x.filled ? 'Vyplněno' : 'Zatím nevyplněno' })),
            el('a', { class: 'btn btn-sm btn-ghost', href: href }, x.filled ? 'Otevřít' : 'Vyplnit')));
        });
        var tools = el('div', { class: 'ex-tools' },
          el('button', { class: 'btn btn-primary', disabled: n === 0, html: icon('download', 15) + ' Stáhnout portfolio (.md)', onclick: function () { DPS.download((cfg.file || 'portfolio') + '.md', asText(items), 'text/markdown;charset=utf-8'); } }),
          el('button', { class: 'btn', disabled: n === 0, html: icon('copy', 15) + ' Kopírovat', onclick: function () { DPS.copy(asText(items)); } }),
          el('button', { class: 'btn btn-ghost', html: icon('refresh', 15) + ' Aktualizovat', onclick: paint }));
        wrap.appendChild(tools);
        if (n > 0) wrap.appendChild(el('details', { class: 'acc' }, el('summary', { text: 'Náhled portfolia' }), el('div', { class: 'acc-body' }, el('pre', { class: 'pf-pre', text: asText(items) }))));
        info.replaceChildren(api.fb(n >= min ? 'ok' : 'info', 'Máte vyplněno <strong>' + n + ' z ' + items.length + '</strong> částí. ' + (n >= min ? 'To stačí pro odevzdání portfolia. Doplňte, co chybí.' : 'Doplňte alespoň ' + min + ', aby bylo portfolio užitečné.')));
        if (n >= min && !(api.state() && api.state().done)) api.complete(n, items.length);
      }
      api.body.appendChild(wrap); api.body.appendChild(info);
      paint();
    }
  });
})();
