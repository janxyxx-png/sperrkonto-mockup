/**
 * Zurueckhaltende Bewegung: jeder Abschnittsblock blendet beim Scrollen einmalig ein (8 px, 0,5 s), als Ganzes,
 * ohne Versatz zwischen Karten. Header: Kante ab 8 px Scroll; ueber dem Foto-Hero (data-over-photo) ist er nur
 * ganz oben transparent und wird ab 8 px ebenfalls weiss. Mobil-CTA (unter 800 px) erscheint, wenn der Hero-CTA aus dem
 * Bild ist, und verschwindet, solange ein Abschnitts-CTA ([data-cta-anchor]) sichtbar ist.
 * Runde 29 (M01): Hausregel in tokens.css. Exportierte Primitive fuer Seitenskripte: inView (ein Beobachter mit
 * Mittelband) und beats (ein Kapitel schreibt data-stage 1..n, je nachdem welcher Beat die Bildschirmmitte kreuzt).
 * Die Zeilen-Bestaetigung des Telefons (phoneFlip) ist weg: Objekte zeigen Zustaende, keine Ambient-Bewegung.
 * Mobil (html.m, gesetzt im Head unter 560 px): Karten-Faltungen (details.card-more) starten zugeklappt; die Leiste
 * verschwindet auch ueber dem Footer.
 * Ohne JS bleibt alles sichtbar, bei "prefers-reduced-motion" bleiben nur die Zustandswechsel des Headers.
 * Laeuft beim Laden und nach jedem Seitenwechsel des ClientRouters (astro:page-load).
 */
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollBound = false;

const headerState = () => {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;
  // Auch ueber dem Foto-Hero wird der Header ab wenigen Pixeln weiss: sonst schiebt sich die weisse Hero-Headline
  // unter die transparente, ebenfalls weisse Navigation und beides wird unlesbar.
  const scrolled = window.scrollY > 8;
  header.classList.toggle('scrolled', scrolled);
  // Toolbar-Farbe des Telefons (M10) folgt dem Header: Tinte ueber dem Foto, weiss sobald der Header weiss ist
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta && header.dataset.overPhoto) meta.content = scrolled ? '#ffffff' : '#0b0f19';
};

const bindHeader = () => {
  if (scrollBound) return;
  scrollBound = true;
  addEventListener('scroll', headerState, { passive: true });
  addEventListener('resize', headerState);
  // Aus dem Seiten-Cache zurueck oder nach dem Tausch des ClientRouters steht die Seite oben, der Zustand muss folgen (27)
  addEventListener('pageshow', headerState);
  document.addEventListener('astro:after-swap', headerState);
};

const reveal = () => {
  if (reduce() || !('IntersectionObserver' in window)) return;
  const targets = [...document.querySelectorAll<HTMLElement>('main section:not(.hero):not(.phero) > .container > *')].filter((el) => !el.hasAttribute('data-rv'));
  if (targets.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
  const vh = window.innerHeight;
  for (const el of targets) {
    el.setAttribute('data-rv', '');
    if (el.getBoundingClientRect().top < vh) { el.classList.add('in'); continue; }
    io.observe(el);
  }
  setTimeout(() => targets.forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in'); }), 2500);
};

const mobileCta = () => {
  const bar = document.querySelector<HTMLElement>('[data-mobile-cta]');
  const heroCta = document.querySelector<HTMLElement>('.phero .ctas, .hero .btn-row');
  if (!bar || bar.dataset.bound || !('IntersectionObserver' in window)) return;
  bar.dataset.bound = '1';
  let heroOut = false;
  const anchorsIn = new Set<Element>();
  const update = () => bar.classList.toggle('is-visible', heroOut && anchorsIn.size === 0);
  // Ohne Hero-Knopf (Preise, 404) erscheint die Leiste nach knapp einer Bildschirmhoehe (M10)
  if (heroCta) new IntersectionObserver((es) => { heroOut = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; update(); }).observe(heroCta);
  else { const onScroll = () => { const v = window.scrollY > window.innerHeight * 0.8; if (v !== heroOut) { heroOut = v; update(); } }; addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
  const aio = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? anchorsIn.add(e.target) : anchorsIn.delete(e.target))); update(); }, { threshold: .3 });
  document.querySelectorAll('[data-cta-anchor], footer').forEach((el) => aio.observe(el));
};

