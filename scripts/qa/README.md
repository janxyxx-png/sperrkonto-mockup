# Visuelle QA

Zwei Bun-Skripte, die den laufenden Server (Port 4321, `bun run preview` oder `bun run dev`, siehe `.claude/launch.json`; anderer Port ueber `BASE=http://...`) mit dem installierten
Google Chrome abklappern. Einmalig `bun add -d puppeteer-core` im Projekt.

- `bun run scripts/qa/audit.ts [--desktop-only|--mobile-only] [route ...]`
  Prueft jede Seite bei 1280 und 375 px auf horizontalen Ueberlauf, abgeschnittene Texte, ueberlappende
  Geschwister, umbrechende Buttons, leere Karten, doppelte Bloecke, Markenreste und Konsolenfehler.
  Ergebnis in `results.json` und als Kurzfassung auf der Konsole. Tabellen in `.cmp` scrollen absichtlich.
- `bun run scripts/qa/shoot.ts [--w=1280] [--chunk=1800] [--scale=0.5] route ...`
  Legt Screenshots in `chunks<w>/` ab, seitenweise in Streifen, damit man sie einzeln ansehen kann.
- `bun run scripts/qa/funnel.ts`
  Klickt den Funnel `/app/start` auf fuenf Wegen durch (Studium mit eigenem Geld, Kredit mit und ohne Buerge, Chancenkarte,
  Jobsuche in Urdu) und liest die Ergebniskarten aus; dazu der Umzugsrechner auf `/pricing`. Meldet Konsolenfehler.
- `python3 scripts/qa/links.py [dist]`
  Prueft nach `bun run build` jeden internen Link und Anker in `dist/` gegen die gebauten Dateien.
- `BASE=http://127.0.0.1:4322 bun run scripts/qa/journey.ts [--w=390] [--out=ORDNER]`
  Der Kundenweg von der Startseite bis ins Portal (Menue, Sprache, Preise, Funnel, Registrierung, Portal, Hilfe,
  Checkliste, Kontakt, Kredit, Guides, Login-Link, Demo-Konto in beiden Zustaenden), jeder Schritt PASS oder FAIL; mit `--out`
  Screenshots der Stationen.
- `scripts/qa/tweaks.ts` prueft Visa-Chips, Waehrungs-Umschalter und Kalenderdatei.
- `BASE=http://127.0.0.1:4323 bun run scripts/qa/motion.ts [route ...]` (Runde 29)
  Bewegungsregeln gegen den statischen Build: keine endlose Animation ausser dem Portal-Puls, keine Layoutspruenge beim
  Scrollen (CLS unter 0,02), und Kapitel mit Zustaenden (`[data-story]`) stehen bei reduzierter Bewegung im Endbild.
