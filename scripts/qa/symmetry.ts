// Symmetrie-Pruefung (Jan 21.09.: "dass Dinge auf der gleichen Hoehe sind und nichts versetzt"). Misst je Route und Breite:
//  - Reihen (Kinder eines Grid- oder Flex-Containers auf einer Zeile): ungleiche Unterkanten bei align start/stretch,
//    versetzte Mitten bei align center, und bei gleichartigen Karten: Ueberschrift, Bild/Icon und letztes Kind auf gleicher Hoehe
//  - Zentrierung: Elemente mit margin auto, deren Abstand links und rechts im Elternteil ungleich ist
//  - Container-Kanten: alle .container einer Seite auf derselben linken und rechten Kante
// Aufruf: BASE=http://127.0.0.1:4340 bun run scripts/qa/symmetry.ts [--w=1440,390] [--json=DATEI] [route ...]
import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'fs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:4340';
const args = process.argv.slice(2);
const opt = (n: string, d: string) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const widths = opt('w', '1440,390').split(',').map(Number);
const jsonOut = opt('json', '');
const only = args.filter((a) => !a.startsWith('--'));
const routes = only.length ? only : (process.env.ROUTES ?? '/ /blocked-account /health-insurance /german-bank-account /study-loan /complete-setup /pricing /guides /help /embassy-checklist /authorities /about-us /careers /partners /press /app/start /app/login /app/dashboard /app/transfer /app/documents /app/activate /app/settings').split(/\s+/).filter(Boolean);

