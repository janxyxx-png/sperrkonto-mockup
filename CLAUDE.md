# Sperrkonto-Mockup: Regeln fuer die Arbeit mit Claude Code

Klickbares Website-Mockup fuer EC Assets (Sperrkonto, Krankenversicherung, Bankkonto, Studienkredit fuer Menschen aus
Pakistan, die nach Deutschland ziehen). Astro 5 mit Bun, statisch, drei Sprachen. Aufbau und Seitenliste: README.md.

## Arbeiten

- Starten: `bun install`, dann `bun run dev` (Port 4321). Vorschau im Claude-Desktop: `.claude/launch.json` (Konfiguration "dev").
- Bauen: `bun run build` (264 Seiten). Nie zwei Builds gleichzeitig: sie teilen sich `.astro/` und zerstoeren sich die Assets.
- Pruefen nach jeder Aenderung (brauchen Google Chrome, Basis-URL per `BASE=`):
  `bun run scripts/qa/journey.ts` (Klickstrecken, auch mit `W=390`), `scripts/qa/motion.ts` (Bewegung, CLS, reduzierte
  Bewegung), `scripts/qa/symmetry.ts` (gleiche Hoehen in Reihen, Mitten, Zentrierung), `scripts/qa/tweaks.ts` und
  `funnel.ts` (Rechner, Bewerbung), `python3 scripts/qa/links.py dist` (Links und Anker). Einzelheiten: scripts/qa/README.md.
- Bilder: `scripts/img/variants.ts` laeuft vor dem Build und schreibt `public/img/photos/sizes.json`.

## Online

Vercel-Projekt `sperrkonto-mockup`, Adresse https://blockedaccount.ecassets.com, Passwort-Tuer in `middleware.ts`
(Edge Middleware, Hash in `MOCKUP_KEY_HASH`). Push auf `main` = Veroeffentlichung. `middleware.ts` und `vercel.json`
nicht entfernen; das Mockup darf nie ohne Passwort oeffentlich stehen (Beispielwerte, Trustpilot-Beispiel).

## Gestaltung (nicht verhandelbar)

- Eine Akzentfarbe Bordeaux `#8e2d2f`, Tinte `#0b0f19`, Schrift Instrument Sans, Radien 12/20/28, keine Kartenschatten,
  gerade Sektionskanten (keine grossen abgerundeten Flaechen), kein Blau. Werte stehen in `src/styles/tokens.css`.
- Drei Ueberschriftenstufen: `h2.chapter` 72 px, h2 52 px, `h2.util` 34 px; Sektionsabstaende ueber die Klassen
  `.chapter` und `.inner` (Regeln in `src/styles/base.css`).
- Symmetrie ist Pflicht: Karten einer Reihe gleich hoch, Titel reservieren zwei Zeilen, letzte Zeilen auf einer Hoehe,
  Icons mittig zur ersten Textzeile. `symmetry.ts` findet Verstoesse.
- Bewegung: nichts laeuft in Schleife, Reaktion beim Druecken (pointer-down), Rechner zaehlen nur bei echter Eingabe
  (`e.isTrusted`) und nie bei reduzierter Bewegung. Seitenwechsel per View Transitions: Chrome blockt Klicks waehrend des
  Wechsels, QA wartet 600 bis 700 ms.
- Am Telefon keine Wischreihen; WhatsApp-Kontakt auf jeder Seite sichtbar.
- Fotos: die vorhandene cineastische Serie in `public/img/photos` (Quellen in `public/img/QUELLEN.md`), keine neuen Kacheln.

## Texte und Sprachen

- Englisch, Urdu (`/ur`), Punjabi (`/pa`) mit identischer Datenstruktur; nie englischer Rueckfall. Jede neue Zeichenkette
  in allen drei Sprachen anlegen (`src/lib/ui-strings.ts`, `loan-copy.ts`, `pricing-copy.ts`, `funnel-copy.ts`,
  Seiteninhalte in `src/data`). Urdu- und Punjabi-Entwuerfe sind mit `/* Entwurf */` markiert.
- RTL: in `.astro`-Styles `[dir="rtl"]` nur mit `:global()`; Abstaende mit `inset-inline` und `margin-inline`.
- Offene Werte (Partnerbank, Gebuehren, IBAN, WhatsApp-Nummer) stehen als `[PLACEHOLDER: ...]` im Text und werden als
  gestrichelte Chips gerendert. Nicht durch erfundene Fakten ersetzen.
- Demo-Welt des Portals: `src/lib/portal-demo.ts` (Daten, Datumsanker). Bewerbung und Portal senden nichts.

## Wenn du etwas aenderst

Erst den ganzen Bereich ansehen, dann aendern, dann bauen und die Pruefskripte laufen lassen. Screenshots aus headless
Chrome (`scripts/qa/shoot.ts`), nicht aus der Dev-Vorschau. Am Ende kurz in README.md nachziehen, wenn sich Aufbau oder
Regeln geaendert haben.
