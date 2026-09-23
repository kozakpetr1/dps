#!/usr/bin/env node
/**
 * Vytvoří chybějící HTML stránky podle courses/manifest.js a course.js.
 *
 *   node tools/scaffold.mjs            – doplní chybějící index.html a kapitoly (existující nepřepisuje)
 *   node tools/scaffold.mjs --force    – přepíše i existující kostry, které ještě nemají obsah
 *
 * Nový kurz:   1) vytvořte courses/<slug>/course.js   2) přidejte <slug> do courses/manifest.js
 *              3) spusťte tento skript
 * Nová kapitola: přidejte ji do pole chapters v course.js a spusťte tento skript.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

function loadScript(file, ctx) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
}
const courses = [];
const ctx = vm.createContext({ window: {}, DPS: { registerCourse: (c) => courses.push(c) } });
ctx.window = ctx;
loadScript(path.join(root, 'courses/manifest.js'), ctx);
for (const slug of ctx.DPS.manifest) loadScript(path.join(root, 'courses', slug, 'course.js'), ctx);

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%237aa2ff'/%3E%3Cpath d='M5 13l11-5 11 5-11 5z' fill='%2308101f'/%3E%3Cpath d='M9 16v5c0 1.5 3.5 3 7 3s7-1.5 7-3v-5l-7 3z' fill='%2308101f'/%3E%3C/svg%3E";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function page({ title, depth, bodyAttrs, inner }) {
  const up = '../'.repeat(depth);
  return `<!doctype html>
<html lang="cs" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>${esc(title)}</title>
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="${up}assets/css/app.css">
<script>try{var t=JSON.parse(localStorage.getItem('dps.v1')).theme;if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body ${bodyAttrs}>
${inner}<noscript><p style="padding:2rem;font-family:system-ui">Pro zobrazení výukových materiálů je potřeba zapnout JavaScript.</p></noscript>
<script src="${up}assets/js/boot.js"></script>
</body>
</html>
`;
}

function write(file, content, { skipIfHasContent } = {}) {
  const exists = fs.existsSync(file);
  if (exists && !force) return false;
  if (exists && skipIfHasContent && skipIfHasContent(fs.readFileSync(file, 'utf8'))) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

let created = 0;

// úvodní rozcestník
if (write(path.join(root, 'index.html'), page({ title: 'Doplňkové pedagogické studium', depth: 0, bodyAttrs: 'data-page="dashboard"', inner: '' }))) created++;

for (const c of courses) {
  const dir = path.join(root, 'courses', c.slug);
  if (write(path.join(dir, 'index.html'), page({ title: `${c.title}`, depth: 2, bodyAttrs: `data-page="overview" data-course="${c.slug}"`, inner: '' }))) created++;
  for (const ch of c.chapters) {
    const file = path.join(dir, ch.slug + '.html');
    // kostry (planned) lze přegenerovat, hotové kapitoly (ready) s obsahem nikdy
    const ok = write(
      file,
      page({ title: `${ch.title} · ${c.title}`, depth: 2, bodyAttrs: `data-page="chapter" data-course="${c.slug}" data-chapter="${ch.slug}"`, inner: '<article id="chapter">\n</article>\n' }),
      { skipIfHasContent: (txt) => /<section/.test(txt) }
    );
    if (ok) created++;
  }
}
console.log(created ? `Vytvořeno souborů: ${created}` : 'Nic k vytvoření – všechny stránky už existují.');
