/**
 * srcset-Hilfen fuer die Bildvarianten aus scripts/img/variants.ts (<name>-<breite>.avif|webp neben dem JPEG).
 * Nur Bilder unter /img/photos haben Varianten; alles andere bleibt ein einfaches <img>.
 */
export const VARIANT_WIDTHS = [480, 960, 1440] as const;
export const hasVariants = (src: string) => /^\/img\/photos\/[^/]+\.jpe?g$/i.test(src);
const base = (src: string) => src.replace(/\.jpe?g$/i, '');
/** srcset-String fuer ein Format, z. B. "/img/photos/x-480.avif 480w, /img/photos/x-960.avif 960w, ..." */
export const srcsetFor = (src: string, fmt: 'avif' | 'webp', widths: readonly number[] = VARIANT_WIDTHS) =>
  widths.map((w) => `${base(src)}-${w}.${fmt} ${w}w`).join(', ');
/** Bildbox (Runde 29, M10): Breite und Hoehe des Originals aus photos/sizes.json (variants.ts), fuer width/height am img */
import sizesJson from '../../public/img/photos/sizes.json';
const SIZES = sizesJson as Record<string, [number, number]>;
export const imgSize = (src: string): [number, number] | undefined => (hasVariants(src) ? SIZES[base(src).replace(/^\/img\/photos\//, '')] : undefined);
/** Kleines Portraet (44 bis 48 px): 160-px-WebP, sonst das Original */
export const portraitSrc = (src: string) => (/portrait-/.test(src) && existsSync(`${PUBLIC}${base(src)}-160.webp`) ? `${base(src)}-160.webp` : src);
