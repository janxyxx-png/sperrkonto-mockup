/** Platzhalter im Format [PLACEHOLDER: ...] (07-PROMPT-STUDIENKREDIT) sichtbar als Chip setzen.
 *  markPh() nimmt reinen Text, escapet HTML und liefert HTML fuer set:html. */
export const PH_RE = /\[PLACEHOLDER:[^\]]+\]/g;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const isPh = (s: string) => /^\[PLACEHOLDER:[^\]]+\]$/.test(s.trim());
export const markPh = (s: string): string => esc(s).replace(PH_RE, (m) => `<span class="ph-num">${m}</span>`);
