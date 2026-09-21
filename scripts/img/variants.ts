/**
 * Bildvarianten fuer srcset (18-NAECHSTES-LEVEL, Hebel 7): aus jedem JPEG in public/img/photos und public/img/hero
 * entstehen AVIF und WebP in 480, 960 und 1440 px Breite (Portraets: 160 px WebP) neben dem Original.
 * Laeuft mit `bun scripts/img/variants.ts` (auch als prebuild); vorhandene, juengere Varianten werden uebersprungen.
 * Schmalere Originale bekommen trotzdem alle Namen (withoutEnlargement: die Datei ist dann so breit wie das Original),
 * damit jedes srcset-Ziel existiert.
 * Die Komponenten (Pic.astro, lib/img.ts) verweisen auf diese Dateinamen: <name>-<breite>.<avif|webp>.
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../public/img/', import.meta.url));   // fileURLToPath: Leerzeichen im Pfad
const SETS: { dir: string; widths: number[]; formats: ('avif' | 'webp')[] }[] = [
  { dir: 'photos', widths: [480, 960, 1440], formats: ['avif', 'webp'] },
  { dir: 'hero', widths: [480, 960, 1440], formats: ['avif', 'webp'] },
];
let made = 0, skipped = 0;
// Bildboxen (Runde 29, M10): Breite und Hoehe jedes Originals in photos/sizes.json, damit Pic.astro width/height setzen kann (kein Layoutsprung)
const sizes: Record<string, [number, number]> = {};
for (const set of SETS) {
  const dir = join(ROOT, set.dir);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(f) || /-\d+\.(avif|webp)$/.test(f)) continue;
    const src = join(dir, f); const base = f.replace(/\.(jpe?g|png)$/i, '');
    const meta = await sharp(src).metadata(); const srcTime = statSync(src).mtimeMs;
    if (set.dir === 'photos' && meta.width && meta.height) sizes[base] = [meta.width, meta.height];
    const widths = /^portrait-/.test(base) ? [160] : set.widths;   // Portraets werden nur 44 bis 48 px gross gezeigt
    for (const w of widths) {
      for (const fmt of set.formats) {
        const out = join(dir, `${base}-${w}.${fmt}`);
        if (existsSync(out) && statSync(out).mtimeMs > srcTime) { skipped++; continue; }
        const img = sharp(src).resize({ width: w, withoutEnlargement: true });
        await (fmt === 'avif' ? img.avif({ quality: 50, effort: 4 }) : img.webp({ quality: 74 })).toFile(out);
        made++;
      }
    }
  }
}
writeFileSync(join(ROOT, 'photos', 'sizes.json'), JSON.stringify(sizes) + '\n');
console.log(`Varianten: ${made} erzeugt, ${skipped} uebersprungen, ${Object.keys(sizes).length} Groessen`);
