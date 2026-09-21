/**
 * Zugriff auf die Inhalte in src/data (Marketing-Seiten, Blog, Programme, Navigation).
 * Alle Links in den Daten sind bereits interne Routen; route() bleibt als Absicherung.
 */
export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; html: string; tip?: boolean }
  | { type: 'list'; ordered: boolean; items: { html: string; mark?: 'ok' | 'no' }[] }
  | { type: 'button'; text: string; href: string; style?: string }
  | { type: 'image'; src: string; alt: string; illo?: string; photo?: string }
  | { type: 'embed'; src: string }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | { type: 'pricing'; title: string; subtitle: string; badge?: string; features: { html: string; mark?: 'ok' | 'no' | 'label' }[]; cta?: { text: string; href: string } }
  | { type: 'quote'; text: string; author: string; role: string };

export interface Section { id: number; hint: string; background: boolean; blocks: Block[]; anchor?: string; photo?: string; figure?: string; collapse?: boolean; more?: string }
export interface Page { slug: string; path: string; sourceUrl?: string; title: string; description: string; sections: Section[] }
export interface Post { slug: string; sourceUrl?: string; title: string; description: string; date: string; tags: string[]; image: string; html: string }
export interface Nav {
  topbar: { label: string; href: string }[];
  menu: { label: string; href?: string; children: { label: string; href: string; desc?: string }[] }[];
  headerCta: { label: string; href: string };
  footerCols: { heading: string; links: { label: string; href: string }[] }[];
  legal: { label: string; href: string }[];
  copyright: string;
  languages: string[];
}

import { type Locale, localePath, DEFAULT_LOCALE } from './i18n';
import { expandTokens } from './facts';

const pageFiles = import.meta.glob<Page>('../data/pages/*.json', { eager: true, import: 'default' });
// Uebersetzte Seiten: src/data/<locale>/pages/<slug>.json, gleiche Struktur wie das englische Original
const localePageFiles = import.meta.glob<Page>('../data/*/pages/*.json', { eager: true, import: 'default' });
const postFiles = import.meta.glob<Post>('../data/blog/*.json', { eager: true, import: 'default' });
const navFiles = import.meta.glob<Nav>('../data/*/nav.json', { eager: true, import: 'default' });
import navJson from '../data/nav.json';

export const BRAND = 'EC Assets';
export const brandText = (s: string) => s;

export const nav = expandTokens(navJson as Nav, DEFAULT_LOCALE);
/** Navigation in einer Sprache; ohne Uebersetzung die englische. Tokens (Produktname, Preise) werden beim Laden gefuellt. */
export const navFor = (locale: Locale): Nav => { const n = navFiles[`../data/${locale}/nav.json`] as Nav | undefined; return n ? expandTokens(n, locale) : nav; };
// Eine Sektion, die nur aus einer Ueberschrift besteht (im Original der Titel ueber einem Slider), wird mit der
// folgenden Sektion zusammengelegt, wenn diese selbst ohne H2 beginnt. Reine Widget-Titel ("What our customers say") bleiben.
const mergeHeadingOnly = (sections: Section[], ref: Section[] = sections): Section[] => {
  const out: Section[] = [];
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i], n = sections[i + 1], r = ref[i] ?? s;
    const headingOnly = s.blocks.length === 1 && s.blocks[0].type === 'heading' && s.blocks[0].level <= 3;
    const widgetTitle = headingOnly && /review|customer|rating|trust|say|quiz|calculat|check/i.test((r.blocks[0] as { text: string }).text);
    if (headingOnly && !widgetTitle && n && !(n.blocks[0]?.type === 'heading' && n.blocks[0].level <= 2)) {
      out.push({ ...n, blocks: [{ ...s.blocks[0], level: 2 } as Block, ...n.blocks], background: s.background || n.background });
      i++;
    } else out.push(s);
  }
  return out;
};
// Produktname und Preise stehen in den Daten als Tokens ({{product}}, {{price.monthly}} ...) und werden je Sprache gefuellt (facts.ts)
const rawPages = Object.values(pageFiles).filter((p) => p.sections.length).map((p) => expandTokens(p, DEFAULT_LOCALE));
const prep = (p: Page, ref?: Page): Page => ({ ...p, sections: mergeHeadingOnly(p.sections, ref?.sections) });
export const pages: Page[] = rawPages.map((p) => prep(p));
const localePages: Record<string, Page> = Object.fromEntries(Object.entries(localePageFiles).map(([k, p]) => { const m = k.match(/\.\.\/data\/(\w+)\/pages\/(.+)\.json$/)!; return [`${m[1]}/${m[2]}`, prep(expandTokens(p, m[1] as Locale), rawPages.find((e) => e.slug === p.slug))]; }));
/** Seite in einer Sprache; `translated` sagt, ob es die Uebersetzung gibt oder das englische Original erscheint. */
export const pageIn = (slug: string, locale: Locale): { page: Page; translated: boolean } => {
  const en = pages.find((p) => p.slug === slug)!;
  if (locale === DEFAULT_LOCALE) return { page: en, translated: true };
  const tr = localePages[`${locale}/${slug.replace(/\//g, '__')}`];
  return tr ? { page: tr, translated: true } : { page: en, translated: false };
};
export const translatedSlugs = (locale: Locale): Set<string> => new Set(Object.keys(localePages).filter((k) => k.startsWith(locale + '/')).map((k) => k.slice(locale.length + 1)));
export const posts: Post[] = Object.values(postFiles).map((p) => expandTokens(p, DEFAULT_LOCALE)).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
// Uebersetzte Guides (18-NAECHSTES-LEVEL Hebel 3): src/data/<locale>/blog/<slug>.json, gleiche Felder wie das Original
const localePostFiles = import.meta.glob<Post>('../data/*/blog/*.json', { eager: true, import: 'default' });
const localePosts: Record<string, Post> = Object.fromEntries(Object.entries(localePostFiles).map(([k, p]) => { const m = k.match(/\.\.\/data\/(\w+)\/blog\/(.+)\.json$/)!; return [`${m[1]}/${m[2]}`, expandTokens(p, m[1] as Locale)]; }));
/** Guide in einer Sprache; ohne Uebersetzung das englische Original mit translated=false */
export const postIn = (slug: string, locale: Locale): { post: Post; translated: boolean } => {
  const en = posts.find((p) => p.slug === slug)!;
  if (locale === DEFAULT_LOCALE) return { post: en, translated: true };
  const tr = localePosts[`${locale}/${slug}`];
  return tr ? { post: { ...en, ...tr }, translated: true } : { post: en, translated: false };
};
/** Alle Guides mit Titel und Teaser in der Sprache, soweit uebersetzt (fuer Listen und Karten) */
export const postsIn = (locale: Locale): Post[] => posts.map((p) => postIn(p.slug, locale).post);
/** Lesezeit in Minuten aus dem Artikeltext (200 Woerter je Minute); ersetzt die Vorlagendaten von 2024/2025 in Karten und Kopf */
export const readMinutes = (post: Post): number => Math.max(1, Math.round(post.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));


