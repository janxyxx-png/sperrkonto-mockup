/** Portraets fuer Stimmen (14-PROMPT Aufgabe 4): Beispielnamen bleiben, Gesicht aus der Fotoserie (public/img/photos,
 *  Quellen in public/img/QUELLEN.md). Zuordnung deterministisch nach Vorname (weiblich/maennlich) und Namenshash. */
const FEMALE = /^(areeba|zainab|fatima|mahnoor|salma|mei-ling|amina|ayesha|andrea|sara|lena|mira|htet)\b/i;
const W = ['/img/photos/portrait-w1.jpg', '/img/photos/portrait-w2.jpg', '/img/photos/portrait-w3.jpg'];
const M = ['/img/photos/portrait-m1.jpg', '/img/photos/portrait-m2.jpg', '/img/photos/portrait-m3.jpg'];
export function portraitFor(author: string): string {
  const name = author.replace(/[؀-ۿ]+/g, '').trim() || author;
  const pool = FEMALE.test(name) || /[ہۃے]\s*$/.test(author) ? W : M;
  let h = 0; for (const ch of author) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

/** Initialen fuer Stimmen (18-NAECHSTES-LEVEL Hebel 2): Stock-Gesichter als Kundenportraets waren der unehrlichste Beleg
 *  der Seite. Aus "Areeba O." wird "AO", aus Urdu-Namen der erste Buchstabe. */
export const initials = (author: string): string => {
  const parts = author.replace(/[.,]/g, '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '·';
};
