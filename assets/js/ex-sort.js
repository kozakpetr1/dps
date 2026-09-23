/* ==========================================================================
   Cvičení: párování, třídění do skupin, řazení
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS, el = DPS.el, icon = DPS.icon;

  /* ---------- PÁROVÁNÍ ----------
     cfg: { pairs:[{l, r}], extra?:[řetězce navíc vpravo], leftTitle?, rightTitle? } */
  DPS.exercises.register('match', {
    label: 'Přiřazování', icon: 'link',
    render: function (api) {
      var cfg = api.cfg;
      var pairs = cfg.pairs;
      var n = pairs.length;
      var left = DPS.shuffle(pairs.map(function (p, i) { return { t: p.l, k: i }; }));
      var right = DPS.shuffle(pairs.map(function (p, i) { return { t: p.r, k: i }; }).concat((cfg.extra || []).map(function (t) { return { t: t, k: -1 }; })));
      var selL = null, selR = null, matched = 0, mistakes = 0;
      var done = {};
      var hues = [210, 150, 40, 330, 265, 20, 180, 100, 300, 60, 0, 240];

      var grid = el('div', { class: 'mt' });
      var colL = el('div', { class: 'mt-col' }, el('h4', { text: cfg.leftTitle || 'Pojem / situace' }));
      var colR = el('div', { class: 'mt-col' }, el('h4', { text: cfg.rightTitle || 'Odpovídá' }));
      grid.appendChild(colL); grid.appendChild(colR);
      var info = el('div');

      function mk(item, side) {
        var b = el('button', { class: 'mt-item', type: 'button', html: item.t });
        b._k = item.k; b._side = side;
        b.addEventListener('click', function () { pick(b, side); });
        return b;
      }
      var lb = left.map(function (i) { return mk(i, 'L'); });
      var rb = right.map(function (i) { return mk(i, 'R'); });
      lb.forEach(function (b) { colL.appendChild(b); });
      rb.forEach(function (b) { colR.appendChild(b); });

      function pick(b, side) {
        if (b.classList.contains('is-done')) return;
        if (side === 'L') { if (selL) selL.classList.remove('is-sel'); selL = b === selL ? null : b; if (selL) selL.classList.add('is-sel'); }
        else { if (selR) selR.classList.remove('is-sel'); selR = b === selR ? null : b; if (selR) selR.classList.add('is-sel'); }
        if (selL && selR) evaluate();
      }
      function evaluate() {
        var a = selL, b = selR;
        selL = selR = null;
        a.classList.remove('is-sel'); b.classList.remove('is-sel');
        if (a._k === b._k && a._k >= 0) {
          matched++;
          var idx = matched;
          var hue = hues[(matched - 1) % hues.length];
          [a, b].forEach(function (x) {
            x.classList.add('is-done'); x.dataset.n = idx; x.style.setProperty('--pc', 'hsl(' + hue + ' 75% 62%)'); x.disabled = false;
          });
          if (matched === n) finish();
        } else {
          mistakes++;
          [a, b].forEach(function (x) { x.classList.add('is-err'); setTimeout(function () { x.classList.remove('is-err'); }, 500); });
          info.replaceChildren(api.fb('warn', 'Tohle k sobě nepatří. Zkuste to jinak. <span style="color:var(--tx-3)">(chyb: ' + mistakes + ')</span>'));
        }
      }
      function finish() {
        var score = Math.max(0, n - mistakes);
        info.replaceChildren(api.fb('ok', '<strong>Hotovo.</strong> ' + (mistakes ? 'Počet chybných pokusů: ' + mistakes + '.' : 'Všechno napoprvé.') + (cfg.after ? ' ' + cfg.after : '')));
        api.complete(score, n);
      }
      api.body.appendChild(grid);
      api.body.appendChild(info);
      api.body.appendChild(el('p', { class: 'hint-line', text: 'Klepněte na položku vlevo a pak na odpovídající položku vpravo (nebo naopak).' }));
    }
  });

  /* ---------- TŘÍDĚNÍ ----------
     cfg: { bins:[{id,name,hint?}], cards:[{t, bin, why?}], instant?:bool } */
  DPS.exercises.register('classify', {
    label: 'Třídění', icon: 'layers',
    render: function (api) {
      var cfg = api.cfg;
      var cards = DPS.shuffle(cfg.cards.map(function (c, i) { return Object.assign({ i: i }, c); }));
      var place = {}; // i -> binId | null
      var locked = {};
      var sel = null;
      var mistakes = 0, firstCheckScore = null, checked = false;
      var info = el('div');
      var pool = el('div', { class: 'cl-pool' });
      var binsEl = el('div', { class: 'cl-bins' });
      var actions = el('div', { class: 'ex-tools' });
      var byI = {}; cards.forEach(function (c) { byI[c.i] = c; place[c.i] = null; });

      function tile(c) {
        var b = el('button', { class: 'tile', type: 'button', draggable: !locked[c.i], html: c.t });
        if (sel === c.i) b.classList.add('is-sel');
        if (locked[c.i]) b.classList.add('is-ok');
        if (c._state) b.classList.add(c._state);
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          // je-li vybraná jiná karta, klepnutí na kartu ve skupině znamená „vlož do této skupiny“
          if (sel !== null && sel !== c.i && place[c.i] !== null) { assign(sel, place[c.i]); return; }
          if (locked[c.i]) return;
          if (place[c.i] !== null) { place[c.i] = null; c._state = null; paint(); return; }
          sel = sel === c.i ? null : c.i; paint();
        });
        b.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', String(c.i)); e.dataTransfer.effectAllowed = 'move'; setTimeout(function () { b.classList.add('is-drag'); }, 0); });
        b.addEventListener('dragend', function () { b.classList.remove('is-drag'); });
        return b;
      }

      function assign(i, binId) {
        if (locked[i]) return;
        var c = byI[i];
        place[i] = binId; c._state = null; sel = null;
        if (cfg.instant) {
          if (c.bin === binId) { locked[i] = true; info.replaceChildren(api.fb('ok', '<strong>Správně.</strong> ' + (c.why || ''))); }
          else {
            mistakes++;
            place[i] = null; c._state = 'is-bad';
            var right = cfg.bins.find(function (b) { return b.id === c.bin; });
            info.replaceChildren(api.fb('bad', '<strong>Tohle ne.</strong> ' + (c.why ? c.why : 'Patří do skupiny „' + DPS.esc(right ? right.name : '') + '“.')));
            setTimeout(function () { c._state = null; paint(); }, 600);
          }
          paint();
          if (allPlaced() && cards.every(function (x) { return locked[x.i]; })) finish();
        } else { paint(); }
      }
      function allPlaced() { return cards.every(function (c) { return place[c.i] !== null; }); }

      function wireDrop(target, binId) {
        target.addEventListener('dragover', function (e) { e.preventDefault(); target.classList.add('is-hot'); });
        target.addEventListener('dragleave', function () { target.classList.remove('is-hot'); });
        target.addEventListener('drop', function (e) {
          e.preventDefault(); target.classList.remove('is-hot');
          var i = parseInt(e.dataTransfer.getData('text/plain'), 10);
          if (!isNaN(i)) { if (binId === null) { if (!locked[i]) { place[i] = null; byI[i]._state = null; paint(); } } else assign(i, binId); }
        });
      }
      wireDrop(pool, null);

      function paint() {
        pool.replaceChildren();
        cards.forEach(function (c) { if (place[c.i] === null) pool.appendChild(tile(c)); });
        binsEl.replaceChildren();
        cfg.bins.forEach(function (bin) {
          var drop = el('div', { class: 'cl-drop' });
          cards.forEach(function (c) { if (place[c.i] === bin.id) drop.appendChild(tile(c)); });
          var box = el('div', { class: 'cl-bin', role: 'button', tabindex: 0 },
            el('h4', { html: DPS.esc(bin.name) + (bin.hint ? ' <small>' + DPS.esc(bin.hint) + '</small>' : '') }), drop);
          box.addEventListener('click', function () { if (sel !== null) assign(sel, bin.id); });
          box.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && sel !== null) { e.preventDefault(); assign(sel, bin.id); } });
          wireDrop(box, bin.id);
          binsEl.appendChild(box);
        });
        actions.replaceChildren();
        if (!cfg.instant) {
          actions.appendChild(el('button', { class: 'btn btn-primary', disabled: !allPlaced(), onclick: check }, 'Zkontrolovat'));
        }
        actions.appendChild(el('button', { class: 'btn btn-ghost', onclick: function () { if (!api.state()) { api.reset(); } else api.reset(); } }, 'Začít znovu'));
      }

      function check() {
        var ok = 0;
        var wrongList = [];
        cards.forEach(function (c) {
          if (place[c.i] === c.bin) { ok++; locked[c.i] = true; c._state = 'is-ok'; }
          else { c._state = 'is-bad'; wrongList.push(c); }
        });
        if (firstCheckScore === null) firstCheckScore = ok;
        checked = true;
        paint();
        if (!wrongList.length) { finish(); return; }
        var html = '<strong>' + ok + ' z ' + cards.length + ' správně.</strong> U špatně zařazených položek přečtěte vysvětlení a opravte je (vrátí se do zásobníku).';
        html += '<ul style="margin:8px 0 0">' + wrongList.map(function (c) {
          var right = cfg.bins.find(function (b) { return b.id === c.bin; });
          return '<li><b>' + c.t + '</b> → ' + DPS.esc(right ? right.name : '') + (c.why ? ' – ' + c.why : '') + '</li>';
        }).join('') + '</ul>';
        info.replaceChildren(api.fb('bad', html));
        wrongList.forEach(function (c) { place[c.i] = null; });
        setTimeout(function () { paint(); }, 50);
      }
      function finish() {
        var max = cards.length;
        var score = cfg.instant ? Math.max(0, max - mistakes) : (firstCheckScore == null ? max : firstCheckScore);
        info.replaceChildren(api.fb('ok', '<strong>Vše je zařazeno správně.</strong>' + (cfg.after ? ' ' + cfg.after : '')));
        api.complete(score, max);
      }

      api.body.appendChild(pool);
      api.body.appendChild(binsEl);
      api.body.appendChild(actions);
      api.body.appendChild(info);
      api.body.appendChild(el('p', { class: 'hint-line', text: 'Klepněte na kartu a poté na skupinu, do které patří (na počítači lze kartu i přetáhnout). Zařazenou kartu vrátíte klepnutím.' }));
      paint();
    }
  });

  /* ---------- ŘAZENÍ ----------
     cfg: { items:[řetězec | {t, why?}] ve správném pořadí } */
  DPS.exercises.register('order', {
    label: 'Řazení', icon: 'order',
    render: function (api) {
      var cfg = api.cfg;
      var items = cfg.items.map(function (x, i) { return typeof x === 'string' ? { t: x, k: i } : Object.assign({ k: i }, x); });
      var seq = DPS.shuffle(items.slice());
      // vyhnout se náhodně už seřazenému stavu
      if (seq.every(function (x, i) { return x.k === i; })) seq.reverse();
      var attempts = 0, firstScore = null, solved = false, dragIdx = null;
      var list = el('ol', { class: 'od' });
      var info = el('div');
      var actions = el('div', { class: 'ex-tools' });

      function paint(states) {
        list.replaceChildren();
        seq.forEach(function (it, i) {
          var li = el('li', { class: 'od-item' + (states ? (states[i] ? ' is-ok' : ' is-bad') : ''), draggable: !solved });
          var t = el('div', { class: 't', html: it.t + (it.sub ? '<small>' + it.sub + '</small>' : '') });
          var up = el('button', { class: 'icon-btn', 'aria-label': 'Posunout výš', disabled: solved || i === 0, html: icon('chevron-left', 16), onclick: function () { move(i, i - 1); } });
          var dn = el('button', { class: 'icon-btn', 'aria-label': 'Posunout níž', disabled: solved || i === seq.length - 1, html: icon('chevron-right', 16), onclick: function () { move(i, i + 1); } });
          up.firstChild.style.transform = 'rotate(90deg)'; dn.firstChild.style.transform = 'rotate(90deg)';
          li.appendChild(t); li.appendChild(el('div', { class: 'od-btns' }, up, dn));
          li.addEventListener('dragstart', function (e) { dragIdx = i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); setTimeout(function () { li.classList.add('is-drag'); }, 0); });
          li.addEventListener('dragend', function () { li.classList.remove('is-drag'); dragIdx = null; });
          li.addEventListener('dragover', function (e) { e.preventDefault(); li.classList.add('is-over'); });
          li.addEventListener('dragleave', function () { li.classList.remove('is-over'); });
          li.addEventListener('drop', function (e) { e.preventDefault(); li.classList.remove('is-over'); if (dragIdx !== null && dragIdx !== i) move(dragIdx, i); });
          list.appendChild(li);
        });
      }
      function move(from, to) {
        if (to < 0 || to >= seq.length) return;
        var x = seq.splice(from, 1)[0]; seq.splice(to, 0, x);
        info.replaceChildren();
        paint();
      }
      function check() {
        attempts++;
        var states = seq.map(function (it, i) { return it.k === i; });
        var ok = states.filter(Boolean).length;
        if (firstScore === null) firstScore = ok;
        paint(states);
        if (ok === seq.length) {
          solved = true; paint(states);
          var why = items.filter(function (i) { return i.why; });
          var html = '<strong>Pořadí je správné.</strong>' + (cfg.after ? ' ' + cfg.after : '');
          if (why.length) html += '<ul style="margin:8px 0 0">' + items.map(function (i, n) { return '<li><b>' + (n + 1) + '. ' + i.t + '</b>' + (i.why ? ' – ' + i.why : '') + '</li>'; }).join('') + '</ul>';
          info.replaceChildren(api.fb('ok', html));
          actions.replaceChildren();
          api.complete(firstScore, seq.length);
        } else {
          info.replaceChildren(api.fb('bad', '<strong>' + ok + ' z ' + seq.length + ' na správném místě.</strong> Červeně jsou označené položky, které jsou jinde, než by měly být.' + (attempts >= 2 ? ' Nápověda: zamyslete se nad tím, co musí předcházet čemu.' : '')));
        }
      }
      actions.appendChild(el('button', { class: 'btn btn-primary', onclick: check }, 'Zkontrolovat pořadí'));
      api.body.appendChild(list);
      api.body.appendChild(actions);
      api.body.appendChild(info);
      api.body.appendChild(el('p', { class: 'hint-line', text: 'Položky přetahujte, nebo použijte šipky vpravo.' }));
      paint();
    }
  });
})();
