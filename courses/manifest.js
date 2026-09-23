/* Seznam kurzů zobrazených na úvodní stránce (pořadí = pořadí karet).
   Nový kurz: vytvořte složku courses/<slug>/ s course.js a přidejte slug sem.
   Kostry stránek vytvoří `node tools/scaffold.mjs`. */
window.DPS = window.DPS || {};
DPS.manifest = [
  'uvod-do-obecne-pedagogiky-a-didaktiky',
  'didaktika-odbornych-predmetu'
];
