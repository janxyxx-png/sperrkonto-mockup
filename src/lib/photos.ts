/** Fotos der Serie (public/img/photos) nach Thema zuordnen; Quellen und Lizenz je Datei in public/img/QUELLEN.md.
 *  Seit 18.09. spaet (Jan: "cineastischer", Rundgang): Pools aus der cineastischen Serie (cine-*) plus wenige stimmungsvolle
 *  Motive der Tagesserie. Hero- und Band-Motive der Produktseiten stehen nicht in den Pools.
 *  Jan 18.09. 21:30 ("in den Guides wiederholen sich Bilder oder sind abgeschnitten"): Artikelfotos werden nicht mehr per
 *  Hash gewuerfelt, sondern ueber alle Artikel verteilt (photoForPost: das am wenigsten benutzte Motiv des Themen-Pools,
 *  nie dasselbe wie in den zwei Artikeln davor). Jedes Motiv hat einen Bildschwerpunkt (FOCUS) fuer den Zuschnitt, und
 *  Hochformate stehen nicht in den Artikel-Pools (21:9-Kopf und 16:9-Karte schneiden sie ab). */
import type { Post } from './content';
import { posts } from './content';
const P = (n: string) => `/img/photos/${n}.jpg`;

/** Bildschwerpunkt (object-position) je Motiv: wo Kopf oder Hauptmotiv sitzt. Fehlt ein Eintrag, gilt 50% 40%. */
export const FOCUS: Record<string, string> = {
  [P('cine-rooftop-skyline-man')]: '50% 35%', [P('cine-golden-city-woman')]: '50% 60%', [P('cine-car-night-woman')]: '50% 40%',
  [P('cine-rooftop-friends-sunset')]: '50% 55%', [P('cine-rooftop-couple-night')]: '50% 60%', [P('cine-ledge-night-man')]: '50% 45%',
  [P('cine-railing-night-woman')]: '50% 35%', [P('cine-dusk-silhouette')]: '50% 30%', [P('cine-berlin-dusk')]: '50% 55%',
  [P('cine-speicherstadt-night')]: '50% 50%', [P('cine-train-sunset')]: '50% 50%', [P('cine-rooftop-night-woman')]: '50% 78%',
  [P('cine-golden-profile-man')]: '50% 38%', [P('library-old')]: '50% 55%', [P('cine-bridge-fog-man')]: '50% 50%',
  [P('cine-window-golden-man')]: '55% 35%', [P('cine-dusk-skyline-man')]: '50% 50%', [P('cine-plane-wing')]: '50% 45%',
  [P('cine-airport-silhouettes')]: '50% 50%', [P('cine-hiker-clouds')]: '50% 50%', [P('sunlit-window')]: '50% 40%',
  [P('berlin-street')]: '50% 50%', [P('cine-terminal-golden')]: '50% 60%', [P('cine-berlin-tower-sunset')]: '50% 45%',
  [P('cine-elbphilharmonie-blue')]: '50% 35%', [P('cine-phone-night')]: '50% 50%', [P('cine-train-notebook')]: '50% 50%',
  [P('cine-train-window-camera')]: '50% 50%', [P('cine-city-night-woman')]: '68% 35%', [P('cine-karachi-night-portrait')]: '72% 30%',
  [P('cine-plane-window-dusk')]: '60% 40%', [P('cine-rooftop-fog-woman')]: '50% 60%', [P('cine-silhouette-sun')]: '50% 40%',
  [P('cine-rooftop-dusk')]: '30% 40%', [P('cine-dusk-friends')]: '50% 40%', [P('desk-bokeh')]: '50% 50%', [P('window-headphones')]: '50% 45%',
};
export const focusFor = (src: string) => FOCUS[src] ?? '50% 40%';

