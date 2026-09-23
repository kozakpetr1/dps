/* ==========================================================================
   Engine cvičení
   --------------------------------------------------------------------------
   V HTML kapitoly:
     <div class="ex" data-type="quiz" data-id="cile-kviz">
       <script type="application/json"> { "title": "...", "intro": "<p>…</p>", ... } </script>
     </div>
   Každý typ cvičení se registruje přes DPS.exercises.register(type, def):
     def = { label, icon, render(api) }
   api = { cfg, body, ctx, id, complete(score, max), reset(), data, fb(kind, html) }
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS;
  var el = DPS.el, icon = DPS.icon;
  var registry = {};

  function fb(kind, htmlStr) {
    var ico = { ok: 'check', bad: 'x', warn: 'alert', info: 'info' }[kind] || 'info';
    var box = el('div', { class: 'fb ' + (kind || 'info'), role: 'status' });
    box.innerHTML = icon(ico, 18) + '<div>' + htmlStr + '</div>';
    return box;
  }

  function mountOne(host, ctx, n) {
    var type = host.dataset.type;
    var def = registry[type];
    var scriptEl = host.querySelector('script[type="application/json"]');
    var cfg = {};
    if (scriptEl) {
      try { cfg = JSON.parse(scriptEl.textContent); }
      catch (e) { console.error('Neplatný JSON cvičení', host.dataset.id, e); host.replaceChildren(fb('bad', 'Chyba v definici cvičení „' + DPS.esc(host.dataset.id || type) + '“: ' + DPS.esc(e.message))); return null; }
      scriptEl.remove();
    }
    if (!def) { host.replaceChildren(fb('bad', 'Neznámý typ cvičení: ' + DPS.esc(type))); return null; }

    // varianty podle zaměření
    if (cfg.byProfile) {
      var part = DPS.byProfile(cfg.byProfile, ['_', 'ov']);
      if (part) cfg = Object.assign({}, cfg, part);
    }

    var id = host.dataset.id || ('ex' + n);
    host.classList.add('ex', 'ex--' + type);
    host.dataset.exId = id;
    host.innerHTML = '';

    var status = el('span', { class: 'ex-status badge', text: 'Nesplněno' });
    var resetBtn = el('button', { class: 'icon-btn', title: 'Začít znovu', 'aria-label': 'Začít cvičení znovu', hidden: true, html: icon('refresh', 18) });
    var head = el('div', { class: 'ex-head' },
      el('div', { class: 'ex-ico', html: icon(def.icon || 'puzzle', 20) }),
      el('div', null,
        el('div', { class: 'ex-kicker', text: 'Cvičení ' + n + ' · ' + def.label }),
        el('div', { class: 'ex-title', html: cfg.title || def.label })),
      status, resetBtn);
    var body = el('div', { class: 'ex-body' });
    host.appendChild(head);
    host.appendChild(body);

    function paintStatus() {
      var st = DPS.progress.ex(ctx.course, ctx.chapter, id);
      var done = !!(st && st.done);
      host.classList.toggle('is-done', done);
      status.className = 'ex-status badge' + (done ? ' ok' : '');
      status.innerHTML = done ? (icon('check', 13) + ' Splněno' + (st.max > 1 && st.score != null ? ' · ' + st.score + '/' + st.max : '')) : 'Nesplněno';
      resetBtn.hidden = !done;
      if (cfg.noScore) { status.hidden = true; }
    }

    var api = {
      cfg: cfg, body: body, ctx: ctx, id: id, host: host,
      fb: fb,
      state: function () { return DPS.progress.ex(ctx.course, ctx.chapter, id); },
      complete: function (score, max) {
        var prev = DPS.progress.ex(ctx.course, ctx.chapter, id);
        var best = Math.max(score == null ? 0 : score, prev && prev.best != null ? prev.best : 0);
        DPS.progress.setEx(ctx.course, ctx.chapter, id, { done: true, score: score, max: max, best: best });
        paintStatus();
      },
      uncomplete: function () {
        DPS.progress.resetEx(ctx.course, ctx.chapter, id);
        paintStatus();
      },
      data: {
        get: function (def2) { return DPS.progress.getData(ctx.course, ctx.chapter, id, def2); },
        set: function (v) { DPS.progress.setData(ctx.course, ctx.chapter, id, v); }
      },
      reset: function () { api.uncomplete(); paint(); },
      repaintStatus: paintStatus
    };

    function paint() {
      body.innerHTML = '';
      if (cfg.intro) body.appendChild(el('div', { class: 'ex-intro', html: cfg.intro }));
      try { def.render(api); }
      catch (e) { console.error(e); body.appendChild(fb('bad', 'Cvičení se nepodařilo zobrazit: ' + DPS.esc(e.message))); }
      paintStatus();
    }
    resetBtn.addEventListener('click', function () {
      DPS.confirm('Začít cvičení znovu?', 'Výsledek tohoto cvičení se vynuluje.', 'Začít znovu').then(function (ok) { if (ok) { api.data.set(undefined); api.reset(); } });
    });
    paint();
    return api;
  }

  DPS.exercises = {
    register: function (type, def) { registry[type] = def; },
    types: function () { return Object.keys(registry); },
    fb: fb,
    mountAll: function (root, ctx) {
      var hosts = DPS.$$('.ex[data-type]', root).filter(function (h) { return !h.closest('[hidden]'); });
      var n = 0;
      hosts.forEach(function (h) {
        var api = mountOne(h, ctx, n + 1);
        if (api) n++;
      });
      // údaje o počtu cvičení uložíme pro dashboard (bez skrytých a bez noScore)
      var counted = DPS.$$('.ex', root).filter(function (h) { return !h.closest('[hidden]') && !h.querySelector('.ex-status[hidden]'); }).length;
      return counted;
    }
  };
})();
