/**
 * Feste Fakten an einer Stelle (16-PROMPT Abloesung): Preise und der Produktname des Buendels.
 * Die Seitentexte (src/data) enthalten Tokens ({{product}}, {{product.get}}, {{price.monthly}} ...), die
 * content.ts beim Laden je Sprache ersetzt. Ein Namens- oder Preiswechsel ist damit eine Zeile hier.
 * Der Sperrbetrag (992 x 12 = 11.904 Euro) ist gesetzlich vorgegeben und steht in loan-copy.ts.
 */
import type { Locale } from './i18n';
import { PRODUCT } from './ui-strings';

/** Ein Produkt, ein Preis (Jan 20.09.): keine Einrichtungsgebuehr, nur der Monatspreis; die Monatsgebuehr laeuft 12 Monate ab Aktivierung.
 *  Sperrbetrag je Visumtyp: Studierende 992 x 12, Jobsuche und Chancenkarte 1.091 x 12 (die zweite Zahl stand bisher nur in der FAQ). */
export const PRICE = { monthly: 1, /* 21.09.: 1 statt 5 Euro (Kollege) */ setup: 0, deposit: 11904, depositMonthly: 992, depositMonthlyWork: 1091, feeMonths: 12 } as const;
/** Sperrbetrag fuer Jobsuche-Visum und Chancenkarte (12 x 1.091) */
export const PRICE_DEPOSIT_WORK = 12 * PRICE.depositMonthlyWork;
/** Gebuehren eines Jahres (12 Monatsgebuehren, keine Einrichtung) */
export const PRICE_YEAR = PRICE.feeMonths * PRICE.monthly;
/** Gesamtsumme des Kostenblocks auf /blocked-account: Sperrbetrag + 12 Monatsgebuehren */
export const PRICE_TOTAL = PRICE.deposit + PRICE_YEAR;

const num = (n: number) => n.toLocaleString('en-US');
/** Geldbetrag je Sprache: "€5" bzw. "5 یورو" */
export const money = (n: number, locale: Locale = 'en') => (locale === 'en' ? `€${num(n)}` : `${num(n)} یورو`);

const TOKENS = (locale: Locale): Record<string, string> => {
  const p = PRODUCT[locale] ?? PRODUCT.en;
  return {
    '{{product}}': p.name, '{{product.get}}': p.get, '{{product.choose}}': p.choose, '{{product.start}}': p.start,
    '{{price.monthly}}': money(PRICE.monthly, locale), '{{price.setup}}': money(PRICE.setup, locale),
    '{{price.total}}': money(PRICE_TOTAL, locale), '{{price.deposit}}': money(PRICE.deposit, locale),
    '{{price.year}}': money(PRICE_YEAR, locale), '{{price.depositWork}}': money(PRICE_DEPOSIT_WORK, locale), '{{price.depositMonthlyWork}}': money(PRICE.depositMonthlyWork, locale),
  };
};
const TOKEN_RE = /\{\{[a-zA-Z.]+\}\}/g; // auch camelCase-Tokens wie {{price.depositWork}} (20.09.)
export const expandText = (s: string, locale: Locale): string => { const t = TOKENS(locale); return s.replace(TOKEN_RE, (m) => t[m] ?? m); };
/** Alle Strings eines geladenen JSON-Objekts (Seite, Navigation, Artikel) mit den Tokens der Sprache fuellen. */
export function expandTokens<T>(o: T, locale: Locale): T {
  if (typeof o === 'string') return expandText(o, locale) as T;
  if (Array.isArray(o)) return o.map((v) => expandTokens(v, locale)) as T;
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o as Record<string, unknown>).map(([k, v]) => [k, expandTokens(v, locale)])) as T;
  return o;
}
