// Klick-Test der Accessoires (20.09.): Visa-Chips auf der Startseite, EUR/PKR auf /pricing, Kalenderdatei im Funnel; dazu ein
// vergroesserter Ausschnitt der Trust-Reihe. Aufruf: bun run scripts/qa/tweaks.ts [ausgabeordner]
import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE ?? 'http://127.0.0.1:4321';
const OUT = process.argv[2];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
const errors: string[] = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
const txt = (sel: string) => page.$eval(sel, (el) => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim());
// Visa-Chips
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
const before = { price: await txt('.priceline > span'), bank: await txt('.tript li:nth-child(3) .pc-txt span') };
await page.click('[data-visa-btn="work"]');
const after = { price: await txt('.priceline > span'), bank: await txt('.tript li:nth-child(3) .pc-txt span') };
console.log('visa chips:', before, '->', after);
if (OUT) { const el = await page.$('.logos .container'); await el!.screenshot({ path: `${OUT}/trustrow.png` }); }
// EUR/PKR
await page.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
const eur = await page.$$eval('[data-money]', (els) => els.map((e) => (e as HTMLElement).innerText));
await page.click('[data-cur-btn="pkr"]');
const pkr = await page.$$eval('[data-money]', (els) => els.map((e) => (e as HTMLElement).innerText));
console.log('currency:', eur, '->', pkr);
// Kalenderdatei im Funnel: Termin-Datum wird gesetzt, Klick erzeugt einen Blob-Download
await page.goto(BASE + '/app/start', { waitUntil: 'networkidle0' });
const click = async (sel: string) => { await page.waitForSelector(sel, { visible: true }); await page.click(sel); };
await click('[data-step="start"] [data-next]'); await click('[data-answer="purpose"][data-value="0"]'); await click('[data-answer="from"][data-value="karachi"]');
await page.type('[data-answer="age"]', '22'); await click('[data-step="age"] [data-next]'); await click('[data-step="arrival"] [data-goto]'); await click('[data-answer="funding"][data-value="have"]'); await click('[data-step="email"] .btn-link');
const appt = await page.$eval('[data-wizard]', (el) => (el as HTMLElement).dataset.appt);
const dl = await page.evaluate(() => new Promise<string>((res) => { const orig = URL.createObjectURL; (URL as any).createObjectURL = (b: Blob) => { b.text().then((t) => res(t.slice(0, 120))); return orig.call(URL, b); }; (document.querySelector('[data-ics]') as HTMLElement).click(); setTimeout(() => res('kein Download'), 1500); }));
console.log('calendar:', appt, '|', dl.replace(/\r\n/g, ' / '));
// Sperrkonto-Planer (M06): Monate ueber das versteckte Feld auf 6 setzen, zweimal + klicken, die Summe muss sich aendern; Anker #rupees bleibt
await page.goto(BASE + '/blocked-account', { waitUntil: 'networkidle0' }); if (!(await page.$('#rupees'))) throw new Error('#rupees fehlt'); await page.$eval('[data-est-months]', (el) => { (el as HTMLInputElement).value = '6'; el.dispatchEvent(new Event('input', { bubbles: true })); }); const est0 = await txt('[data-est-total]');
await page.click('[data-est-inc]'); await page.click('[data-est-inc]'); const est1 = await txt('[data-est-total]'); console.log('planner:', est0, '->', est1, '|', await txt('[data-est-go]')); if (est0 === est1) throw new Error('Planer-Summe unveraendert');
console.log('errors:', errors.length ? errors : 'keine');
await browser.close();
