/** Zulassungsliste fuer den Foto-Hero (08-SPEC 4.2): nur diese Seiten bekommen Foto und transparenten Header.
 *  Alle anderen Datenseiten behalten den hellen Hero. Bilder unter public/img/photos, Quellen in QUELLEN.md dort.
 *  pos = object-position (Person rechts, Text links). In RTL spiegelt PhotoHero das Bild, damit die Komposition
 *  zum rechts stehenden Text passt; rtl.flip=false schaltet das ab (z. B. sichtbare Logos), rtl.pos setzt dann den Ausschnitt. */
/** zoom: Motiv vergroessern (transform-origin = pos), wenn die Person sonst hinter der Headline steht */
export interface HeroPhoto { src: string; pos: string; alt: string; flip?: boolean; zoom?: number; mobilePos?: string; rtl?: { flip?: boolean; pos?: string; origin?: string } }
export const HEROES: Record<string, HeroPhoto> = {
  // Seit 18.09. abends (Jan: "cineastischer"): Daemmerung, Gegenlicht, Stadt; Quellen in public/img/QUELLEN.md
  'home': { src: '/img/photos/cine-rooftop-dusk.jpg', pos: '30% 40%', alt: '', flip: true, rtl: { flip: true, pos: '100% 40%' } }, // Paar sitzt mittig im Motiv; gespiegelt und mit pos rechts vom Text (LTR) bzw. links vom Text (RTL)
  'blocked-account': { src: '/img/photos/cine-karachi-night-portrait.jpg', pos: '72% 30%', alt: '' },
  'german-bank-account': { src: '/img/photos/cine-window-golden-man.jpg', pos: '62% 30%', alt: '' },
  'health-insurance': { src: '/img/photos/cine-city-night-woman.jpg', pos: '0% 30%', alt: '', zoom: 1.45, mobilePos: '62% 30%', rtl: { pos: '0% 30%', origin: '47% 30%' } }, // Telefon: ohne Zoom, Gesicht im Ausschnitt // Gesicht sass mittig hinter der Headline, per Zoom nach rechts geschoben; RTL: Spiegelung und Zoom um 42 % setzen das Gesicht links vom Text
  'complete-setup': { src: '/img/photos/cine-plane-window-dusk.jpg', pos: '60% 40%', alt: '' },
  'study-loan': { src: '/img/photos/cine-dusk-skyline-man.jpg', pos: '50% 30%', alt: '' },
};
export const heroFor = (slug: string): HeroPhoto | undefined => HEROES[slug];
