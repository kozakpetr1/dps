/* ==========================================================================
   DPS boot – načte skripty ve správném pořadí a spustí aplikaci.
   Funguje bez buildu i při otevření souborů přes file:// (žádné ES moduly,
   žádné fetch()). Stránky obsahují jediný <script src=".../boot.js">.

   <body data-page="dashboard">                           – úvodní rozcestník
   <body data-page="overview" data-course="slug">         – přehled kurzu
   <body data-page="chapter" data-course="slug" data-chapter="01-nazev">
   ========================================================================== */
(function () {
  'use strict';

  var script = document.currentScript;
  var jsDir = script.src.slice(0, script.src.lastIndexOf('/') + 1);
  var root = new URL('../../', jsDir).href;

  window.DPS = window.DPS || {};
  DPS.root = root;
  DPS.jsDir = jsDir;

  var body = document.body;
  var page = body.dataset.page || (body.dataset.chapter ? 'chapter' : 'dashboard');
  var course = body.dataset.course;

  function load(urls) {
    return Promise.all(urls.map(function (u) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = u;
        s.async = false; // zachová pořadí spuštění
        s.onload = resolve;
        s.onerror = function () { reject(new Error('Nelze načíst ' + u)); };
        document.head.appendChild(s);
      });
    }));
  }

  var core = [
    'site.js', 'core.js', 'icons.js', 'data-didactics.js',
    'exercises.js', 'ex-choice.js', 'ex-sort.js', 'ex-text.js', 'ex-widgets.js', 'ex-more.js',
    'shell.js'
  ].map(function (f) { return jsDir + f; });

  function start() {
    var chain;
    if (page === 'dashboard') {
      chain = load([root + 'courses/manifest.js']).then(function () {
        return load((DPS.manifest || []).map(function (slug) { return root + 'courses/' + slug + '/course.js'; }));
      });
    } else {
      chain = load([root + 'courses/' + course + '/course.js']);
    }
    return chain.then(function () { DPS.start(page); });
  }

  load(core).then(start).catch(function (err) {
    console.error(err);
    var box = document.createElement('div');
    box.style.cssText = 'margin:40px auto;max-width:640px;padding:20px;border:1px solid #ff7a88;border-radius:12px;font:16px system-ui;color:#ffb3bb;background:#2a1116';
    box.textContent = 'Aplikaci se nepodařilo načíst: ' + err.message;
    document.body.prepend(box);
  });
})();
