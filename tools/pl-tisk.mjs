#!/usr/bin/env node
/*
  Tisk pracovních listů (pl/ped, pl/did) do PDF přes headless Chrome/Edge.

    node tools/pl-tisk.mjs                 vytiskne všechny listy + souhrnné PDF za každou složku
    node tools/pl-tisk.mjs --png DIR       navíc uloží náhledy PNG do DIR (pro kontrolu)
    node tools/pl-tisk.mjs pl/ped/ped-01-*.html   jen vybrané soubory (bez souhrnného PDF)

  U každého listu ověří, že se obsah vejde na jednu stranu A4 (nepřetéká).
  Při přetečení skončí s chybou a vypíše, o kolik milimetrů je list delší.
*/
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SLOZKY = [['pl/ped', 'PED'], ['pl/did', 'DID']];
const PROHLIZECE = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const args = process.argv.slice(2);
const pngDir = args.includes('--png') ? path.resolve(args[args.indexOf('--png') + 1]) : null;
const vybrane = args.filter((a, i) => a.endsWith('.html') && args[i - 1] !== '--png').map(a => path.resolve(a));

const exe = PROHLIZECE.find(p => fs.existsSync(p));
if (!exe) { console.error('Nenalezen Chrome ani Edge.'); process.exit(2); }

const port = 9300 + Math.floor(Math.random() * 500);
const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'pl-tisk-'));
const chrome = spawn(exe, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, 'about:blank'], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function cekejNaPort() {
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/list`); if (r.ok) return r.json(); } catch {}
    await sleep(100);
  }
  throw new Error('Prohlížeč neodpověděl.');
}

let ws, idSeq = 0;
const cekajici = new Map(), posluchaci = [];
function cdp(method, params = {}) {
  const id = ++idSeq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => cekajici.set(id, { res, rej }));
}
function udalost(name) { return new Promise(res => posluchaci.push({ name, res })); }

async function otevri(soubor) {
  const nacteno = udalost('Page.loadEventFired');
  await cdp('Page.navigate', { url: pathToFileURL(soubor).href });
  await nacteno;
  await cdp('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
}

async function main() {
  const cile = await cekejNaPort();
  const page = cile.find(t => t.type === 'page');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && cekajici.has(m.id)) {
      const c = cekajici.get(m.id); cekajici.delete(m.id);
      m.error ? c.rej(new Error(m.error.message)) : c.res(m.result);
    } else if (m.method) {
      const i = posluchaci.findIndex(p => p.name === m.method);
      if (i >= 0) posluchaci.splice(i, 1)[0].res(m.params);
    }
  });
  await cdp('Page.enable');
  await cdp('Emulation.setEmulatedMedia', { media: 'print' });
  if (pngDir) fs.mkdirSync(pngDir, { recursive: true });

  let chyby = 0;
  const skupiny = vybrane.length
    ? [[null, null, vybrane]]
    : SLOZKY.map(([d, k]) => [d, k, fs.readdirSync(path.join(ROOT, d)).filter(f => /^(ped|did)-\d\d.*\.html$/.test(f)).sort().map(f => path.join(ROOT, d, f))]);

  for (const [dir, kod, soubory] of skupiny) {
    for (const f of soubory) {
      await otevri(f);
      const { result } = await cdp('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => { const l = document.querySelector('.list'); const mm = 96 / 25.4;
          return { navic: Math.round((l.scrollHeight - l.clientHeight) / mm * 10) / 10,
                   rezerva: Math.round((l.getBoundingClientRect().bottom - document.querySelector('.pata').getBoundingClientRect().top) / mm * 10) / 10 }; })()`,
      });
      const { navic } = result.value;
      const pdf = await cdp('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
      fs.writeFileSync(f.replace(/\.html$/, '.pdf'), Buffer.from(pdf.data, 'base64'));
      if (pngDir) {
        const png = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: 794, height: 1123, scale: 1 } });
        fs.writeFileSync(path.join(pngDir, path.basename(f).replace(/\.html$/, '.png')), Buffer.from(png.data, 'base64'));
      }
      const ok = navic <= 0.5;
      if (!ok) chyby++;
      console.log(`${ok ? 'OK ' : 'PŘETÉKÁ'} ${path.relative(ROOT, f)}${ok ? '' : `  (+${navic} mm)`}`);
    }

    if (dir) {
      // Souhrnné PDF: všechny listy složky za sebou, každý na samostatné straně
      const telo = soubory.map(f => fs.readFileSync(f, 'utf8').match(/<main class="list">[\s\S]*?<\/main>/)[0]).join('\n');
      const css = pathToFileURL(path.join(ROOT, 'pl/pl.css')).href;
      const tmp = path.join(profil, `${kod}-vse.html`);
      fs.writeFileSync(tmp, `<!doctype html><html lang="cs"><head><meta charset="utf-8"><link rel="stylesheet" href="${css}"><style>.list{break-after:page}</style></head><body>${telo}</body></html>`);
      await otevri(tmp);
      const pdf = await cdp('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
      const out = path.join(ROOT, dir, `${kod}-vsechny-listy.pdf`);
      fs.writeFileSync(out, Buffer.from(pdf.data, 'base64'));
      console.log(`   souhrn: ${path.relative(ROOT, out)} (${soubory.length} stran)`);

      // Klíč pro zkoušejícího (vícestránkový, bez kontroly přetečení)
      for (const k of fs.readdirSync(path.join(ROOT, dir)).filter(f => /^klic-.*\.html$/.test(f))) {
        const kf = path.join(ROOT, dir, k);
        await otevri(kf);
        const kpdf = await cdp('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
        fs.writeFileSync(kf.replace(/\.html$/, '.pdf'), Buffer.from(kpdf.data, 'base64'));
        console.log(`   klíč:   ${path.relative(ROOT, kf.replace(/\.html$/, '.pdf'))}`);
      }
    }
  }
  return chyby;
}

main()
  .then(chyby => { ws.close(); chrome.kill(); process.exit(chyby ? 1 : 0); })
  .catch(e => { console.error(e); chrome.kill(); process.exit(2); });
