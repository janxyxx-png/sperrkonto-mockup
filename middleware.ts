/** Passwort-Tuer fuer das Mockup auf Vercel (Edge Middleware, laeuft vor jeder Datei).
 *  Das Passwort selbst steht nirgends: in der Umgebungsvariable MOCKUP_KEY_HASH liegt sein SHA-256 (hex). Wer es richtig
 *  eingibt, bekommt ein Cookie mit demselben Hash fuer 30 Tage. Neues Passwort = neuer Hash in Vercel, alle Cookies
 *  verlieren damit ihre Gueltigkeit. Ohne gesetzte Variable bleibt die Tuer zu (sicherer Ausfall).
 *  Hash erzeugen: printf '%s' 'DasPasswort' | shasum -a 256 */
import { next } from '@vercel/edge';

export const config = { matcher: '/(.*)' };

const COOKIE = 'ec-mockup';
const MAX_AGE = 60 * 60 * 24 * 30;

const sha256 = async (s: string) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const page = (state: 'ask' | 'wrong' | 'unset') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Blocked Account Mockup</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f5; color: #0b0f19; font: 16px/1.5 -apple-system, "Segoe UI", system-ui, sans-serif; }
  main { width: min(92vw, 400px); background: #fff; border-radius: 20px; padding: 36px 32px 32px; }
  .mark { font-weight: 700; letter-spacing: -.03em; font-size: 1.35rem; color: #8e2d2f; margin: 0 0 22px; }
  h1 { font-size: 1.45rem; letter-spacing: -.02em; line-height: 1.15; margin: 0 0 6px; }
  p { margin: 0 0 22px; color: #5b6070; }
  label { display: block; font-size: .85rem; font-weight: 600; margin-bottom: 8px; }
  input { width: 100%; box-sizing: border-box; font: inherit; padding: 13px 14px; border: 1px solid #d7d8dd; border-radius: 12px; outline: none; }
  input:focus { border-color: #0b0f19; }
  button { width: 100%; margin-top: 14px; font: inherit; font-weight: 600; padding: 14px; border: 0; border-radius: 999px; background: #8e2d2f; color: #fff; cursor: pointer; }
  .err { color: #8e2d2f; font-size: .9rem; margin: 10px 0 0; }
  small { display: block; margin-top: 20px; color: #8a8f9c; font-size: .8rem; }
</style></head>
<body><main>
  <p class="mark">ec assets</p>
  <h1>Blocked Account Mockup</h1>
  <p>This is an internal preview. Please enter the password.</p>
  ${state === 'unset' ? '<p class="err">No password is configured for this deployment yet.</p>' : `<form method="post">
    <label for="key">Password</label>
    <input id="key" name="key" type="password" autocomplete="current-password" autofocus required>
    ${state === 'wrong' ? '<p class="err">That password is not right.</p>' : ''}
    <button type="submit">Open the mockup</button>
  </form>`}
  <small>Example content, not an offer. Nothing on this site is sent anywhere.</small>
</main></body></html>`;

const html = (body: string, status: number) =>
  new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } });

export default async function middleware(req: Request) {
  const hash = (process.env.MOCKUP_KEY_HASH || '').trim().toLowerCase();
  if (!hash) return html(page('unset'), 503);
  const cookies = (req.headers.get('cookie') || '').split(/;\s*/);
  if (cookies.includes(`${COOKIE}=${hash}`)) return next();
  if (req.method === 'POST') {
    let key = '';
    try { key = String((await req.formData()).get('key') || ''); } catch { key = ''; }
    if (key && (await sha256(key.trim())) === hash) {
      const url = new URL(req.url);
      return new Response(null, {
        status: 303,
        headers: {
          location: url.pathname + url.search,
          'set-cookie': `${COOKIE}=${hash}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
          'cache-control': 'no-store',
        },
      });
    }
    return html(page('wrong'), 401);
  }
  return html(page('ask'), 401);
}
