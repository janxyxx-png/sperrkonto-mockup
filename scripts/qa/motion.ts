// Bewegungs-QA (Runde 29, M01): prueft gegen den statischen Build, dass nichts endlos laeuft (Hausregel in tokens.css:
// "Federn nur nach einem Impuls, nie in Schleife"), dass das Scrollen keine Layoutspruenge ausloest, und dass Kapitel mit
// Zustaenden ([data-story]) bei reduzierter Bewegung in ihrem Endbild stehen. Aufruf:
//   BASE=http://127.0.0.1:4323 bun run scripts/qa/motion.ts [route ...]
import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE ?? 'http://127.0.0.1:4321';
const routes = process.argv.slice(2).filter((a) => a.startsWith('/'));
const ROUTES = routes.length ? routes : ['/', '/blocked-account', '/pricing', '/study-loan'];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox', '--hide-scrollbars'] });
let pass = 0, fail = 0;
const step = (name: string, ok: boolean, detail = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' · ' + detail : ''}`); };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

for (const r of ROUTES) {
  // 1. Mit Bewegung: keine endlose Animation ausser dem Portal-Puls, keine Layoutspruenge beim Scrollen
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries() as (PerformanceEntry & { hadRecentInput?: boolean; value?: number })[]) if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value ?? 0; }).observe({ type: 'layout-shift', buffered: true });
  });
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  await page.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 40000 });
  await page.evaluate(() => document.fonts.ready);
  const h: number = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' as ScrollBehavior }), y); await wait(90); }
  await wait(400);
  const loops: string[] = await page.evaluate(() => document.getAnimations().filter((a) => { const t = a.effect?.getTiming(); const el = (a.effect as KeyframeEffect | null)?.target as Element | null; return t?.iterations === Infinity && !(el && el.matches('.pulse, .pulse *')); }).map((a) => { const el = (a.effect as KeyframeEffect | null)?.target as Element | null; return `${el?.tagName.toLowerCase()}.${[...(el?.classList ?? [])].join('.')} (${(a as CSSAnimation).animationName ?? 'wa'})`; }));
  step(`${r}: keine Endlos-Animation`, loops.length === 0, loops.join(', '));
  const cls: number = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  step(`${r}: Layoutspruenge beim Scrollen`, cls < 0.02, `CLS ${cls.toFixed(4)}`);
  step(`${r}: keine Seitenfehler`, errors.length === 0, errors.join(' | '));
  await page.close();

  // 2. Reduzierte Bewegung: Kapitel mit Zustaenden zeigen ihr Endbild (alle Zeilen sichtbar)
  const rp = await browser.newPage();
  await rp.setViewport({ width: 1440, height: 900 });
  await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rp.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 40000 });
  const hh: number = await rp.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < hh; y += 700) { await rp.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' as ScrollBehavior }), y); await wait(60); }
  await wait(300);
  // Von den drei Status-Pillen des Story-Briefs ist je Stufe genau eine sichtbar; gezaehlt werden die Zeilen, das Etikett und die einzelne Pille
  const hidden: number = await rp.evaluate(() => [...document.querySelectorAll('[data-story] .r-rows div, [data-story] .facts div, [data-story] .r-tag, [data-story] .pill:not(.pills .pill), .usp .r-rows div, .usp .r-tag')].filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length + [...document.querySelectorAll('[data-story] .pills')].filter((p) => ![...p.querySelectorAll('.pill')].some((el) => Number(getComputedStyle(el).opacity) > 0.99)).length);
  const stories: number = await rp.evaluate(() => document.querySelectorAll('[data-story]').length);
  step(`${r}: Endbild bei reduzierter Bewegung`, hidden === 0, `${stories} Kapitel, ${hidden} verborgene Zeilen`);
  await rp.close();
}
// 3. USP-Kapitel auf der Startseite (seit Jan 20.09. Nacht ohne gepinnten Beleg): der Beleg erscheint einmal beim Sichtbarwerden
//    (Zeilen, Strich durch die Zinsen, Etikett), nichts klebt; am Telefon steht er zwischen Behauptung und Frage
if (ROUTES.includes('/')) {
  const sp = await browser.newPage();
  await sp.setViewport({ width: 1440, height: 900 });
  await sp.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 40000 });
  if (await sp.$('.usp .receipt')) {
    await sp.evaluate(() => { const el = document.querySelector('.usp .receipt') as HTMLElement; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35, behavior: 'instant' as ScrollBehavior }); }); await wait(2400);
    const st = await sp.evaluate(() => { const r = document.querySelector('.usp .receipt') as HTMLElement; return { strike: getComputedStyle(r.querySelector('.strike')!, '::after').transform, tag: getComputedStyle(r.querySelector('.r-tag')!).opacity, dim: [...r.querySelectorAll('.r-rows div')].filter((d) => Number(getComputedStyle(d).opacity) < 0.99).length, pos: getComputedStyle(document.querySelector('.usp-object')!).position }; });
    step('/: Beleg erschienen (Strich, Etikett, alle Zeilen), nichts klebt', !/matrix\(0/.test(st.strike) && Number(st.tag) > 0.99 && st.dim === 0 && st.pos !== 'sticky', JSON.stringify(st));
  } else step('/: USP-Beleg vorhanden', false, 'kein .usp .receipt');
  await sp.close();
  const mp = await browser.newPage();
  await mp.setViewport({ width: 390, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mp.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 40000 });
  await mp.evaluate(() => { (document.querySelector('.usp .receipt') as HTMLElement | null)?.scrollIntoView({ block: 'center' }); }); await wait(2400);
  const m = await mp.evaluate(() => { const r = document.querySelector('.usp .receipt') as HTMLElement | null; if (!r) return { dim: -1, order: 'kein Beleg' }; const ys = ['.usp-claim', '.usp-object', '.usp-q', '.usp-paths', '.usp .ctas'].map((q) => (document.querySelector(q) as HTMLElement).getBoundingClientRect().top); return { dim: [...r.querySelectorAll('.r-rows div')].filter((d) => Number(getComputedStyle(d).opacity) < 0.99).length, order: ys.every((y, i) => i === 0 || y > ys[i - 1]) ? 'ok' : ys.map(Math.round).join(',') }; });
  step('/ am Telefon: Beleg zwischen Behauptung und Frage, alle Zeilen sichtbar', m.dim === 0 && m.order === 'ok', JSON.stringify(m));
  await mp.close();
}
// 4. ScrollStory auf /blocked-account (M05): Beat 3 in der Mitte -> Stufe 3 und die Pille "Issued"; am Telefon Stufe 4 (fertig)
if (ROUTES.includes('/blocked-account')) {
  const sp = await browser.newPage();
  await sp.setViewport({ width: 1440, height: 900 });
  await sp.goto(BASE + '/blocked-account', { waitUntil: 'networkidle0', timeout: 40000 });
  if (await sp.$('.story[data-story] [data-beat]')) {
    await sp.evaluate(() => { const b = document.querySelectorAll('.story[data-story] [data-beat]')[2] as HTMLElement; window.scrollTo({ top: b.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4, behavior: 'instant' as ScrollBehavior }); }); await wait(800);
    const st = await sp.evaluate(() => { const r = document.querySelector('.story[data-story]') as HTMLElement; const pill = r.querySelector('.pill[data-s="3"]') as HTMLElement | null; return { stage: r.dataset.stage, pill: pill ? getComputedStyle(pill).opacity : 'none', sticky: getComputedStyle(r.querySelector('.story-obj')!).position }; });
    step('/blocked-account: Beat 3 -> Stufe 3, Pille Issued, Objekt klebt', st.stage === '3' && Number(st.pill) > 0.99 && st.sticky === 'sticky', JSON.stringify(st));
  } else step('/blocked-account: ScrollStory vorhanden', false, 'kein .story[data-story] [data-beat]');
  await sp.close();
  const mp = await browser.newPage();
  await mp.setViewport({ width: 390, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mp.goto(BASE + '/blocked-account', { waitUntil: 'networkidle0', timeout: 40000 });
  const m = await mp.evaluate(() => (document.querySelector('.story[data-story]') as HTMLElement | null)?.dataset.stage ?? 'none');
  step('/blocked-account am Telefon: Stufe 4 (fertiger Brief)', m === '4', `stage ${m}`);
  await mp.close();
}
console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