const foldCards = () => {
  if (!document.documentElement.classList.contains('m')) return;
  document.querySelectorAll<HTMLDetailsElement>('details.card-more:not([data-init])').forEach((d) => { d.removeAttribute('open'); d.dataset.init = ''; });
  // Footer-Spalten (M10): am Telefon Akkordeon, nur die erste Spalte offen
  document.querySelectorAll<HTMLDetailsElement>('details.fcol:not([data-init]):not([data-first])').forEach((d) => { d.removeAttribute('open'); d.dataset.init = ''; });
};

// Zahlen zaehlen hoch (Revolut-Muster, Jan 18.09. spaet): Elemente mit data-count laufen beim Erscheinen in 1,1 s von 0 auf
// ihren Wert; Waehrung, Tausenderpunkte, Dezimalstellen und Zusaetze ("+", "%", " languages") bleiben, wie sie im HTML stehen.
const countUp = () => {
  if (reduce() || !('IntersectionObserver' in window)) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-count]:not([data-counted])')];
  if (els.length === 0) return;
  const io = new IntersectionObserver((es) => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target as HTMLElement; const text = el.textContent ?? '';
      const m = text.match(/^(\D*?)([\d.,]+)(.*)$/s);
      if (!m) continue;
      const [, pre, num, post] = m; const sep = (num.match(/[.,](?=\d{1,2}$)/) ?? [''])[0]; const decimals = sep ? num.length - num.indexOf(sep) - 1 : 0;
      const thousands = num.includes(sep === ',' ? '.' : ',') ? (sep === ',' ? '.' : ',') : '';
      const target = Number(num.replace(/[.,]/g, (c) => (c === sep ? '.' : ''))); if (!Number.isFinite(target)) continue;
      // Kleine Zahlen zaehlen nicht (27): "0 languages" auf dem Weg zu "3 languages" oder "7%" vor "100%" wirkten wie ein Fehler
      if (target < 20) continue;
      const fmt = (v: number) => { const [int, frac] = v.toFixed(decimals).split('.'); const grouped = thousands ? int.replace(/\B(?=(\d{3})+(?!\d))/g, thousands) : int; return pre + grouped + (frac ? sep + frac : '') + post; };
      const t0 = performance.now(); const dur = 1100;
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / dur); const ease = 1 - Math.pow(1 - k, 3); el.textContent = fmt(target * ease); if (k < 1) requestAnimationFrame(tick); else el.textContent = text; };
      requestAnimationFrame(tick);
    }
  }, { threshold: .6 });
  els.forEach((el) => { el.dataset.counted = '1'; io.observe(el); });
};

/* Platzhalterformulare (Lead, Quiz, Kontakt) antworten sichtbar (Rundgang 18.09. 23:15: ein Knopf ohne Reaktion wirkt kaputt):
   Felder bleiben stehen, darunter erscheint der Satz aus data-ack, der Knopf ist danach aus. Es wird nichts gesendet. */
const ackForms = () => {
  document.querySelectorAll<HTMLFormElement>('form[data-ack]:not([data-bound])').forEach((f) => {
    f.dataset.bound = '1';
    f.addEventListener('submit', (ev) => {
      ev.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; }
      let ack = f.querySelector<HTMLElement>('.ack');
      if (!ack) { ack = document.createElement('p'); ack.className = 'ack'; ack.setAttribute('role', 'status'); f.append(ack); }
      ack.textContent = f.dataset.ack ?? ''; f.classList.add('is-sent');
      f.querySelectorAll<HTMLButtonElement>('button[type=submit]').forEach((b) => { b.disabled = true; });
      f.querySelectorAll<HTMLElement>('[data-after]').forEach((el) => { el.hidden = false; });
    });
  });
};

