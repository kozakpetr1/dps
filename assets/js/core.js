/* ==========================================================================
   DPS core – pomocné funkce, úložiště postupu, profily, motiv
   ========================================================================== */
(function () {
  'use strict';
  var DPS = window.DPS = window.DPS || {};
  DPS.data = DPS.data || {};
  DPS.courses = DPS.courses || [];

  /* ---------- DOM utility ---------- */
  DPS.$ = function (sel, root) { return (root || document).querySelector(sel); };
  DPS.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  DPS.el = function el(tag, props) {
    var n = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'html') n.innerHTML = v;
        else if (k === 'text') n.textContent = v;
        else if (k === 'style' && typeof v === 'object') {
          Object.keys(v).forEach(function (sk) {
            if (sk.slice(0, 2) === '--') n.style.setProperty(sk, v[sk]); else n.style[sk] = v[sk];
          });
        }
        else if (k === 'dataset') Object.assign(n.dataset, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) n.setAttribute(k, '');
        else n.setAttribute(k, v);
      });
    }
    var kids = Array.prototype.slice.call(arguments, 2);
    (function add(list) {
      list.forEach(function (kid) {
        if (kid == null || kid === false) return;
        if (Array.isArray(kid)) return add(kid);
        n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
      });
    })(kids);
    return n;
  };

  DPS.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  DPS.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  DPS.clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };
  DPS.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
  };
  DPS.slug = function (s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  DPS.norm = function (s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  };
  DPS.plural = function (n, one, few, many) {
    var a = Math.abs(n);
    if (a === 1) return one;
    if (a >= 2 && a <= 4) return few;
    return many;
  };

  DPS.toast = function (msg) {
    var t = DPS.$('.toast');
    if (!t) { t = DPS.el('div', { class: 'toast', role: 'status' }); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(DPS._toastT);
    DPS._toastT = setTimeout(function () { t.classList.remove('show'); }, 2400);
  };

  DPS.download = function (filename, text, type) {
    var blob = new Blob([text], { type: type || 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  DPS.copy = function (text) {
    var done = function () { DPS.toast('Zkopírováno do schránky'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = DPS.el('textarea', { style: { position: 'fixed', opacity: 0 } });
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { DPS.toast('Kopírování se nepodařilo'); }
      ta.remove();
    }
  };

  /* ---------- úložiště (localStorage s bezpečným záložním režimem) ---------- */
  var KEY = 'dps.v1';
  var state = null;
  var storageOK = true;

  function read() {
    if (state) return state;
    try {
      var raw = window.localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : {};
    } catch (e) { state = {}; storageOK = false; }
    if (!state || typeof state !== 'object') state = {};
    return state;
  }
  function write() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { storageOK = false; }
  }
  function emit(path) {
    document.dispatchEvent(new CustomEvent('dps:store', { detail: { path: path } }));
  }

  DPS.store = {
    available: function () { read(); return storageOK; },
    get: function (path, def) {
      var o = read();
      var p = [].concat(path);
      for (var i = 0; i < p.length; i++) {
        if (o == null || typeof o !== 'object') return def;
        o = o[p[i]];
      }
      return o === undefined ? def : o;
    },
    set: function (path, val) {
      var p = [].concat(path);
      var o = read();
      for (var i = 0; i < p.length - 1; i++) {
        if (o[p[i]] == null || typeof o[p[i]] !== 'object') o[p[i]] = {};
        o = o[p[i]];
      }
      o[p[p.length - 1]] = val;
      write(); emit(p);
      return val;
    },
    del: function (path) {
      var p = [].concat(path);
      var o = read();
      for (var i = 0; i < p.length - 1; i++) {
        if (o == null || typeof o[p[i]] !== 'object') return;
        o = o[p[i]];
      }
      delete o[p[p.length - 1]];
      write(); emit(p);
    },
    exportJSON: function () {
      return JSON.stringify({ app: 'dps', version: 1, exported: new Date().toISOString(), data: read() }, null, 2);
    },
    importJSON: function (text) {
      var obj = JSON.parse(text);
      if (!obj || obj.app !== 'dps' || typeof obj.data !== 'object') throw new Error('Soubor není záloha postupu DPS.');
      state = obj.data; write(); emit([]);
    },
    reset: function () { state = {}; write(); emit([]); }
  };

  /* ---------- postup ---------- */
  var P = DPS.progress = {
    node: function (c, ch) { return DPS.store.get(['progress', c, ch], null); },
    ex: function (c, ch, id) { return DPS.store.get(['progress', c, ch, 'ex', id], null); },
    setEx: function (c, ch, id, val) {
      var v = Object.assign({ ts: Date.now() }, val);
      DPS.store.set(['progress', c, ch, 'ex', id], v);
      document.dispatchEvent(new CustomEvent('dps:progress', { detail: { course: c, chapter: ch } }));
    },
    resetEx: function (c, ch, id) {
      DPS.store.del(['progress', c, ch, 'ex', id]);
      document.dispatchEvent(new CustomEvent('dps:progress', { detail: { course: c, chapter: ch } }));
    },
    getData: function (c, ch, id, def) { return DPS.store.get(['progress', c, ch, 'data', id], def); },
    setData: function (c, ch, id, val) { DPS.store.set(['progress', c, ch, 'data', id], val); },
    visit: function (c, ch, total) {
      DPS.store.set(['progress', c, ch, 'visited'], Date.now());
      DPS.store.set(['progress', c, ch, 'total'], total);
      DPS.store.set(['last'], { course: c, chapter: ch, ts: Date.now() });
    },
    setComplete: function (c, ch, val) {
      DPS.store.set(['progress', c, ch, 'complete'], !!val);
      document.dispatchEvent(new CustomEvent('dps:progress', { detail: { course: c, chapter: ch } }));
    },
    chapter: function (c, chDef) {
      var n = P.node(c, chDef.slug) || {};
      var exs = n.ex || {};
      var done = 0;
      Object.keys(exs).forEach(function (k) { if (exs[k] && exs[k].done) done++; });
      var total = n.total != null ? n.total : (chDef.ex || 0);
      var complete = !!n.complete || (total > 0 && done >= total);
      var pct = complete ? 100 : (total ? Math.round(Math.min(done, total) / total * 100) : 0);
      return { visited: !!n.visited, complete: complete, done: done, total: total, pct: pct };
    },
    course: function (course) {
      var chs = course.chapters.map(function (ch) { return P.chapter(course.slug, ch); });
      var sum = chs.reduce(function (a, s) { return a + s.pct; }, 0);
      var pct = chs.length ? Math.round(sum / chs.length) : 0;
      var completeCount = chs.filter(function (s) { return s.complete; }).length;
      var nextIdx = -1;
      course.chapters.forEach(function (ch, i) {
        if (nextIdx === -1 && ch.status !== 'planned' && !chs[i].complete) nextIdx = i;
      });
      var last = DPS.store.get(['last'], null);
      var lastIdx = last && last.course === course.slug ? course.chapters.findIndex(function (c) { return c.slug === last.chapter; }) : -1;
      var started = chs.some(function (s) { return s.visited || s.done > 0; });
      return { pct: pct, complete: completeCount, total: course.chapters.length, nextIdx: nextIdx, lastIdx: lastIdx, started: started };
    }
  };

  /* ---------- kurzy ---------- */
  DPS.registerCourse = function (c) {
    c.chapters.forEach(function (ch, i) { ch.index = i; ch.status = ch.status || 'ready'; });
    DPS.courses = DPS.courses.filter(function (x) { return x.slug !== c.slug; });
    DPS.courses.push(c);
  };
  DPS.getCourse = function (slug) {
    return DPS.courses.find(function (c) { return c.slug === slug; });
  };
  DPS.courseUrl = function (slug) { return DPS.root + 'courses/' + slug + '/index.html'; };
  DPS.chapterUrl = function (slug, ch) { return DPS.root + 'courses/' + slug + '/' + ch + '.html'; };

  /* ---------- profily (zaměření učitele) ---------- */
  DPS.PROFILES = [
    { id: 'ov', name: 'Odborný výcvik', desc: 'Dílny, praktické vyučování, instruktáž, BOZP', icon: 'wrench' },
    { id: 'inf', name: 'Informatika a ICT', desc: 'Sítě, programování, databáze, kyberbezpečnost', icon: 'monitor' },
    { id: 'eko', name: 'Ekonomika a podnikání', desc: 'Účetnictví, marketing, ekonomika, právo', icon: 'briefcase' },
    { id: 'vs', name: 'Veřejná správa', desc: 'Správní řízení, samospráva, právo', icon: 'landmark' },
    { id: 'cr', name: 'Cestovní ruch a služby', desc: 'Turismus, hotelnictví, gastronomie', icon: 'plane' },
    { id: 'um', name: 'Umělecké obory', desc: 'Výtvarné, grafické, designérské a další', icon: 'palette' }
  ];
  DPS.profile = {
    isSet: function () { return !!DPS.store.get('profile', null); },
    id: function () { return DPS.store.get('profile', 'ov'); },
    get: function () {
      var id = DPS.profile.id();
      return DPS.PROFILES.find(function (p) { return p.id === id; }) || DPS.PROFILES[0];
    },
    set: function (id) { DPS.store.set('profile', id); }
  };
  /** Vrátí hodnotu z objektu { ov:…, inf:…, _:… } podle aktuálního profilu. */
  DPS.byProfile = function (map, fallbackOrder) {
    if (!map || typeof map !== 'object' || Array.isArray(map)) return map;
    var id = DPS.profile.id();
    if (map[id] !== undefined) return map[id];
    var order = fallbackOrder || ['_', 'ov', 'inf', 'eko'];
    for (var i = 0; i < order.length; i++) if (map[order[i]] !== undefined) return map[order[i]];
    var k = Object.keys(map)[0];
    return map[k];
  };

  /* ---------- motiv ---------- */
  DPS.theme = {
    get: function () { return DPS.store.get('theme', 'dark'); },
    apply: function () { document.documentElement.setAttribute('data-theme', DPS.theme.get()); DPS.theme.syncAccent(); },
    toggle: function () {
      DPS.store.set('theme', DPS.theme.get() === 'dark' ? 'light' : 'dark');
      DPS.theme.apply();
    },
    syncAccent: function () {
      var c = DPS._course;
      if (!c) return;
      var light = DPS.theme.get() === 'light';
      var val = light && c.accentLight ? c.accentLight : c.accent;
      if (val) document.body.style.setProperty('--accent', val);
    }
  };
})();
