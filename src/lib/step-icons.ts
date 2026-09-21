/** Icon je Schritt nach der englischen Ueberschrift (28): Schrittkarten tragen neben der Nummer ein Motiv aus dem Icon-System.
 *  Gelesen wird immer der englische Titel (Sprachparitaet), gerendert die Sprachkopie. Reihenfolge der Muster ist Absicht:
 *  "Unlock your money after landing" ist die Ankunft, nicht das Geld. */
export const stepIcon = (titleEn: string): string => {
  const s = titleEn.toLowerCase();
  if (/who you are|tell us|question|answer|form|check|qualify/.test(s)) return 'id';
  if (/apply|application/.test(s)) return 'doc';
  if (/land|arriv|unlock|switch it on|activate|tap when|when you land/.test(s)) return 'plane';
  if (/send|transfer|deposit|rupee|money goes|pay in/.test(s)) return 'euro';
  if (/letter|certificate|confirmation|folder|embassy|document|download/.test(s)) return 'doc';
  if (/doctor|cover|insur|health/.test(s)) return 'shield';
  if (/repay|month|calendar|payout/.test(s)) return 'calendar';
  if (/bank|account|iban|card/.test(s)) return 'bank';
  return 'check';
};