// Querformate fuer Artikel (Kopf 2:1, Karte 16:9); Hochformate nur in den Pools fuer Zweispalter und Galerie
const CITY = [P('cine-berlin-dusk'), P('cine-speicherstadt-night'), P('cine-rooftop-couple-night'), P('cine-ledge-night-man'), P('berlin-street'), P('cine-berlin-tower-sunset')];
const STUDY = [P('cine-train-sunset'), P('cine-rooftop-night-woman'), P('library-old'), P('cine-rooftop-friends-sunset'), P('cine-train-notebook'), P('window-headphones')];
const WORK = [P('cine-bridge-fog-man'), P('cine-ledge-night-man'), P('cine-window-golden-man'), P('cine-berlin-dusk'), P('cine-speicherstadt-night'), P('desk-bokeh')];
const MOVE = [P('cine-airport-silhouettes'), P('cine-rooftop-friends-sunset'), P('cine-hiker-clouds'), P('sunlit-window'), P('cine-rooftop-couple-night'), P('cine-terminal-golden'), P('cine-train-sunset')];
// Zweispalter und Galerie (4:3, 5:4, 1:1): hier duerfen auch Hochformate stehen
const TALL = [P('cine-rooftop-skyline-man'), P('cine-golden-city-woman'), P('cine-car-night-woman'), P('cine-railing-night-woman'), P('cine-dusk-silhouette'), P('cine-golden-profile-man'), P('cine-dusk-skyline-man'), P('cine-plane-wing')];
const SETS: [RegExp, string[]][] = [
  [/berlin|munich|hamburg|frankfurt|city|cities|accommodation|housing|rent|flat|apartment|living|arriv|network|sim|phone|groceries|food|prices/i, CITY],
  [/study|universit|programme|program|scholarship|admission|degree|master|bachelor|semester|daad|grade|language|ielts|learn|studienkolleg/i, STUDY],
  [/work|job|career|opportunity|skilled|salary|employ|interview|business|partner|agenc|labour|cv/i, WORK],
  [/visa|blocked|insurance|bank|money|finance|loan|deposit|refus|permit|checklist|guide|download|story|video|team|office/i, MOVE],
];
const poolFor = (text: string) => { for (const [re, pool] of SETS) if (re.test(text)) return pool; return MOVE; };

/** Freie Zuordnung (Zweispalter, Galerie, Standbilder): deterministisch nach Seed, Hoch- und Querformate gemischt. */
export function photoFor(text: string, seed = text): string {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const pool = [...poolFor(text), ...TALL.slice(0, 4)];
  return pool[h % pool.length];
}

// Artikelfotos: einmal ueber alle Artikel in Indexreihenfolge (neueste zuerst) verteilt
const assigned = new Map<string, string>();
{
  const used = new Map<string, number>(); const last: string[] = [];
  for (const p of posts) {
    const pool = poolFor(p.title + ' ' + p.tags.join(' '));
    const pick = [...pool].sort((a, b) => (used.get(a) ?? 0) - (used.get(b) ?? 0) || pool.indexOf(a) - pool.indexOf(b)).find((x) => !last.includes(x)) ?? pool[0];
    assigned.set(p.slug, pick); used.set(pick, (used.get(pick) ?? 0) + 1); last.push(pick); if (last.length > 2) last.shift();
  }
}
export const photoForPost = (post: Pick<Post, 'slug' | 'title' | 'tags'>): string => assigned.get(post.slug) ?? photoFor(post.title + ' ' + post.tags.join(' '), post.slug);

/** Mehrere Artikel nebeneinander (verwandte Artikel, Startseite): keine zwei gleichen Motive in einer Reihe, das Kopfbild ausgenommen. */
export function photosForPosts(list: Pick<Post, 'slug' | 'title' | 'tags'>[], exclude: string[] = []): string[] {
  const taken = new Set(exclude); const out: string[] = [];
  for (const p of list) {
    let pick = photoForPost(p);
    if (taken.has(pick)) { const pool = poolFor(p.title + ' ' + p.tags.join(' ')); pick = pool.find((x) => !taken.has(x)) ?? [...CITY, ...STUDY, ...WORK, ...MOVE].find((x) => !taken.has(x)) ?? pick; }
    taken.add(pick); out.push(pick);
  }
  return out;
}
