import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:4321'; // Port aus .claude/launch.json (preview oder dev)
const args = process.argv.slice(2);
const only = args.filter((a) => !a.startsWith('--'));
const shots = args.includes('--shots');
const widths = args.includes('--mobile-only') ? [375] : args.includes('--desktop-only') ? [1280] : [1280, 375];

const routes = only.length ? only : `/ /study-loan /about-germany /about-germany/german-student-visa /about-germany/best-cities-germany-expats /about-germany/compare-health-insurances /about-germany/tag/visa-for-germany /about-us /accommodation-product /ambassador-program /ambassador-program-terms-conditions /app/dashboard /app/login /app/start /authorities /blocked-account /bonus-tariff-activation /broker-information /careers /current-account /en-in/india-education-loans /general-terms-and-conditions /german-bank-account /german-grade-converter /health-insurance-plus /help /help/contact /insurances /learn-german /legal-notice /library /library/cv-templates-working-germany /library/study-in-germany /mobile-networks-germany /mockup-sitemap /newsletter /opportunity-card /partner-agencies /partner/login /partners /partners/international-payments /partners/statutory-health-insurance /partners/travel-insurance /partners/travel-insurance-plans /power-of-attorney /press /privacy-policy /private-health-insurance-students /refer-a-friend /scholarship /scholarship-terms-conditions /search /stcp /study-in-germany /study-in-germany/admission-requirements /study-in-germany/cities /study-in-germany/scholarships /study-in-germany/study-programs /study-in-germany/universities /study-companion /study-companion/checklist /study-companion/eligibility-checker /study-companion/programdatabase /study-companion/programdatabase/search/heidelberg-university-physics-104916121329 /value-package /visa-free-entry-students-germany /webinars`.split(/\s+/);

const AUDIT = `(() => {
  const W = innerWidth, H = innerHeight;
  const out = [];
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0,3).join('.') : '') + ' "' + (el.textContent || '').trim().replace(/\\s+/g,' ').slice(0, 50) + '"';
  const sec = (el) => { const s = el.closest('section, header, footer, main > *'); return s ? (s.id || s.tagName.toLowerCase() + (s.className ? '.' + String(s.className).split(' ')[0] : '')) : '?'; };
  // 1 horizontal page overflow
  if (document.documentElement.scrollWidth > W + 1) out.push({ k: 'page-overflow-x', d: document.documentElement.scrollWidth - W });
  const all = [...document.querySelectorAll('body *')].filter(vis);
  for (const el of all) {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    // 2 element outside viewport horizontally
    if ((r.right > W + 2 || r.left < -2) && !el.closest('[data-qa-ignore]') && cs.position !== 'fixed') out.push({ k: 'off-viewport', s: sec(el), e: desc(el), l: Math.round(r.left), rt: Math.round(r.right) });
    // 3 clipped text
    if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 2 && el.children.length === 0 && el.textContent.trim()) out.push({ k: 'clipped-text', s: sec(el), e: desc(el), d: el.scrollWidth - el.clientWidth });
    // 7 buttons wrapping to two lines
    if (el.matches('.btn') && r.height > 62 && !el.matches('.btn-link')) out.push({ k: 'btn-wrap', s: sec(el), e: desc(el), h: Math.round(r.height) });
    // headings: single orphan word on the last line? (approx: >1 line and last line < 25% width) skip
    // 5 empty card
    if (el.matches('.card, .feature, .steps li') && !el.textContent.trim()) out.push({ k: 'empty-card', s: sec(el), e: desc(el) });
  }
  // 4 overlapping siblings in flow
  const seen = new Set();
  const inTransformed = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).transform !== 'none') return true; return false; };
  for (const el of all) {
    if (inTransformed(el)) continue;
    const kids = [...el.children].filter((c) => vis(c) && ['static', 'relative'].includes(getComputedStyle(c).position) && getComputedStyle(c).transform === 'none' && !['inline'].includes(getComputedStyle(c).display));
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left), iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 4 && iy > 4) { const key = desc(kids[i]) + '|' + desc(kids[j]); if (!seen.has(key)) { seen.add(key); out.push({ k: 'overlap', s: sec(el), a: desc(kids[i]), b: desc(kids[j]), ix: Math.round(ix), iy: Math.round(iy) }); } }
    }
  }
  // 12 consecutive duplicate blocks
  for (const el of all) { const kids = [...el.children]; for (let i = 1; i < kids.length; i++) { const t = kids[i].textContent.trim(); if (t && t.length > 3 && t === kids[i-1].textContent.trim() && kids[i].tagName === kids[i-1].tagName && vis(kids[i])) out.push({ k: 'dup-sibling', s: sec(el), e: desc(kids[i]) }); } }
  // leftover brand / placeholders
  const body = document.body.innerText;
  if (/expatrio/i.test(body)) out.push({ k: 'brand-leak' });
  const ph = body.match(/\\[[A-Za-z ]+\\]/g); if (ph) out.push({ k: 'bracket-placeholders', n: ph.length, ex: [...new Set(ph)].slice(0,5) });
  // empty headings / paragraphs
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li')) if (vis(el) && !el.textContent.trim() && !el.querySelector('svg,img,span')) out.push({ k: 'empty-text-el', s: sec(el), e: desc(el) });
  // tiny sections
  for (const s of document.querySelectorAll('main section')) { const r = s.getBoundingClientRect(); if (r.height < 24) out.push({ k: 'tiny-section', s: s.id }); }
  return { h: document.documentElement.scrollHeight, out };
})()`;

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const results: Record<string, any> = {};
for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: shots ? 0.5 : 1 });
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => errors.push('pageerror ' + String(e).slice(0, 160)));
  for (const r of routes) {
    errors.length = 0;
    try {
      await page.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important} .rise,[data-rv]{opacity:1!important;transform:none!important}' });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((res) => setTimeout(res, 150));
      const res: any = await page.evaluate(AUDIT);
      results[`${w} ${r}`] = { h: res.h, findings: res.out, errors: [...errors] };
      if (shots && w === 1280) { const name = (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '__')).slice(0, 80); await page.screenshot({ path: `shots/${name}.png`, fullPage: true }); }
    } catch (e) { results[`${w} ${r}`] = { error: String(e).slice(0, 200) }; }
  }
  await page.close();
}
await browser.close();
writeFileSync('results.json', JSON.stringify(results, null, 1));
// summary
for (const [k, v] of Object.entries(results)) {
  const f = (v as any).findings || []; const e = (v as any).errors || [];
  if ((v as any).error) { console.log(k, 'ERROR', (v as any).error); continue; }
  if (f.length || e.length) console.log(k, `h=${(v as any).h}`, JSON.stringify(f).slice(0, 1500), e.length ? 'CONSOLE:' + e.join(' | ').slice(0, 300) : '');
}
console.log('pages:', Object.keys(results).length);
