import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'fs';
// shoot.ts [--w=1280] [--chunk=1800] [--scale=0.5] route...
const BASE = process.env.BASE ?? 'http://127.0.0.1:4321'; // Port aus .claude/launch.json (preview oder dev)
const args = process.argv.slice(2);
const opt = (n: string, d: number) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? Number(a.split('=')[1]) : d; };
const W = opt('w', 1280), CH = opt('chunk', 1800), SC = opt('scale', 0.5);
const routes = args.filter((a) => !a.startsWith('--'));
const dir = `chunks${W}`; mkdirSync(dir, { recursive: true }); for (const r of routes) { const n = (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "__")).slice(0, 60); for (const f of (await import("fs")).readdirSync(dir)) if (f.startsWith(n + "_")) rmSync(`${dir}/${f}`); }
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); // sonst bleiben [data-rv]-Karten im Bild leer
await page.setViewport({ width: W, height: 900, deviceScaleFactor: SC });
for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important} .rise,[data-rv]{opacity:1!important;transform:none!important} astro-dev-toolbar{display:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((res) => setTimeout(res, 150));
  const h: number = await page.evaluate(() => document.documentElement.scrollHeight);
  const name = (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '__')).slice(0, 60);
  let n = 0;
  for (let y = 0; y < h; y += CH) { await page.screenshot({ path: `${dir}/${name}_${n}.png`, clip: { x: 0, y, width: W, height: Math.min(CH, h - y) }, captureBeyondViewport: true }); n++; }
  console.log(name, 'h=' + h, 'chunks=' + n);
}
await browser.close();
