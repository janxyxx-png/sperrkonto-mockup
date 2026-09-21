/**
 * Weiterleitungen fuer geloeschte und umbenannte Routen (16-PROMPT G). Eine Liste, zwei Abnehmer:
 * astro.config.mjs (statische Weiterleitungsseiten im Build) und public/_redirects (Hosting-Regeln, mit Wildcards).
 * Ziel ist jeweils die naechstliegende verbleibende Seite; alle drei Sprachen.
 */
import { readdirSync, readFileSync } from 'node:fs';
const LOCALES = ['', '/ur', '/pa'];
// Pfad ueber process.cwd(): import.meta.url zeigt im Build auf dist/pages/, nicht auf das Projekt (Build brach mit ENOENT ab)
const BLOG = new URL('src/data/blog/', `file://${process.cwd()}/`);
const posts = readdirSync(BLOG).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(new URL(f, BLOG), 'utf8')));
const tagSlug = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tags = [...new Set(posts.flatMap((p) => p.tags))];
for (const t of ['Living in Germany', 'Studying in Germany', 'Working in Germany', 'News', 'German Business Culture', 'Visa for Germany']) if (!tags.includes(t)) tags.push(t);

/** Exakte Routen: alt -> neu (ohne Sprachpraefix) */
export const EXACT = {
  '/value-package': '/complete-setup', '/health-insurance-plus': '/health-insurance',
  '/study-loan/check': '/app/start', // Kredit-Check ist der Schritt "I need financing" im Funnel (25-EIN-PRODUKT-ZWEI-WEGE, 20.09.)
  '/stcp': '/package-terms', '/power-of-attorney': '/payment-authorisation',
  '/visa-free-entry-students-germany': '/guides/german-student-visa', // Zielgruppe ist Pakistan, visafreie Einreise gibt es dort nicht (Jan 19.09.)
  '/private-health-insurance-students': '/health-insurance#private-cover', '/bonus-tariff-activation': '/health-insurance#bonus-tariff',
  '/about-germany': '/guides', '/current-account': '/guides/bank-accounts-for-newcomers',
  '/scholarship': '/', '/scholarship-terms-conditions': '/', '/scholarship-instagram-comp-terms-conditions': '/',
  '/ambassador-program': '/', '/ambassador-program-terms-conditions': '/', '/refer-a-friend': '/', '/special-terms-and-conditions-refer-friends-vp': '/',
  '/german-grade-converter': '/guides', '/learn-german': '/guides', '/mobile-networks-germany': '/guides', '/accommodation-product': '/guides', '/accommodation': '/guides',
  '/insurances': '/health-insurance', '/opportunity-card': '/guides', '/pk/education-loans': '/study-loan', '/newsletter': '/guides',
  '/study-companion': '/guides', '/study-companion/checklist': '/guides', '/study-companion/eligibility-checker': '/guides', '/study-companion/programdatabase': '/guides',
  '/study-in-germany': '/guides', '/study-in-germany/admission-requirements': '/guides', '/study-in-germany/cities': '/guides', '/study-in-germany/scholarships': '/guides',
  '/study-in-germany/study-programs': '/guides', '/study-in-germany/universities': '/guides', '/study-eligibility-checker': '/guides', '/webinars': '/guides',
  '/library': '/guides', '/library/cv-templates-working-germany': '/guides', '/library/germany-arrival-checklist': '/guides', '/library/letter-of-motivation': '/guides',
  '/library/study-in-germany': '/guides', '/library/visa-checklist': '/guides',
  ...Object.fromEntries(posts.map((p) => [`/about-germany/${p.slug}`, `/guides/${p.slug}`])),
  ...Object.fromEntries(tags.map((t) => [`/about-germany/tag/${tagSlug(t)}`, `/guides/tag/${tagSlug(t)}`])),
};
/** Wildcards fuer das Hosting (public/_redirects): ganze Bereiche */
export const WILDCARDS = [['/study-in-germany/*', '/guides'], ['/library/*', '/guides'], ['/study-companion/*', '/guides'], ['/scholarship*', '/'], ['/about-germany/*', '/guides/:splat']];

/** Fuer astro.config: Sprachpraefixe davor, Anker bleiben erhalten */
export const astroRedirects = () => Object.fromEntries(LOCALES.flatMap((l) => Object.entries(EXACT).map(([a, b]) => [l + a, b === '/' ? (l || '/') : l + b])));
export const redirectsFile = () => [
  '# Weiterleitungen fuer geloeschte und umbenannte Routen (16-PROMPT G), generiert aus redirects.mjs',
  ...LOCALES.flatMap((l) => Object.entries(EXACT).map(([a, b]) => `${l}${a}  ${b === '/' ? (l || '/') : l + b}  301`)),
  ...LOCALES.flatMap((l) => WILDCARDS.map(([a, b]) => `${l}${a}  ${b.startsWith('/') && b !== '/' ? l + b : (l || '/')}  301`)),
].join('\n') + '\n';
