/* ==========================================================================
   Cvičení: doplňování, kartičky, scénář (větvený příběh), reflexe, hledání chyb
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS, el = DPS.el, icon = DPS.icon;

  /* ---------- DOPLŇOVÁNÍ ----------
     cfg: { text:"…[[správně]]…", bank?:[navíc odpovědi], after? }  */
  DPS.exercises.register('cloze', {
    label: 'Doplňování', icon: 'text',
    render: function (api) {
      var cfg = api.cfg;
      var answers = [];
      var html = cfg.text.replace(/\[\[(.+?)\]\]/g, function (_, a) { answers.push(a); return '\u0000' + (answers.length - 1) + '\u0000'; });
      var bank = Array.from(new Set(answers.concat(cfg.bank || []))).sort(function (a, b) { return a.localeCompare(b, 'cs'); });
      var wrap = el('div', { class: 'cz', html: html.replace(/\u0000(\d+)\u0000/g, '<span data-gap="$1"></span>') });
      var selects = [];
      DPS.$$('[data-gap]', wrap).forEach(function (sp) {
        var s = el('select', { 'aria-label': 'Doplňte správný pojem' }, el('option', { value: '' }, '— vyberte —'));
        bank.forEach(function (b) { s.appendChild(el('option', { value: b }, b)); });
        s.addEventListener('change', function () { s.classList.remove('is-ok', 'is-bad'); });
        sp.replaceWith(s); selects.push(s);
      });
      var info = el('div');
      var first = null;
      var btn = el('button', {
        class: 'btn btn-primary', onclick: function () {
          var ok = 0;
          selects.forEach(function (s, i) {
            var good = s.value === answers[i];
            s.classList.toggle('is-ok', good); s.classList.toggle('is-bad', !good);
            if (good) ok++;
          });
          if (first === null) first = ok;
          if (ok === answers.length) {
            info.replaceChildren(api.fb('ok', '<strong>Všechno sedí.</strong>' + (cfg.after ? ' ' + cfg.after : '')));
            selects.forEach(function (s) { s.disabled = true; });
            btn.hidden = true;
            api.complete(first, answers.length);
          } else {
            var empty = selects.filter(function (s) { return !s.value; }).length;
            info.replaceChildren(api.fb('bad', '<strong>' + ok + ' z ' + answers.length + ' správně.</strong> ' + (empty ? 'Některá místa jsou nevyplněná. ' : '') + 'Červeně označená místa opravte a zkontrolujte znovu.'));
          }
        }
      }, 'Zkontrolovat');
      api.body.appendChild(wrap);
      api.body.appendChild(el('div', { class: 'ex-tools' }, btn));
      api.body.appendChild(info);
    }
  });

  /* ---------- KARTIČKY ----------
     cfg: { cards:[{q, a}] } – a smí obsahovat HTML (seznamy apod.) */
  DPS.exercises.register('flashcards', {
    label: 'Kartičky', icon: 'cards',
    render: function (api) {
      var cfg = api.cfg;
      var total = cfg.cards.length;
      var known = new Set(api.data.get([]) || []);
      var queue = [];
      function rebuild() { queue = DPS.shuffle(cfg.cards.map(function (_, i) { return i; }).filter(function (i) { return !known.has(i); })); }
      rebuild();
      var idx = 0, flipped = false;
      var wrap = el('div', { class: 'fc' });
      api.body.appendChild(wrap);

      function paint() {
        wrap.innerHTML = '';
        if (!queue.length) {
          wrap.appendChild(api.fb('ok', '<strong>Všech ' + total + ' kartiček máte označeno jako „Znám“.</strong> Před zkouškou se k nim můžete vrátit tlačítkem „Začít znovu“ vpravo nahoře.'));
          api.complete(total, total);
          return;
        }
        if (idx >= queue.length) idx = 0;
        var i = queue[idx];
        var c = cfg.cards[i];
        var card = el('div', { class: 'fc-card' + (flipped ? ' is-flip' : ''), tabindex: 0, role: 'button', 'aria-label': 'Otočit kartičku' },
          el('div', { class: 'fc-face fc-front' }, el('div', { class: 'lab', text: 'Otázka' }), el('div', { class: 'txt', html: c.q })),
          el('div', { class: 'fc-face fc-back' }, el('div', { class: 'lab', text: 'K zamyšlení / odpověď' }), el('div', { class: 'txt', html: c.a })));
        function flip() { flipped = !flipped; card.classList.toggle('is-flip', flipped); actions.hidden = !flipped; hint.hidden = flipped; }
        card.addEventListener('click', flip);
        card.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } });
        var hint = el('div', { class: 'fc-hint', text: 'Nejdřív si odpověď zkuste říct nahlas, pak kartičku otočte.', hidden: flipped });
        var actions = el('div', { class: 'fc-actions', hidden: !flipped },
          el('button', { class: 'btn', onclick: function () { flipped = false; idx++; paint(); } }, 'Ještě ne'),
          el('button', { class: 'btn btn-ok', onclick: function () { known.add(i); api.data.set(Array.from(known)); flipped = false; rebuild(); idx = 0; paint(); } }, 'Znám'));
        wrap.appendChild(el('div', { class: 'fc-bar' }, el('span', { text: 'Znám ' + known.size + ' z ' + total }), el('div', { class: 'bar', style: { width: '40%' } }, el('i', { style: { '--v': Math.round(known.size / total * 100) } }))));
        wrap.appendChild(el('div', { class: 'fc-stage' }, card));
        wrap.appendChild(hint);
        wrap.appendChild(actions);
      }
      paint();
    }
  });

  /* ---------- SCÉNÁŘ ----------
     cfg: { start:'n1', nodes:{ id:{ who?, text, choices:[{t, to, fb?, pts?}] } | { end:true, title, text, lesson? } }, maxPts? } */
  DPS.exercises.register('scenario', {
    label: 'Modelová situace', icon: 'branch',
    render: function (api) {
      var cfg = api.cfg;
      var nodes = cfg.nodes;
      // maximum bodů = nejlepší cesta
      var memo = {};
      function best(id) {
        if (memo[id] !== undefined) return memo[id];
        var n = nodes[id]; if (!n || n.end || !n.choices) return (memo[id] = 0);
        memo[id] = 0;
        var m = 0;
        n.choices.forEach(function (c) { m = Math.max(m, (c.pts || 0) + best(c.to)); });
        return (memo[id] = m);
      }
      var max = cfg.maxPts != null ? cfg.maxPts : best(cfg.start);
      var pts = 0, log = [], cur = cfg.start;
      var wrap = el('div');
      api.body.appendChild(wrap);

      function paint(feedback) {
        wrap.innerHTML = '';
        var n = nodes[cur];
        if (log.length) {
          wrap.appendChild(el('div', { class: 'sc-log' }, log.map(function (l) { return el('div', { html: '<b>Vaše volba:</b> ' + l.c + (l.fb ? '<br>' + l.fb : '') }); })));
        }
        var node = el('div', { class: 'sc-node' });
        node.appendChild(el('div', { class: 'sc-text', html: (n.who ? '<span class="who">' + n.who + '</span>' : '') + n.text }));
        if (n.end) {
          var sc = el('div', { class: 'sc-end' });
          var ratio = max ? pts / max : 1;
          sc.appendChild(el('h4', { text: n.title || 'Konec situace' }));
          sc.appendChild(api.fb(ratio >= 0.75 ? 'ok' : (ratio >= 0.4 ? 'warn' : 'bad'), '<strong>Získali jste ' + pts + ' z ' + max + ' bodů.</strong> ' + (n.lesson || '')));
          sc.appendChild(el('div', { class: 'ex-tools' }, el('button', { class: 'btn', onclick: function () { pts = 0; log = []; cur = cfg.start; paint(); } }, 'Zkusit jinou cestu')));
          node.appendChild(sc);
          wrap.appendChild(node);
          api.complete(pts, max);
          return;
        }
        var opts = el('div', { class: 'opts' });
        (cfg.shuffleChoices === false ? n.choices : DPS.shuffle(n.choices)).forEach(function (c) {
          var b = el('button', { class: 'opt', type: 'button', html: '<span class="opt-mark"></span><span>' + c.t + '</span>' });
          b.addEventListener('click', function () {
            pts += c.pts || 0;
            log.push({ c: c.t, fb: c.fb });
            cur = c.to;
            paint();
            wrap.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          });
          opts.appendChild(b);
        });
        node.appendChild(opts);
        wrap.appendChild(node);
      }
      paint();
    }
  });

  /* ---------- REFLEXE (uložené poznámky) ----------
     cfg: { prompts:[{id, q, ph?}], min?:30, file?:'nazev' } */
  DPS.exercises.register('reflect', {
    label: 'Vlastní zápis', icon: 'pencil',
    render: function (api) {
      var cfg = api.cfg;
      var min = cfg.min != null ? cfg.min : 30;
      var saved = api.data.get({}) || {};
      var wrap = el('div', { class: 'rf' });
      var fields = [];
      var info = el('div');

      function evaluate() {
        var okAll = fields.every(function (f) { return f.ta.value.trim().length >= min; });
        fields.forEach(function (f) {
          var len = f.ta.value.trim().length;
          f.cnt.innerHTML = '<span>' + len + ' znaků</span><span class="' + (len >= min ? 'ok' : '') + '">' + (len >= min ? 'dostatečné' : 'min. ' + min) + '</span>';
        });
        if (okAll) {
          if (!(api.state() && api.state().done)) { api.complete(1, 1); }
          info.replaceChildren(api.fb('ok', 'Zápis je uložený ve vašem prohlížeči. Můžete si ho stáhnout nebo zkopírovat a vložit do své přípravy.'));
        } else info.replaceChildren();
      }
      var saveSoon = DPS.debounce(function () {
        var d = {}; fields.forEach(function (f) { d[f.id] = f.ta.value; });
        api.data.set(d); evaluate();
      }, 350);

      cfg.prompts.forEach(function (p) {
        var ta = el('textarea', { placeholder: p.ph || 'Napište vlastními slovy…', 'aria-label': p.q });
        ta.value = saved[p.id] || '';
        ta.addEventListener('input', saveSoon);
        var cnt = el('div', { class: 'cnt' });
        fields.push({ id: p.id, ta: ta, cnt: cnt, q: p.q });
        wrap.appendChild(el('div', null, el('label', { html: p.q }), ta, cnt));
      });
      function asText() {
        return (cfg.header ? cfg.header + '\n\n' : '') + fields.map(function (f) { return f.q.replace(/<[^>]+>/g, '') + '\n' + f.ta.value.trim(); }).join('\n\n');
      }
      api.body.appendChild(wrap);
      api.body.appendChild(el('div', { class: 'ex-tools' },
        el('button', { class: 'btn btn-sm', html: icon('copy', 15) + ' Kopírovat', onclick: function () { DPS.copy(asText()); } }),
        el('button', { class: 'btn btn-sm', html: icon('download', 15) + ' Stáhnout .txt', onclick: function () { DPS.download((cfg.file || 'zapis') + '.txt', asText()); } })));
      api.body.appendChild(info);
      evaluate();
    }
  });

  /* ---------- HLEDÁNÍ CHYB V TEXTU ----------
     cfg: { parts:[ "prostý text" | {t, bad:true|false, why} ], needed? } – pole s {t,..} jsou klikací. */
  DPS.exercises.register('spot', {
    label: 'Najděte problém', icon: 'eye',
    render: function (api) {
      var cfg = api.cfg;
      var sp = el('div', { class: 'sp' });
      var segs = [];
      cfg.parts.forEach(function (p) {
        if (typeof p === 'string') { sp.insertAdjacentHTML('beforeend', p); return; }
        var b = el('button', { class: 'sp-seg', type: 'button', html: p.t });
        b._p = p;
        b.addEventListener('click', function () { if (b.disabled) return; b.classList.toggle('is-sel'); });
        segs.push(b); sp.appendChild(b);
      });
      var info = el('div');
      var nBad = segs.filter(function (s) { return s._p.bad; }).length;
      var btn = el('button', {
        class: 'btn btn-primary', onclick: function () {
          var hit = 0, wrong = 0, missed = 0, notes = [];
          segs.forEach(function (s) {
            var sel = s.classList.contains('is-sel'); var bad = !!s._p.bad;
            s.classList.remove('is-sel', 'is-ok', 'is-bad', 'is-miss'); s.disabled = true;
            if (sel && bad) { hit++; s.classList.add('is-ok'); }
            else if (sel && !bad) { wrong++; s.classList.add('is-bad'); }
            else if (!sel && bad) { missed++; s.classList.add('is-miss'); }
            if ((bad || sel) && s._p.why) notes.push('<div><b>„' + s._p.t.replace(/<[^>]+>/g, '') + '“</b> – ' + (bad ? '' : '<i>(v pořádku)</i> ') + s._p.why + '</div>');
          });
          var score = Math.max(0, hit - wrong);
          var good = hit === nBad && wrong === 0;
          var msg = '<strong>Našli jste ' + hit + ' z ' + nBad + ' problémů' + (wrong ? ', ' + wrong + '× jste označili něco, co problém nebylo' : '') + '.</strong>';
          info.replaceChildren(api.fb(good ? 'ok' : (score / nBad >= 0.6 ? 'warn' : 'bad'), msg + '<div class="sp-list">' + notes.join('') + '</div>'));
          btn.hidden = true;
          if (score / nBad >= 0.6) api.complete(score, nBad);
          else info.appendChild(el('div', { class: 'ex-tools' }, el('button', { class: 'btn', onclick: function () { api.reset(); } }, 'Zkusit znovu')));
        }
      }, 'Zkontrolovat');
      api.body.appendChild(sp);
      api.body.appendChild(el('div', { class: 'ex-tools' }, btn));
      api.body.appendChild(info);
      api.body.appendChild(el('p', { class: 'hint-line', text: 'Klepnutím označte části textu, které považujete za problematické. Neoznačujte všechno – špatné označení se odečítá.' }));
    }
  });
})();
