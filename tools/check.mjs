#!/usr/bin/env node
/**
 * Kontrola kapitol: platnost JSON cvičení, povinná pole podle typu cvičení,
 * jedinečnost data-id, struktura sekcí, vyváženost HTML značek.
 *
 *   node tools/check.mjs                      – zkontroluje všechny kapitoly ve všech kurzech
 *   node tools/check.mjs courses/<kurz>/01-*.html   – vybrané soubory
 *
 * Návratový kód 1 = nalezena chyba. Varování (WARN) nejsou chyby.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROFILES = ['ov', 'inf', 'eko', 'vs', 'cr', 'um', '_'];
const DOMAINS = ['kog', 'psy', 'afe'];
const TYPES = ['quiz', 'match', 'classify', 'order', 'cloze', 'flashcards', 'scenario', 'reflect', 'spot', 'taxonomy', 'goalbuilder', 'timeplanner', 'annotate', 'rewrite', 'checklist', 'rubric', 'examsim', 'portfolio'];
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr', 'col', 'path', 'circle', 'rect', 'line', 'ellipse', 'polygon', 'polyline', 'stop', 'use']);

function files() {
  const args = process.argv.slice(2);
  if (args.length) return args.map((a) => path.resolve(a));
  const out = [];
  for (const c of fs.readdirSync(path.join(root, 'courses'), { withFileTypes: true })) {
    if (!c.isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(root, 'courses', c.name))) {
      if (/^\d\d-.*\.html$/.test(f)) out.push(path.join(root, 'courses', c.name, f));
    }
  }
  return out.sort();
}

const strip = (s) => String(s).replace(/<[^>]+>/g, '');

function checkCfg(type, cfg, err, warn) {
  const need = (cond, msg) => { if (!cond) err(msg); };
  const arr = (x) => Array.isArray(x);
  switch (type) {
    case 'quiz': {
      if (cfg.generate === 'bloom') break;
      need(arr(cfg.items) && cfg.items.length >= 3, 'quiz: items[] (alespoň 3 otázky)');
      (cfg.items || []).forEach((it, i) => {
        const p = `quiz.items[${i}]`;
        need(typeof it.q === 'string' && it.q.length > 5, p + ': chybí q');
        if (it.tf) need(typeof it.ok === 'boolean', p + ': tf vyžaduje ok:true|false');
        else if (it.pick) {
          need(arr(it.pick) && it.pick.length >= 2, p + ': pick musí mít alespoň 2 možnosti');
          const a = [].concat(it.answer);
          need(it.answer !== undefined && a.every((x) => Number.isInteger(x) && x >= 0 && x < (it.pick || []).length), p + ': answer musí být index (nebo pole indexů) v pick');
        } else {
          need(arr(it.opts) && it.opts.length >= 2 && it.opts.some((o) => o.ok), p + ': opts[] s alespoň jednou ok:true');
        }
        if (!it.why) warn(p + ': chybí why (vysvětlení)');
      });
      break;
    }
    case 'match':
      need(arr(cfg.pairs) && cfg.pairs.length >= 3, 'match: pairs[] (alespoň 3 dvojice)');
      (cfg.pairs || []).forEach((p, i) => need(p.l && p.r, `match.pairs[${i}]: chybí l/r`));
      { const rs = (cfg.pairs || []).map((p) => p.r).concat(cfg.extra || []); need(new Set(rs).size === rs.length, 'match: pravé strany (r + extra) musí být jedinečné'); }
      { const ls = (cfg.pairs || []).map((p) => p.l); need(new Set(ls).size === ls.length, 'match: levé strany musí být jedinečné'); }
      break;
    case 'classify': {
      need(arr(cfg.bins) && cfg.bins.length >= 2, 'classify: bins[] (alespoň 2)');
      const ids = (cfg.bins || []).map((b) => b.id);
      (cfg.bins || []).forEach((b) => need(b.id && b.name, 'classify.bins: id a name'));
      need(arr(cfg.cards) && cfg.cards.length >= 4, 'classify: cards[] (alespoň 4)');
      (cfg.cards || []).forEach((c, i) => need(c.t && ids.includes(c.bin), `classify.cards[${i}]: t a bin (existující id) jsou povinné`));
      const used = new Set((cfg.cards || []).map((c) => c.bin));
      ids.forEach((id) => { if (!used.has(id)) warn(`classify: do skupiny „${id}“ nepatří žádná karta`); });
      if (!cfg.instant) warn('classify: bez instant:true se zpětná vazba ukáže až po kontrole (v pořádku, pokud je to záměr)');
      break;
    }
    case 'order':
      need(arr(cfg.items) && cfg.items.length >= 3, 'order: items[] (alespoň 3)');
      break;
    case 'cloze': {
      need(typeof cfg.text === 'string', 'cloze: text');
      const n = (String(cfg.text || '').match(/\[\[.+?\]\]/g) || []).length;
      need(n >= 2, 'cloze: text musí obsahovat alespoň 2 mezery [[správně]]');
      need(arr(cfg.bank) && cfg.bank.length >= 2, 'cloze: bank[] – přidejte alespoň 2 rušivé odpovědi (banka je společná pro všechny mezery)');
      break;
    }
    case 'flashcards':
      need(arr(cfg.cards) && cfg.cards.length >= 3, 'flashcards: cards[] (alespoň 3)');
      (cfg.cards || []).forEach((c, i) => need(c.q && c.a, `flashcards.cards[${i}]: q a a`));
      break;
    case 'scenario': {
      need(cfg.nodes && cfg.start && cfg.nodes[cfg.start], 'scenario: start musí odkazovat na existující uzel');
      let ends = 0;
      for (const [id, n] of Object.entries(cfg.nodes || {})) {
        need(n.text, `scenario.nodes.${id}: chybí text`);
        if (n.end) { ends++; continue; }
        need(arr(n.choices) && n.choices.length >= 2, `scenario.nodes.${id}: choices[] (alespoň 2)`);
        (n.choices || []).forEach((c, i) => need(c.t && cfg.nodes[c.to], `scenario.nodes.${id}.choices[${i}]: t a to (existující uzel)`));
      }
      need(ends >= 2, 'scenario: alespoň 2 koncové uzly (end:true, title, text, lesson)');
      break;
    }
    case 'reflect': {
      need(arr(cfg.prompts) && cfg.prompts.length >= 1, 'reflect: prompts[]');
      const ids = (cfg.prompts || []).map((p) => p.id);
      need(ids.every(Boolean) && new Set(ids).size === ids.length, 'reflect: každý prompt má jedinečné id');
      (cfg.prompts || []).forEach((p) => need(p.q, 'reflect: prompt bez q'));
      break;
    }
    case 'spot': {
      need(arr(cfg.parts), 'spot: parts[]');
      const bad = (cfg.parts || []).filter((p) => typeof p === 'object' && p.bad).length;
      const seg = (cfg.parts || []).filter((p) => typeof p === 'object').length;
      need(bad >= 2, 'spot: alespoň 2 segmenty s bad:true');
      need(seg - bad >= 1, 'spot: alespoň 1 segment s bad:false (jinak lze vyhrát označením všeho)');
      break;
    }
    case 'taxonomy':
      need(arr(cfg.domains) && cfg.domains.every((d) => DOMAINS.includes(d)), 'taxonomy: domains ⊂ [kog, psy, afe]');
      break;
    case 'goalbuilder':
      need(cfg.examples && typeof cfg.examples === 'object', 'goalbuilder: examples { ov: {bad:{a,c,b,o,d}, good:{…}}, … }');
      for (const [k, v] of Object.entries(cfg.examples || {})) {
        need(PROFILES.includes(k), `goalbuilder.examples: neznámý profil ${k}`);
        need(v && v.good && v.bad, `goalbuilder.examples.${k}: bad i good`);
      }
      break;
    case 'timeplanner': {
      need(Number.isFinite(cfg.duration) && arr(cfg.phases) && cfg.phases.length >= 2, 'timeplanner: duration a phases[]');
      const ids = (cfg.phases || []).map((p) => p.id);
      (cfg.phases || []).forEach((p) => need(p.id && p.name && p.color && Number.isFinite(p.min), 'timeplanner.phases: id, name, color, min'));
      (cfg.rules || []).forEach((r) => need(r.text && ((r.kind === 'phaseMin' && ids.includes(r.id)) || (r.kind === 'sumShare' && (r.ids || []).every((i) => ids.includes(i)))), 'timeplanner.rules: kind + id/ids + text'));
      need(arr(cfg.presets) && cfg.presets.length >= 1, 'timeplanner: presets[] – alespoň jeden vzorový rozvrh, který splňuje pravidla');
      (cfg.presets || []).forEach((p) => {
        const sum = ids.reduce((a, id) => a + (p.values[id] || 0), 0);
        need(sum === cfg.duration, `timeplanner.presets „${p.name}“: součet ${sum} ≠ ${cfg.duration}`);
      });
      break;
    }
    case 'annotate': {
      need(arr(cfg.categories) && cfg.categories.length >= 2, 'annotate: categories[] (alespoň 2)');
      const ids = (cfg.categories || []).map((c) => c.id);
      (cfg.categories || []).forEach((c) => need(c.id && c.name, 'annotate.categories: id a name'));
      need(arr(cfg.parts), 'annotate: parts[]');
      const segs = (cfg.parts || []).filter((p) => typeof p === 'object');
      segs.forEach((p, i) => need(p.t && (p.cat === null || ids.includes(p.cat)), `annotate.parts: segment ${i + 1} musí mít t a cat (id kategorie nebo null)`));
      need(segs.length >= 5, 'annotate: alespoň 5 označitelných segmentů');
      ids.forEach((id) => { if (!segs.some((s) => s.cat === id)) warn(`annotate: kategorie „${id}“ nemá žádný segment`); });
      break;
    }
    case 'rewrite':
      need(arr(cfg.items) && cfg.items.length >= 1, 'rewrite: items[]');
      (cfg.items || []).forEach((it, i) => {
        const p = `rewrite.items[${i}]`;
        need(it.bad && it.model, p + ': bad a model jsou povinné');
        need(arr(it.checks) && it.checks.length >= 2, p + ': checks[] (alespoň 2)');
        (it.checks || []).forEach((c, j) => {
          need(c.label && (arr(c.any) || arr(c.all)), `${p}.checks[${j}]: label a any[]/all[]`);
          [].concat(c.any || [], c.all || []).forEach((r) => {
            try { new RegExp(r, 'i'); } catch (e) { err(`${p}.checks[${j}]: neplatný regulární výraz ${r}`); }
            if (r !== r.normalize('NFD').replace(/[̀-ͯ]/g, '')) err(`${p}.checks[${j}]: výraz „${r}“ obsahuje diakritiku (text se porovnává bez diakritiky)`);
            if (r !== r.toLowerCase() && !/\\[A-Za-z]/.test(r)) warn(`${p}.checks[${j}]: výraz „${r}“ – používejte malá písmena`);
          });
        });
      });
      break;
    case 'checklist':
      need(arr(cfg.items) && cfg.items.length >= 3, 'checklist: items[] (alespoň 3)');
      break;
    case 'rubric':
      need(arr(cfg.levels) && cfg.levels.length >= 2, 'rubric: levels[]');
      if (cfg.example) {
        need(arr(cfg.example) && cfg.example.length >= (cfg.minCriteria || 3), 'rubric.example: alespoň minCriteria řádků');
        (cfg.example || []).forEach((r, i) => need(r.name && arr(r.cells) && r.cells.length === (cfg.levels || []).length, `rubric.example[${i}]: name a cells (počet = levels)`));
      } else warn('rubric: chybí example (ukázková rubrika)');
      break;
    case 'portfolio':
      need(arr(cfg.sources) && cfg.sources.length >= 2, 'portfolio: sources[] (alespoň 2)');
      (cfg.sources || []).forEach((s, i) => {
        need(s.chapter && s.id && s.title, `portfolio.sources[${i}]: chapter, id, title`);
        need(!s.kind || ['reflect', 'goals', 'rubric', 'timeplanner', 'checklist'].includes(s.kind), `portfolio.sources[${i}]: neznámý kind`);
      });
      break;
    case 'examsim':
      need(arr(cfg.pools) && cfg.pools.length >= 1, 'examsim: pools[]');
      (cfg.pools || []).forEach((p) => {
        need(p.id && p.name && arr(p.items) && p.items.length >= 3, 'examsim.pools: id, name, items[] (alespoň 3 otázky)');
        (p.items || []).forEach((it, i) => need(it.q && arr(it.points) && it.points.length >= 3, `examsim.pools.${p.id}.items[${i}]: q a points[] (alespoň 3 body dobré odpovědi)`));
      });
      break;
  }
}

function checkHtml(html, err, warn) {
  // vyváženost značek
  const body = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '<script></script>').replace(/<style[\s\S]*?<\/style>/g, '');
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
  const stack = [];
  let m;
  while ((m = re.exec(body))) {
    const tag = m[1].toLowerCase(); const closing = m[0][1] === '/';
    if (VOID.has(tag) || m[2] === '/') continue;
    if (!closing) stack.push(tag);
    else {
      const top = stack.pop();
      if (top !== tag) { err(`HTML: neodpovídající značka </${tag}> (očekávána </${top}>) poblíž „${body.slice(Math.max(0, m.index - 50), m.index).replace(/\s+/g, ' ')}“`); return; }
    }
  }
  if (stack.length) err('HTML: neuzavřené značky: ' + stack.slice(-3).join(', '));
  if (!/<article id="chapter">/.test(html)) err('chybí <article id="chapter">');
  if (/<h1[\s>]/.test(html)) err('v kapitole nepoužívejte <h1> (nadpis se vytváří automaticky)');
  const art = html.split('<article id="chapter">')[1] || '';
  const inner = art.split('</article>')[0];
  const secs = [...inner.matchAll(/<section\b[^>]*>/g)].length;
  if (secs < 4) warn(`jen ${secs} sekcí <section> (očekává se 5–8)`);
  [...inner.matchAll(/<section\b([^>]*)>\s*(?:<!--[\s\S]*?-->\s*)*<h2\b/g)];
  const noH2 = [...inner.matchAll(/<section\b[^>]*>(?!\s*(?:<!--[\s\S]*?-->\s*)*<h2\b)/g)].length;
  if (noH2) err(`${noH2}× <section> nezačíná <h2>`);
  if (!/<section\b[^>]*\bid="[a-z0-9-]+"/.test(inner)) err('sekce musí mít id');
  const sectionIds = [...inner.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((x) => x[1]);
  if (new Set(sectionIds).size !== sectionIds.length) err('duplicitní id sekcí');
  if (/<script(?![^>]*application\/json)[^>]*>/.test(inner)) err('v kapitole nesmí být jiný <script> než application/json');
  if (/style="[^"]*(color|background)\s*:\s*#/.test(inner)) warn('inline barvy (color/background) – raději použijte třídy z komponent');
  const words = strip(inner.replace(/<script[\s\S]*?<\/script>/g, '')).split(/\s+/).filter(Boolean).length;
  return words;
}

let errors = 0, warns = 0;
for (const file of files()) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  const msgs = [];
  const err = (m) => { msgs.push('ERR  ' + m); errors++; };
  const warn = (m) => { msgs.push('WARN ' + m); warns++; };
  const words = checkHtml(html, err, warn);
  const ids = new Set();
  let n = 0; const typeCount = {};
  for (const m of html.matchAll(/<div class="ex" data-type="([\w-]+)" data-id="([^"]*)">\s*<script type="application\/json">([\s\S]*?)<\/script>/g)) {
    n++;
    const [, type, id, json] = m;
    typeCount[type] = (typeCount[type] || 0) + 1;
    const e2 = (x) => err(`[${id}] ${x}`), w2 = (x) => warn(`[${id}] ${x}`);
    if (!TYPES.includes(type)) { e2('neznámý typ ' + type); continue; }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) e2('data-id musí být kebab-case (a-z, 0-9, pomlčky)');
    if (ids.has(id)) e2('duplicitní data-id'); ids.add(id);
    let cfg;
    try { cfg = JSON.parse(json); } catch (e) { e2('neplatný JSON: ' + e.message); continue; }
    if (!cfg.title) w2('chybí title');
    const variants = cfg.byProfile ? Object.entries(cfg.byProfile) : [];
    for (const [k] of variants) if (!PROFILES.includes(k)) e2('byProfile: neznámý profil ' + k);
    if (variants.length) {
      const base = { ...cfg }; delete base.byProfile;
      if (!variants.some(([k]) => k === '_')) w2('byProfile bez varianty "_": profily bez vlastní varianty použijí „ov“ – přidejte "_": {} nebo obecnou variantu');
      for (const [k, v] of variants) checkCfg(type, { ...base, ...v }, (x) => e2(`(profil ${k}) ${x}`), (x) => w2(`(profil ${k}) ${x}`));
    } else checkCfg(type, cfg, e2, w2);
  }
  // .ex bez platného zápisu
  const declared = (html.match(/class="ex"/g) || []).length;
  if (declared !== n) err(`nalezeno ${declared} .ex, ale ${n} má správný tvar <div class="ex" data-type data-id><script type="application/json">…`);
  if (n < 6) warn(`jen ${n} cvičení (cíl je 8–13)`);
  const kinds = Object.keys(typeCount).length;
  if (kinds < 4) warn(`jen ${kinds} různých typů cvičení (cíl alespoň 5)`);
  console.log(`${errors ? '' : ''}${rel}: ${n} cvičení (${Object.entries(typeCount).map(([k, v]) => k + '×' + v).join(', ')}), ≈${words} slov textu`);
  msgs.forEach((m) => console.log('   ' + m));
}
console.log(errors ? `\nChyb: ${errors}, varování: ${warns}` : `\nBez chyb (varování: ${warns}).`);
process.exit(errors ? 1 : 0);
