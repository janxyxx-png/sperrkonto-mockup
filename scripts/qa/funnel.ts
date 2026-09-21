// Klick-Test des Funnels /app/start: fuenf Wege, liest die Ergebniskarten aus; dazu der Umzugsrechner auf /pricing.
import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE ?? 'http://127.0.0.1:4321';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const errors: string[] = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
const click = async (sel: string) => { await page.waitForSelector(sel, { visible: true, timeout: 5000 }); await page.click(sel); };
const text = (sel: string) => page.$eval(sel, (el) => (el as HTMLElement).innerText.trim());
const step = () => page.$eval('[data-step]:not([hidden])', (el) => (el as HTMLElement).dataset.step);
async function run(name: string, purpose: number, age: string, funding?: 'have' | 'need', guarantor?: 'yes' | 'no', locale = '') {
  await page.goto(`${BASE}${locale}/app/start`, { waitUntil: 'networkidle0' });
  await click('[data-step="start"] [data-next]');
  await click(`[data-answer="purpose"][data-value="${purpose}"]`);
  await click('[data-answer="from"][data-value="islamabad"]');
  await page.type('[data-answer="age"]', age); await click('[data-step="age"] [data-next]');
  await click('[data-step="arrival"] [data-goto]');
  const afterArrival = await step();
  if (funding) await click(`[data-answer="funding"][data-value="${funding}"]`);
  if (guarantor) await click(`[data-answer="guarantor"][data-value="${guarantor}"]`);
  await click('[data-step="email"] .btn-link');
  const out = (k: string) => text(`[data-out="${k}"]`);
  console.log(`\n## ${name}`);
  console.log({ afterArrival, result: await step(), plan: await out('planName'), premium: await out('premium'), fund: await out('fundTitle'),
    note: await page.$eval('[data-out="fundNote"]', (el) => (el as HTMLElement).hidden ? '(hidden)' : (el as HTMLElement).innerText.slice(0, 50) + '...'),
    depositSub: (await out('depositSub')).slice(0, 34), dep: await out('depositEur'), fee: await out('feeEur'), feePkr: await out('feePkr'), total: await out('totalEur'), totalPkr: await out('totalPkr'),
    tl2: await page.$eval('[data-out="timeline"] li:nth-child(2) .what', (el) => (el as HTMLElement).innerText), docs: await page.$$eval('[data-out="docs"] li', (els) => els.length),
    waLen: await page.$eval('[data-whatsapp]', (el) => (el as HTMLAnchorElement).href.length), setupWhy: (await out('setupWhy')).slice(0, 40) });
}
await run('Studium, eigenes Geld, 23', 0, '23', 'have');
await run('Studium, Kredit, kein Buerge, 31', 2, '31', 'need', 'no');
await run('Studium, Kredit, Buerge, 24', 5, '24', 'need', 'yes');
await run('Chancenkarte, 29', 7, '29');
await run('Jobsuche, Urdu, 35', 8, '35', undefined, undefined, '/ur');
// Rechner auf /pricing
await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle0' });
const cell = (k: string) => page.$eval(`[data-eur="${k}"]`, (el) => (el as HTMLElement).innerText);
console.log('\n## /pricing Rechner (23 J., 12 Monate, Berlin, 650 Flug)', { ins: await cell('insurance'), rent: await cell('rent'), flight: await cell('flight'), total: await cell('total'), before: await cell('before'), first90: await cell('first90') }); // M07: vorher/nachher getrennt, keine PKR-Spalte mehr
await page.$eval('[data-age]', (el) => { (el as HTMLInputElement).value = '32'; el.dispatchEvent(new Event('input', { bubbles: true })); });
console.log('## /pricing Rechner (32 J.)', { ins: await cell('insurance'), total: await cell('total') });
console.log('\nerrors:', errors.length ? errors : 'keine');
await browser.close();
