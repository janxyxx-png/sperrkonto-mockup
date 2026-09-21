# Sperrkonto-Mockup (EC Assets)

Klickbares Website-Mockup fuer das Sperrkonto-Angebot von EC Assets: Sperrkonto, Krankenversicherung, Bankkonto und
Studienkredit fuer Menschen, die aus Pakistan nach Deutschland ziehen. Statische Astro-Seite in drei Sprachen (Englisch,
Urdu, Punjabi) mit Marketingseiten, Ratgebern, Hilfe, Preisrechner, Bewerbungsstrecke und einem Kundenportal mit Demo-Daten.

## Starten

Am Mac: Doppelklick auf `Mockup starten.command`. Beim ersten Mal installiert es Bun und die Abhaengigkeiten (ein bis
zwei Minuten), dann oeffnet sich http://localhost:4321 im Browser. Meldet macOS, die Datei stamme von einem nicht
verifizierten Entwickler: Rechtsklick auf die Datei, "Oeffnen", dann bestaetigen. Zum Beenden das Terminalfenster schliessen.

Mit Claude Code: den Ordner als Arbeitsverzeichnis oeffnen; `CLAUDE.md` enthaelt die Regeln, `.claude/launch.json` die
Vorschau-Konfiguration fuer die Claude-Desktop-App.

Von Hand (Mac, Windows, Linux): [Bun](https://bun.sh) installieren, dann im Ordner:

    bun install
    bun run dev        # http://localhost:4321
    bun run build      # statische Seiten nach dist/, mit "bun run preview" ansehen

## Online (Vercel)

Das Mockup laeuft als eigenes Vercel-Projekt `sperrkonto-mockup` (Team "jan's projects") unter
https://blockedaccount.ecassets.com, hinter einer Passwort-Tuer (`middleware.ts`): in Vercel liegt nur der SHA-256 des
Passworts als Umgebungsvariable `MOCKUP_KEY_HASH`. Neues Passwort setzen: `printf '%s' 'NeuesPasswort' | shasum -a 256`,
den Wert in Vercel eintragen, neu ausrollen; alte Anmeldungen (Cookie, 30 Tage) verfallen damit.
Jeder Push auf `main` des GitHub-Repositorys baut und veroeffentlicht neu (Build: `astro build`, Bildvarianten sind
eingecheckt). `vercel.json` setzt saubere URLs, `noindex` und die Cache-Regeln.

## Wichtige Seiten

- `/` Startseite, `/blocked-account`, `/health-insurance`, `/german-bank-account`, `/study-loan`, `/complete-setup`
- `/pricing` Preise und Planer, `/guides` Ratgeber, `/help` Hilfe, `/embassy-checklist` Botschaftstermin
- `/app/start` Bewerbung (sechs Fragen, nichts wird gesendet), `/app/dashboard` Portal mit Demo-Konto
- `/ur/...` und `/pa/...` fuer Urdu und Punjabi, gleiche Struktur wie Englisch

## Aufbau

- `src/views` Seitenvorlagen, `src/components` Bausteine (Header, Footer, Produktobjekte: Brief, Beleg, Karte, App)
- `src/lib` Texte und Daten (`ui-strings.ts`, `loan-copy.ts`, `pricing-copy.ts`, `funnel-copy.ts`, `portal-demo.ts`)
- `src/data` Seiteninhalte je Sprache, `src/styles` Gestaltungsregeln (`tokens.css`: Farben, Schrift, Abstaende)
- `public/img/photos` Fotoserie (Quellen in `public/img/QUELLEN.md`), `scripts/img/variants.ts` erzeugt die Bildgroessen vor dem Build
- `scripts/qa` Pruefskripte (Journey, Bewegung, Links, Symmetrie); brauchen Google Chrome, siehe `scripts/qa/README.md`

## Was Beispiel ist

- Partnerbank, Gebuehren, IBAN, WhatsApp-Nummer und Fristen sind Beispielwerte; offene Stellen sind im Text als
  `[PLACEHOLDER: ...]` markiert.
- Kundenstimmen und Trustpilot-Bewertung sind Beispiele, Namen geaendert.
- Bewerbung und Portal senden nichts; ihr Zustand bleibt im Browser.
- Urdu und Punjabi sind teils Entwuerfe und nicht lektoriert.

## Gestaltung

Eine Akzentfarbe (Bordeaux `#8e2d2f`), Tinte `#0b0f19`, Instrument Sans, Radien 12/20/28, keine Kartenschatten, gerade
Sektionskanten, gleiche Hoehen in Reihen, nichts laeuft in Schleife, Rechner reagieren sofort.