const AUDIT = `(() => {
  const out = [];
  const R = (n) => Math.round(n);
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '') + ' "' + (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 28) + '"';
  const sec = (el) => { const s = el.closest('section, header, footer, aside, nav, main > *'); return s ? (s.id || s.tagName.toLowerCase() + (typeof s.className === 'string' && s.className ? '.' + s.className.split(' ')[0] : '')) : '?'; };
  const skip = (el) => !!el.closest('[data-qa-ignore], .ama-panel, svg, [hidden], .sheet:not(.is-open), template');
  const all = [...document.querySelectorAll('body *')].filter((el) => vis(el) && !skip(el));
  // A. Reihen
  for (const el of all) {
    const cs = getComputedStyle(el);
    const isRow = ((cs.display === 'flex' || cs.display === 'inline-flex') && cs.flexDirection.startsWith('row')) || cs.display === 'grid' || cs.display === 'inline-grid';
    if (!isRow) continue;
    const kids = [...el.children].filter((c) => vis(c) && !['absolute', 'fixed'].includes(getComputedStyle(c).position));
    if (kids.length < 2) continue;
    const rows = [];
    for (const k of kids) { const r = k.getBoundingClientRect(); const row = rows.find((rw) => Math.abs(rw.top - r.top) <= 3); if (row) row.items.push({ k, r }); else rows.push({ top: r.top, items: [{ k, r }] }); }
    for (const row of rows) {
      if (row.items.length < 2) continue;
      // nebeneinander? (keine horizontale Ueberdeckung)
      const sorted = [...row.items].sort((a, b) => a.r.left - b.r.left);
      let side = true; for (let i = 1; i < sorted.length; i++) if (sorted[i].r.left < sorted[i - 1].r.right - 2) side = false;
      if (!side) continue;
      const hs = row.items.map((i) => i.r.height), bots = row.items.map((i) => i.r.bottom), mids = row.items.map((i) => (i.r.top + i.r.bottom) / 2);
      const dh = Math.max(...hs) - Math.min(...hs);
      const same = row.items.every((i) => i.k.tagName === row.items[0].k.tagName && i.k.className === row.items[0].k.className);
      if (dh > 3) {
        if (cs.alignItems === 'center') { const dm = Math.max(...mids) - Math.min(...mids); if (dm > 2) out.push({ k: 'mitten-versetzt', s: sec(el), e: desc(el), d: R(dm), items: row.items.map((i) => desc(i.k) + ' ' + R(i.r.top) + '-' + R(i.r.bottom)) }); }
        else if (cs.alignItems !== 'baseline') { const db = Math.max(...bots) - Math.min(...bots); if (db > 3) out.push({ k: 'unterkanten-versetzt', same, s: sec(el), e: desc(el), align: cs.alignItems, d: R(db), items: row.items.map((i) => desc(i.k) + ' h' + R(i.r.height)) }); }
      }
      if (same && row.items.length >= 2) {
        const land = (k, q) => { const e = k.querySelector(q); return e && vis(e) ? e.getBoundingClientRect() : null; };
        for (const q of ['h1,h2,h3,h4', 'img,picture,.icircle,.avatar,.num', ':scope > :last-child']) {
          const ls = row.items.map((i) => land(i.k, q)).filter(Boolean);
          if (ls.length !== row.items.length) continue;
          const tops = ls.map((l) => l.top), bots2 = ls.map((l) => l.bottom);
          const dt = Math.max(...tops) - Math.min(...tops), db2 = Math.max(...bots2) - Math.min(...bots2);
          if (q === ':scope > :last-child' ? (dt > 3 && db2 > 3) : dt > 3) out.push({ k: 'innen-versetzt', q, s: sec(el), e: desc(el), d: R(Math.min(dt, q === ':scope > :last-child' ? db2 : dt)), tops: tops.map(R) });
        }
      }
    }
  }
  // B. Zentrierung mit margin auto
  for (const el of all) {
    const cs = getComputedStyle(el); const p = el.parentElement; if (!p || cs.display === 'inline') continue;
    if (cs.marginLeft === 'auto' && cs.marginRight === 'auto' && cs.position !== 'absolute' && cs.position !== 'fixed') {
      const r = el.getBoundingClientRect(), pr = p.getBoundingClientRect(), pc = getComputedStyle(p);
      const left = r.left - pr.left - parseFloat(pc.paddingLeft) - parseFloat(pc.borderLeftWidth), right = pr.right - parseFloat(pc.paddingRight) - parseFloat(pc.borderRightWidth) - r.right;
      if (Math.abs(left - right) > 2 && left + right > 4) out.push({ k: 'zentrierung-schief', s: sec(el), e: desc(el), l: R(left), r: R(right) });
    }
  }
  // C. Container-Kanten
  const conts = [...document.querySelectorAll('.container')].filter((c) => vis(c) && !skip(c)).map((c) => ({ c, r: c.getBoundingClientRect() }));
  const lefts = [...new Set(conts.map((x) => R(x.r.left)))], rights = [...new Set(conts.map((x) => R(x.r.right)))];
  if (lefts.length > 1 || rights.length > 1) out.push({ k: 'container-kanten', lefts, rights, odd: conts.filter((x) => R(x.r.left) !== lefts[0] || R(x.r.right) !== rights[0]).slice(0, 4).map((x) => sec(x.c) + ' ' + R(x.r.left) + '-' + R(x.r.right)) });
  return out;
})()`;

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox', '--hide-scrollbars'] });
const results: Record<string, unknown[]> = {};
let total = 0;
for (const W of widths) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: W, height: W < 700 ? 812 : 900, deviceScaleFactor: 1 });
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 40000 });
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important} .rise,[data-rv]{opacity:1!important;transform:none!important} [data-rv] > li,[data-rv] > .card{opacity:1!important;transform:none!important} img.is-pending{opacity:1!important}' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }); await new Promise((res) => setTimeout(res, 40)); } window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); });
    await new Promise((res) => setTimeout(res, 250));
    const found = (await page.evaluate(AUDIT)) as unknown[];
    results[`${r} @${W}`] = found; total += found.length;
    if (found.length) { console.log(`\n## ${r} @${W}: ${found.length}`); for (const f of found) console.log('  ' + JSON.stringify(f)); }
  }
  await page.close();
}
await browser.close();
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results, null, 1));
console.log(`\nBefunde gesamt: ${total}`);