// Parallax (Rundgang 20.09., Revolut-Muster): Fotos in Baendern und Buehnen (data-parallax) bewegen sich beim Scrollen um bis zu
// 6 % der Flaechenhoehe gegen die Laufrichtung. Nur im Sichtfeld gerechnet, nur mit rAF, nicht bei reduzierter Bewegung; die
// Flaeche ist beschnitten, die Bilder sind dafuer 16 % hoeher und um 8 % nach oben gesetzt (CSS in PhotoBand.astro, Home.astro,
// Pricing.astro, ClosingCta.astro).
// Feinschliff 27: das Bild aus Pic.astro steckt in <picture> mit display:contents, dessen Rechteck ist 0x0. Gerechnet wird
// deshalb mit dem ersten Vorfahren, der eine Flaeche hat; der Versatz in Pixeln der Flaeche, nicht in Prozent des Bildes.
const boxOf = (el: HTMLElement) => { let p: HTMLElement | null = el.parentElement; while (p && getComputedStyle(p).display === 'contents') p = p.parentElement; return (p ?? el).getBoundingClientRect(); };
// M01: wo der Browser Scroll-Zeitleisten kann, laeuft die Parallax in CSS (motion.css, animation-timeline: view()); hier bleibt nur der Ersatz.
const parallax = () => {
  if (reduce()) return;
  if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()')) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]:not([data-px])')];
  if (els.length === 0) return;
  els.forEach((el) => { el.dataset.px = '1'; });
  const all = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  let ticking = false;
  const run = () => {
    ticking = false; const vh = window.innerHeight;
    for (const el of all) {
      const box = boxOf(el);
      if (box.bottom < 0 || box.top > vh) continue;
      const k = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2); // -1 (unten) bis 1 (oben)
      el.style.transform = `translate3d(0, ${(-k * box.height * 0.06).toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
  if (!(window as unknown as { __px?: boolean }).__px) { (window as unknown as { __px?: boolean }).__px = true; addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); }
  run();
};

/* Bilder erscheinen weich (27): nachgeladene Fotos blenden ein, statt aufzuspringen. Bilder, die beim Binden schon da sind,
   bleiben unangetastet (kein Flackern); ohne JS und bei reduzierter Bewegung steht alles sofort. */
const imgFade = () => {
  if (reduce()) return;
  document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]:not([data-fade])').forEach((img) => {
    img.dataset.fade = '1';
    if (img.complete) return;
    img.classList.add('is-pending');
    const done = () => img.classList.remove('is-pending');
    img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
  });
};

/* Lichtfleck folgt dem Zeiger (27, nur mit Maus): Glaskarten und Buehnen mit data-spot bekommen --mx/--my in Pixeln, das CSS
   zeichnet den Schein (base.css [data-spot]). */
const spotlight = () => {
  if (!matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-spot]:not([data-spot-bound])').forEach((el) => {
    el.dataset.spotBound = '1';
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`); el.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`); });
  });
};

/* Objekt neigt sich zum Zeiger (27, Bankkarte): --px/--py von -1 bis 1, das CSS rechnet die Drehung (CardMock.astro). */
const tilt = () => {
  if (reduce() || !matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]:not([data-tilt-bound])').forEach((el) => {
    el.dataset.tiltBound = '1';
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3)); el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3)); });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--px', '0'); el.style.setProperty('--py', '0'); });
  });
};

/* Segment-Schalter (27, iOS-Muster): ein Schieber gleitet mit Feder unter den aktiven Knopf (.seg-ctl > button.is-on), statt
   dass zwei Pillen die Farbe tauschen. Die Seiten-Skripte schalten .is-on wie bisher; hier wird nur nachgemessen. Ohne JS
   traegt der aktive Knopf seine Farbe selbst (base.css .seg-ctl:not(.is-ready)). */
const segControl = () => {
  document.querySelectorAll<HTMLElement>('.seg-ctl:not([data-seg-bound])').forEach((seg) => {
    seg.dataset.segBound = '1';
    let thumb = seg.querySelector<HTMLElement>('.seg-thumb');
    if (!thumb) { thumb = document.createElement('span'); thumb.className = 'seg-thumb'; thumb.setAttribute('aria-hidden', 'true'); seg.prepend(thumb); }
    const place = (animate: boolean) => {
      const on = seg.querySelector<HTMLElement>(':is(button, a).is-on'); if (!on || !thumb) return; // M09: Sprachwahl im Sheet sind Links
      if (!animate) thumb.style.transition = 'none';
      thumb.style.width = `${on.offsetWidth}px`; thumb.style.height = `${on.offsetHeight}px`;
      thumb.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
      if (!animate) { void thumb.offsetWidth; thumb.style.transition = ''; }
      seg.classList.add('is-ready');
    };
    place(false);
    seg.addEventListener('click', () => requestAnimationFrame(() => place(true)));
    addEventListener('resize', () => place(false));
    document.fonts?.ready.then(() => place(false));
  });
};

/* Primitive fuer Seitenskripte (M01). inView: ein Beobachter mit Mittelband (band = Anteil oben und unten, .45 = das mittlere
   Zehntel entscheidet); enter/leave feuern beim Kreuzen des Bands. Kein Scroll-Jacking, funktioniert in beide Richtungen. */
export const inView = (el: Element, on: { enter?: () => void; leave?: () => void }, band = 0.45) => {
  if (!('IntersectionObserver' in window)) { on.enter?.(); return () => {}; }
  const pct = `${(band * 100).toFixed(0)}%`;
  const io = new IntersectionObserver((es) => { for (const e of es) (e.isIntersecting ? on.enter : on.leave)?.(); }, { rootMargin: `-${pct} 0px -${pct} 0px`, threshold: 0 });
  io.observe(el);
  return () => io.disconnect();
};

/* beats: ein Kapitel (root) mit Beats (sel) schreibt root.dataset.stage = "1".. = Zahl der Beats, deren Oberkante die Bildschirm-
   mitte schon passiert hat, und root.dataset.dir = "down" | "up". Der Beobachter schaut auf einen schmalen Streifen um die
   Mittellinie (1 % der Hoehe), damit er genau dann feuert, wenn eine Beat-Kante die Mitte kreuzt; gerechnet wird dann gegen die
   Mitte selbst, in beide Richtungen gleich. Zustaende schalten auch bei reduzierter Bewegung; nur ihre Uebergaenge entfallen
   (base.css). Idempotent ueber data-beats-bound. */
export const beats = (root: HTMLElement, sel = '[data-beat]') => {
  if (root.dataset.beatsBound) return;
  root.dataset.beatsBound = '1';
  const items = [...root.querySelectorAll<HTMLElement>(sel)];
  if (items.length === 0) return;
  let lastY = window.scrollY;
  const place = () => {
    const mid = window.innerHeight / 2;
    let stage = 0;
    for (let i = 0; i < items.length; i++) { const r = items[i].getBoundingClientRect(); if (r.top <= mid) stage = i + 1; else break; }
    const y = window.scrollY; if (y !== lastY) { root.dataset.dir = y > lastY ? 'down' : 'up'; lastY = y; }
    root.dataset.stage = String(Math.max(1, stage));
  };
  if (!('IntersectionObserver' in window)) { place(); return; }
  const io = new IntersectionObserver(place, { rootMargin: '-49.5% 0px -49.5% 0px', threshold: 0 });
  items.forEach((it) => io.observe(it));
  // Auch Beobachten der Kapitelflaeche: beim Verlassen nach oben oder unten stimmt der Zustand sonst nicht mehr
  io.observe(root);
  place();
};

/* M14: Hero-Foto der Zielseite vorladen. Links mit data-hero (JPEG-Pfad des Foto-Heros aus src/lib/heroes.ts; gesetzt in Home.astro
   auf den drei Produktkarten und in Header.astro auf den Menuepunkten mit Foto-Hero) haengen einmal je URL ein
   <link rel="prefetch" as="image"> in den Head: beim ersten mouseenter sofort, beim Erscheinen im Sichtfeld erst nach dem
   load-Ereignis im Leerlauf (die Menuepunkte sind immer im Bild; das Laden der eigenen Seite geht vor). Die Variante folgt der
   Namenskonvention aus src/lib/img.ts (<name>-<breite>.avif): auf dem Desktop 1440, auf dem Telefon die Breite, die
   <picture sizes="100vw"> selbst waehlt (kleinste Variante >= Viewport x DPR), sonst laege das Vorgeladene ungenutzt im Cache.
   Nicht bei Datensparmodus oder 2g; Zeilen im geschlossenen Mobil-Sheet (visibility: hidden) zaehlen nicht als sichtbar
   (checkVisibility; nur visibility, nicht opacity: die Produktkarten sind waehrend ihrer Einblendung kurz bei opacity 0).
   Die Menge der vorgeladenen URLs lebt ueber Seitenwechsel hinweg (Astro raeumt die Links aus dem Head, der Cache bleibt). */
const heroDone = new Set<string>();
const prefetchHero = () => {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return;
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-hero]:not([data-hero-bound])')];
  if (links.length === 0) return;
  const urlFor = (src: string) => { const need = innerWidth * (devicePixelRatio || 1); const w = [480, 960, 1440].find((x) => x >= need) ?? 1440; return src.replace(/\.jpe?g$/i, `-${w}.avif`); };
  const add = (a: HTMLAnchorElement) => {
    const src = a.dataset.hero; if (!src) return;
    const href = urlFor(src); if (heroDone.has(href)) return; heroDone.add(href);
    const l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'image'; l.type = 'image/avif'; l.href = href; document.head.append(l);
  };
  const visible = (el: HTMLElement) => (el as HTMLElement & { checkVisibility?: (o?: Record<string, boolean>) => boolean }).checkVisibility?.({ visibilityProperty: true, checkVisibilityCSS: true }) ?? el.offsetParent !== null;
  links.forEach((a) => { a.dataset.heroBound = '1'; a.addEventListener('mouseenter', () => add(a), { once: true, passive: true }); });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting && visible(e.target as HTMLElement)) { add(e.target as HTMLAnchorElement); io.unobserve(e.target); } });
  const observe = () => { const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback; const start = () => links.forEach((a) => io.observe(a)); if (idle) idle(start, { timeout: 2000 }); else setTimeout(start, 1000); };
  if (document.readyState === 'complete') observe(); else addEventListener('load', observe, { once: true });
};

/* M14: nach einem Seitenwechsel des ClientRouters (astro:after-swap) blendet auch der neue Foto-Hero ein statt aufzuspringen:
   eager-Bilder, die beim Tausch noch nicht da sind, bekommen is-pending (base.css img[data-fade]) bis zum load; aus dem Cache
   (Prefetch) stehen sie sofort. Der Erstaufruf bleibt unangetastet, dort malt der Browser das Foto selbst; imgFade oben
   behaelt sein Verhalten fuer nachgeladene Bilder. */
const pendingEager = () => {
  if (reduce()) return;
  document.querySelectorAll<HTMLImageElement>('img[loading="eager"]:not([data-fade])').forEach((img) => {
    if (img.complete) return;
    img.dataset.fade = '1'; img.classList.add('is-pending');
    const done = () => img.classList.remove('is-pending');
    img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
  });
};
document.addEventListener('astro:after-swap', pendingEager);

/* Commit-Zustand der Primaerknoepfe (M13, base.css [data-commit]): Druck beim pointerdown, Haken beim Klick, bevor der Router
   wechselt; nur fuer echte Navigationen (kein Anker, keine Modifier-Taste). Sprung-Link (M10): setzt den Fokus in <main>. */
const commitCtas = () => {
  document.querySelectorAll<HTMLAnchorElement>('a[data-commit]:not([data-commit-bound])').forEach((a) => {
    a.dataset.commitBound = '1';
    a.addEventListener('pointerdown', () => a.classList.add('is-pressing'));
    a.addEventListener('pointerup', () => a.classList.remove('is-pressing'));
    a.addEventListener('pointercancel', () => a.classList.remove('is-pressing'));
    a.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || a.getAttribute('href')?.startsWith('#')) return; a.classList.add('is-committing'); setTimeout(() => a.classList.remove('is-committing'), 1200); });
  });
  document.addEventListener('astro:after-swap', () => document.querySelectorAll('.is-committing').forEach((el) => el.classList.remove('is-committing')), { once: true });
};
const skipLink = () => {
  const a = document.querySelector<HTMLAnchorElement>('[data-skip]:not([data-bound])'); if (!a) return; a.dataset.bound = '1';
  a.addEventListener('click', (e) => { const m = document.querySelector<HTMLElement>('main'); if (!m) return; e.preventDefault(); m.tabIndex = -1; m.focus(); m.scrollIntoView(); });
};

const init = () => { bindHeader(); headerState(); foldCards(); reveal(); mobileCta(); countUp(); ackForms(); parallax(); imgFade(); spotlight(); tilt(); segControl(); prefetchHero(); commitCtas(); skipLink(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
document.addEventListener('astro:page-load', init);
