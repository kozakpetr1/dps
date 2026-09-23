/* ==========================================================================
   Cvičení: kvíz (jedna / více správných odpovědí, pravda–nepravda)
   cfg: { items:[ { q, small?, opts:[{t, ok?, why?, last?}], multi?, why? }
                  | { q, tf:true, ok:true|false, why } ],
          shuffle?:true, pass?:0.6 }
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS, el = DPS.el, icon = DPS.icon;

  function prepare(item, shuffleOpts) {
    var it = Object.assign({}, item);
    if (it.pick) { // zkratka: pick:[texty], answer:index|[indexy]
      var ans = [].concat(it.answer);
      it.opts = it.pick.map(function (t, i) { return { t: t, ok: ans.indexOf(i) !== -1 }; });
      it.fixed = it.fixed !== false;
    }
    if (it.tf) {
      it.opts = [{ t: 'Pravda', ok: it.ok === true }, { t: 'Nepravda', ok: it.ok === false }];
      it.fixed = true;
    }
    var opts = it.opts.map(function (o, i) { return Object.assign({ _i: i }, o); });
    if (shuffleOpts && !it.fixed) {
      var pinned = opts.filter(function (o) { return o.last; });
      var free = opts.filter(function (o) { return !o.last; });
      opts = DPS.shuffle(free).concat(pinned);
    }
    it.opts = opts;
    it.multi = it.multi || opts.filter(function (o) { return o.ok; }).length > 1;
    return it;
  }

  DPS.exercises.register('quiz', {
    label: 'Kvíz', icon: 'help',
    render: function (api) {
      var cfg = api.cfg;
      var body = api.body;
      if (cfg.generate === 'bloom') {
        var bl = DPS.data.bloom.levels;
        var names = bl.map(function (l) { return l.name; });
        cfg = Object.assign({}, cfg, {
          shuffleItems: true,
          items: bl.map(function (lv, i) {
            return { q: '„' + DPS.byProfile(lv.ex2, ['_', 'ov']) + '“', small: 'Na jaké úrovni Bloomovy taxonomie je tento cíl?', pick: names, answer: i, why: '<b>' + lv.name + '</b>: ' + lv.def };
          })
        });
      }
      var pass = cfg.pass != null ? cfg.pass : 0.6;
      var shuffleOpts = cfg.shuffle !== false;
      var order = cfg.shuffleItems ? DPS.shuffle(cfg.items) : cfg.items.slice();
      var items = order.map(function (i) { return prepare(i, shuffleOpts); });
      var res = []; // 1 správně, 0 špatně
      var cur = 0;
      var wrap = el('div');
      body.appendChild(wrap);

      function dots() {
        var d = el('div', { class: 'qz-dots' });
        items.forEach(function (_, i) {
          var c = i === cur ? 'cur' : (res[i] === 1 ? 'ok' : (res[i] === 0 ? 'bad' : ''));
          d.appendChild(el('i', { class: c }));
        });
        return d;
      }

      function showQ() {
        wrap.innerHTML = '';
        var it = items[cur];
        wrap.appendChild(el('div', { class: 'qz-top' }, dots(), el('span', { class: 'qz-count', text: (cur + 1) + ' / ' + items.length })));
        wrap.appendChild(el('p', { class: 'qz-q', html: it.q + (it.multi ? '<small>Vyberte všechny správné odpovědi.</small>' : (it.small ? '<small>' + it.small + '</small>' : '')) }));

        var list = el('div', { class: 'opts' });
        var btns = it.opts.map(function (o) {
          var b = el('button', { class: 'opt' + (it.multi ? ' multi' : ''), type: 'button', html: '<span class="opt-mark">' + icon('check', 14) + '</span><span class="opt-t">' + o.t + '</span>' });
          list.appendChild(b);
          return b;
        });
        wrap.appendChild(list);
        var fbBox = el('div');
        wrap.appendChild(fbBox);
        var nav = el('div', { class: 'qz-nav' });
        wrap.appendChild(nav);
        var locked = false;

        function reveal(selectedSet) {
          locked = true;
          var allOk = true;
          it.opts.forEach(function (o, i) {
            var b = btns[i]; b.disabled = true;
            var sel = selectedSet.has(i);
            b.classList.remove('is-sel');
            if (o.ok && sel) b.classList.add('is-ok');
            else if (!o.ok && sel) { b.classList.add('is-bad'); allOk = false; }
            else if (o.ok && !sel) { b.classList.add('is-miss'); allOk = false; }
            else b.classList.add('is-dim');
            var m = b.querySelector('.opt-mark');
            if (o.ok && sel) m.innerHTML = icon('check', 14);
            else if (!o.ok && sel) m.innerHTML = icon('x', 14);
            if (o.why && (sel || o.ok)) b.querySelector('.opt-t').insertAdjacentHTML('beforeend', '<span class="why">' + o.why + '</span>');
          });
          res[cur] = allOk ? 1 : 0;
          var msg = (allOk ? '<strong>Správně.</strong> ' : '<strong>Ne tak docela.</strong> ') + (it.why || '');
          fbBox.replaceChildren(api.fb(allOk ? 'ok' : 'bad', msg));
          nav.innerHTML = '';
          var last = cur === items.length - 1;
          nav.appendChild(el('button', { class: 'btn btn-primary', onclick: function () { if (last) finish(); else { cur++; showQ(); } } }, last ? 'Zobrazit výsledek' : 'Další otázka'));
          wrap.querySelector('.qz-dots').replaceWith(dots());
        }

        var chosen = new Set();
        btns.forEach(function (b, i) {
          b.addEventListener('click', function () {
            if (locked) return;
            if (it.multi) {
              if (chosen.has(i)) chosen.delete(i); else chosen.add(i);
              b.classList.toggle('is-sel', chosen.has(i));
              check.disabled = chosen.size === 0;
            } else {
              chosen = new Set([i]);
              reveal(chosen);
            }
          });
        });
        var check = null;
        if (it.multi) {
          check = el('button', { class: 'btn btn-primary', disabled: true, onclick: function () { reveal(chosen); } }, 'Zkontrolovat');
          nav.appendChild(check);
        }
      }

      function finish() {
        var score = res.reduce(function (a, b) { return a + b; }, 0);
        var max = items.length;
        var ratio = score / max;
        var ok = ratio >= pass;
        wrap.innerHTML = '';
        var r = el('div', { class: 'result' });
        r.appendChild(el('div', { class: 'big', html: score + '<small> / ' + max + '</small>' }));
        var msg = ratio === 1 ? 'Bez chyby – skvělé.' : (ok ? 'Solidní výsledek.' : 'Zatím to není ono. Projděte si vysvětlení a zkuste to znovu (potřebujete alespoň ' + Math.ceil(pass * max) + ' správně).');
        r.appendChild(el('p', { text: msg }));
        var wrong = items.filter(function (_, i) { return res[i] === 0; });
        if (wrong.length) {
          var rv = el('div', { class: 'review' });
          wrong.forEach(function (it) {
            var corr = it.opts.filter(function (o) { return o.ok; }).map(function (o) { return o.t; }).join('; ');
            rv.appendChild(el('div', { html: '<b>' + it.q + '</b><br>Správně: ' + corr + (it.why ? '<br><span style="color:var(--tx-3)">' + it.why + '</span>' : '') }));
          });
          r.appendChild(rv);
        }
        r.appendChild(el('button', {
          class: 'btn', onclick: function () {
            // nové zamíchání
            items = (cfg.shuffleItems ? DPS.shuffle(cfg.items) : cfg.items.slice()).map(function (i) { return prepare(i, shuffleOpts); });
            res = []; cur = 0; showQ();
          }
        }, 'Zkusit znovu'));
        wrap.appendChild(r);
        if (ok) api.complete(score, max);
      }

      showQ();
    }
  });
})();
