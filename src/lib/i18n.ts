/**
 * Sprachen: Englisch (ohne Praefix), Urdu (/ur) und Punjabi in pakistanischer Shahmukhi-Schreibung (/pa).
 * Urdu und Punjabi laufen rechts-nach-links. Uebersetzte Seitendaten liegen unter src/data/<locale>/,
 * fehlt eine Uebersetzung, erscheint der englische Inhalt mit Hinweis.
 */
export const LOCALES = ['en', 'ur', 'pa'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL: ReadonlySet<Locale> = new Set<Locale>(['ur', 'pa']);
export const LOCALE_INFO: Record<Locale, { label: string; short: string; lang: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'English', short: 'EN', lang: 'en', dir: 'ltr' },
  ur: { label: 'اردو', short: 'اردو', lang: 'ur', dir: 'rtl' },
  pa: { label: 'پنجابی', short: 'پنجابی', lang: 'pa-PK', dir: 'rtl' },
};
export const isLocale = (s: string | undefined): s is Locale => !!s && (LOCALES as readonly string[]).includes(s);

/** Pfad in einer Sprache: '/value-package' -> '/ur/value-package', '/' -> '/ur' */
export const localePath = (locale: Locale, path: string): string => {
  if (locale === 'en') return path;
  if (path === '/' || path === '') return `/${locale}`;
  return `/${locale}${path.startsWith('/') ? path : '/' + path}`;
};

/** Sprache und restlichen Pfad aus einem Slug lesen: 'ur/value-package' -> ['ur', 'value-package'] */
export const splitLocale = (slug: string | undefined): [Locale, string] => {
  const parts = (slug ?? '').split('/');
  if (isLocale(parts[0])) return [parts[0], parts.slice(1).join('/')];
  return ['en', slug ?? ''];
};

import { expandText } from './facts';
import { UI } from './ui-strings';
export type UiKey = keyof typeof UI.en;
// Oberflaechentexte koennen Tokens tragen ({{product}}, {{price.monthly}} ...), gefuellt aus facts.ts
export const t = (locale: Locale, key: UiKey): string => expandText((UI[locale] as Record<string, string>)[key] ?? UI.en[key], locale);
