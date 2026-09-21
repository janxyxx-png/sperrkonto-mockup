/** Foto hinter den Produktobjekten (Buehne Stage.astro und ScrollStory.astro teilen die Motive, Runde 29 M05):
 *  je Objekt ein Motiv der cineastischen Serie, unscharf hinter dem scharfen Objekt. */
export const BACKDROP = {
  card: { src: '/img/photos/cine-berlin-tower-sunset.jpg', pos: '50% 45%' },
  doc: { src: '/img/photos/cine-speicherstadt-night.jpg', pos: '50% 55%' }, /* M10: das Terminal traegt schon das Band auf /blocked-account */
  app: { src: '/img/photos/cine-berlin-dusk.jpg', pos: '50% 60%' },
  cert: { src: '/img/photos/cine-train-sunset.jpg', pos: '50% 50%' },
} as const;
export type StageObject = keyof typeof BACKDROP;
