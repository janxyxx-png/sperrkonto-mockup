/** Waehlt eine Illustration nach Stichworten in Titel/Text. Namen siehe Illustration.astro. */
export type IlloName = 'visa' | 'documents' | 'study' | 'work' | 'bank' | 'insurance' | 'home' | 'events' | 'app' | 'chat' | 'travel' | 'team' | 'office' | 'money' | 'city' | 'award';
export const ILLO_NAMES: IlloName[] = ['visa', 'documents', 'study', 'work', 'bank', 'insurance', 'home', 'events', 'app', 'chat', 'travel', 'team', 'office', 'money', 'city', 'award'];
export const illoFor = (text: string, fallback: IlloName = 'documents'): IlloName => {
  const t = text.toLowerCase();
  if (/scholar|award|prize|winner/.test(t)) return 'award';
  if (/visa|permit|passport|embassy|entry|opportunity card|chancenkarte/.test(t)) return 'visa';
  if (/insur|health|cover|doctor|sick/.test(t)) return 'insurance';
  if (/blocked account|deposit|bank|iban|payout|account/.test(t)) return 'bank';
  if (/transfer|money|cost|fee|price|loan|budget|salary|rupee/.test(t)) return 'money';
  if (/webinar|session|event|live|register/.test(t)) return 'events';
  if (/\bapps?\b|phone|mobile|portal|sim|network|companion|roadmap/.test(t)) return 'app';
  if (/rent|accommod|flat|apartment|housing|landlord|home|wg/.test(t)) return 'home';
  if (/cit(y|ies)|berlin|munich|hamburg|town|expat|living|life in/.test(t)) return 'city';
  if (/team|about us|people|founder|leadership|partner|ambassador|refer/.test(t)) return 'team';
  if (/career|office|job interview|cv|resume|company|work culture/.test(t)) return 'office';
  if (/work|job|employ|skilled|profession|labour|engineer/.test(t)) return 'work';
  if (/stud|universit|degree|master|bachelor|admission|programme|program|tuition|grade/.test(t)) return 'study';
  if (/german language|learn german|language|speak|course/.test(t)) return 'chat';
  if (/arriv|travel|flight|move|moving|abroad|germany/.test(t)) return 'travel';
  return fallback;
};
