import { defineConfig } from 'astro/config';
import { writeFileSync } from 'node:fs';
import { astroRedirects, redirectsFile } from './redirects.mjs';

// Weiterleitungsliste (redirects.mjs) einmal fuer den Build und einmal als public/_redirects fuer das Hosting
writeFileSync(new URL('./public/_redirects', import.meta.url), redirectsFile());

export default defineConfig({
  // Adresse des Mockups (og:image in Base.astro und die QR-Verify-URLs in DocObject/CertObject sind damit absolut)
  site: 'https://blockedaccount.ecassets.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false }, // Vorschau ohne Astro-Werkzeugleiste (Uebergabe; die Leiste fing zudem Klicks in der QA ab)
  redirects: astroRedirects(),
});