/** Seiten, die im Mockup durch eigene Templates ersetzt werden (nicht generisch rendern). */
export const OVERRIDDEN = new Set(['guides', 'home']);

/* Zugriffshelfer fuer von Hand komponierte Seiten: Bloecke einer Sektion nach Typ holen,
   damit die Texte aus den gescrapten Daten kommen, die Anordnung aber entworfen ist. */
export const pageBySlug = (slug: string, locale: Locale = DEFAULT_LOCALE): Page => pageIn(slug, locale).page;
export const sectionBlocks = (page: Page, id: number): Block[] => page.sections.find((s) => s.id === id)?.blocks ?? [];
export const ofType = <T extends Block['type']>(blocks: Block[], type: T) => blocks.filter((b): b is Extract<Block, { type: T }> => b.type === type);
export const stripTags = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
/** "<strong>Titel</strong>"-Absaetze sind Kartentitel; gibt Paare (Titel, Text) in Reihenfolge. */
export function titledPairs(blocks: Block[]): { title: string; text: string }[] {
  const out: { title: string; text: string }[] = [];
  let cur: { title: string; text: string } | null = null;
  for (const b of blocks) {
    if (b.type !== 'paragraph') continue;
    if (/^<strong>[^<]+<\/strong>$/.test(b.html.trim())) { cur = { title: stripTags(b.html), text: '' }; out.push(cur); }
    else if (cur && !cur.text) cur.text = b.html;
  }
  return out;
}

/** Interne Links bekommen das Sprachpraefix; externe URLs, Anker und interne Mockup-Seiten bleiben. */
export function route(href: string | undefined, locale: Locale = DEFAULT_LOCALE): string {
  if (!href) return '#';
  // "/#anker" aus dem Scrape zeigte auf die Startseite; gemeint ist der Anker auf der eigenen Seite (09-PROMPT A2)
  if (href.startsWith('/#')) return href.slice(1).toLowerCase();
  if (locale === DEFAULT_LOCALE || !href.startsWith('/') || href.startsWith('/mockup-') || href.startsWith('/fonts/')) return href;
  return localePath(locale, href);
}

export function rewriteHtml(html: string, locale: Locale = DEFAULT_LOCALE): string {
  return html.replace(/href="([^"]+)"/g, (_, h) => `href="${route(h, locale)}"`).replace(/<!--[\s\S]*?-->/g, '');
}

export const tagSlug = (t: string) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** Anzeigename einer Guide-Kategorie je Sprache; die Adresse bleibt der englische Slug. Ohne Eintrag der englische Name. */
const TAG_LABELS: Record<string, Record<string, string>> = {
  ur: { 'Studying in Germany': 'جرمنی میں تعلیم', 'Working in Germany': 'جرمنی میں کام', 'German Cities': 'جرمن شہر', 'Study Programs in Germany': 'جرمنی میں تعلیمی پروگرام', 'Living in Germany': 'جرمنی میں زندگی', 'German Universities': 'جرمن یونیورسٹیاں', 'Admissions & Application': 'داخلہ اور درخواست', 'Funding & Scholarships': 'فنڈنگ اور اسکالرشپ', 'Germany vs. other Study Destination': 'جرمنی بمقابلہ دیگر ممالک', 'Health Insurance in Germany': 'جرمنی میں ہیلتھ انشورنس', 'News': 'خبریں', 'Visa for Germany': 'جرمنی کا ویزا', 'German Business Culture': 'جرمن کاروباری ثقافت' },
  pa: { 'Studying in Germany': 'جرمنی وچ پڑھائی', 'Working in Germany': 'جرمنی وچ کم', 'German Cities': 'جرمن شہر', 'Study Programs in Germany': 'جرمنی وچ تعلیمی پروگرام', 'Living in Germany': 'جرمنی وچ زندگی', 'German Universities': 'جرمن یونیورسٹیاں', 'Admissions & Application': 'داخلہ تے درخواست', 'Funding & Scholarships': 'فنڈنگ تے سکالرشپ', 'Germany vs. other Study Destination': 'جرمنی بمقابلہ ہور ملک', 'Health Insurance in Germany': 'جرمنی وچ ہیلتھ انشورنس', 'News': 'خبراں', 'Visa for Germany': 'جرمنی دا ویزا', 'German Business Culture': 'جرمن کاروباری ثقافت' },
};
export const tagLabel = (tag: string, locale: Locale): string => TAG_LABELS[locale]?.[tag] ?? tag;
