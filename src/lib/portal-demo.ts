/**
 * Beispielkonto des Portals (Jan 20.09.: "ein beispiel account, wie der dann aussehen koennte, kontostand, karten,
 * auszahlungen"): dieselbe Kundin zu zwei Zeitpunkten. "Before departure" (September 2026, Antrag laeuft, Sperrbetrag
 * unterwegs) und "In Germany" (Mai 2027, drei Monate nach der Ankunft, Konto aktiv, Auszahlungen laufen). Der Zustand liegt im Browser
 * (localStorage ec-persona) und wird in der Seitenleiste umgeschaltet; beide Zustaende stehen im HTML, CSS blendet um.
 * Zahlen sind erfunden und sprachneutral; Texte in drei Sprachen. Kein Partnername, keine echten Nummern.
 */
import type { Locale } from './i18n';

export type Persona = 'applying' | 'active';
export const PERSONA_KEY = 'ec-persona';
export const PERSONA_DEFAULT: Persona = 'applying';

/**
 * M02: eine Demo-Welt fuer alle Objekte (Brief, Zertifikat, App-Screens, Portal, Behoerden-Verifikation). Jedes Datum
 * haengt an einem dieser Anker; Texte tragen Tokens wie {arrival}, die fillDates() je Sprache fuellt. Nichts steht doppelt.
 */
export const DEMO_ANCHORS = {
  applied: '2026-09-18',          // Antrag gestellt
  received: '2026-09-23',         // Sperrbetrag eingegangen
  issued: '2026-09-23',           // Bestaetigung ausgestellt (am Tag des Geldeingangs)
  issuedTime: '14:32',            // Uhrzeit auf dem Brief (kein Datum)
  appointment: '2026-12-21',      // Visumtermin Botschaft
  decision: '2027-01-18',         // Visumentscheid
  arrival: '2027-02-01',          // Ankunft in Deutschland, Aktivierung
  permitAppointment: '2027-02-22',// Termin Auslaenderbehoerde
  today: '2027-05-10',            // "Heute" der Persona "In Germany"
  extendBy: '2028-01-01',         // Frist: Sperrkonto verlaengern oder schliessen
} as const;

/** Der Bestaetigungsbrief (DocObject, Vorschau in /app/documents, Verifikation unter /authorities) */
export interface DemoLetter { ref: string; issued: string; time: string; city: string }
export const DEMO_LETTER: DemoLetter = { ref: 'BA-2026-04871', issued: DEMO_ANCHORS.issued, time: DEMO_ANCHORS.issuedTime, city: 'Berlin' };
/** Das Versicherungszertifikat (CertObject) */
export interface DemoCert { ref: string; issued: string; premium: number; travelDays: number }
export const DEMO_CERT: DemoCert = { ref: 'HI-2026-04871', issued: DEMO_ANCHORS.issued, premium: 120, travelDays: 92 };

/** Feste Daten des Beispielkontos (sprachneutral), alle Termine aus DEMO_ANCHORS abgeleitet */
export const DEMO_DATA = {
  name: 'Areeba Omar', initials: 'AO', from: 'Karachi', to: 'Berlin',
  appointment: DEMO_ANCHORS.appointment, appliedOn: DEMO_ANCHORS.applied, arrivedOn: DEMO_ANCHORS.arrival,
  /** Maskierte IBAN der Kundin (die Empfaenger-IBAN der Partnerbank ist ein Platzhalter in AppScreens) */
  iban: 'DE89 •••• •••• 3000', cardLast4: '3000',
  balance: 1438.2, deposit: 11904, payout: 992, payoutsMade: 4, payoutsTotal: 12, nextPayout: '2027-06-01', /* M08: die Auszahlung vom 3. Mai steht schon in der Buchungsliste, also gebucht */
  premium: DEMO_CERT.premium, nextDebit: '2027-06-01', bonus: 500,
  transferRef: DEMO_LETTER.ref,
  docsReady: 3, docsTotal: 7,
  payouts: [
    { date: '2027-02-01', amount: 992, state: 'paid' as const },
    { date: '2027-03-01', amount: 992, state: 'paid' as const },
    { date: '2027-04-01', amount: 992, state: 'paid' as const },
    { date: '2027-05-03', amount: 992, state: 'paid' as const },
    { date: '2027-06-01', amount: 992, state: 'upcoming' as const },
  ],
  /** Buchungen des Bankkontos, neueste zuerst; key ist ein Schluessel in DemoCopy.txLabels */
  tx: [
    { key: 'grocery', date: '2027-05-08', amount: -23.45, icon: 'wallet' },
    { key: 'ticket', date: '2027-05-06', amount: -49, icon: 'plane' },
    { key: 'canteen', date: '2027-05-05', amount: -4.6, icon: 'euro' },
    { key: 'rent', date: '2027-05-03', amount: -420, icon: 'home' },
    { key: 'bonus', date: '2027-05-03', amount: 500, icon: 'spark' },
    { key: 'premium', date: '2027-05-01', amount: -120, icon: 'shield' },
    { key: 'payout', date: '2027-05-03', amount: 992, icon: 'bank' },
  ],
} as const;

/** Monatsnamen je Sprache (vorher in AppDashboard.astro); Urdu und Punjabi (Shahmukhi) teilen die Namen */
const MONTHS_UR = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
export const MONTHS: Record<Locale, string[]> = { en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ur: MONTHS_UR, pa: MONTHS_UR };
export const MONTHS_SHORT: Record<Locale, string[]> = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ur: MONTHS_UR, pa: MONTHS_UR };
const ymd = (iso: string) => iso.split('-').map(Number) as [number, number, number];
/** '2026-09-23' -> '23 September 2026' / '23 ستمبر 2026' */
export const demoDate = (iso: string, locale: Locale = 'en') => { const [y, m, d] = ymd(iso); return `${d} ${(MONTHS[locale] ?? MONTHS.en)[m - 1]} ${y}`; };
/** '2027-05-03' -> '3 May' / '3 مئی' */
export const demoDateShort = (iso: string, locale: Locale = 'en') => { const [, m, d] = ymd(iso); return `${d} ${(MONTHS_SHORT[locale] ?? MONTHS_SHORT.en)[m - 1]}`; };
/** Alle Datumsschluessel, die ein Text als {key} tragen darf: die Anker plus die Termine des Kontos */
const DATES: Record<string, string> = { ...DEMO_ANCHORS, nextDebit: DEMO_DATA.nextDebit, nextPayout: DEMO_DATA.nextPayout, premiumDebit: DEMO_DATA.tx.find((x) => x.key === 'premium')!.date };
/** Ersetzt {arrival}, {applied}, {nextDebit} ... durch das formatierte Datum der Sprache; {issuedTime} bleibt die Uhrzeit */
export const fillDates = (s: string, locale: Locale = 'en') => s.replace(/\{([a-zA-Z]+)\}/g, (m, k: string) => (k === 'issuedTime' ? DEMO_ANCHORS.issuedTime : k in DATES ? demoDate(DATES[k], locale) : m));

export interface DemoCopy {
  demo: string; before: string; after: string; demoNote: string;
  greet: { morning: string; afternoon: string; evening: string };
  state: { before: string; after: string };
  next: { kicker: string; title: string; text: string; cta: string; alt: string };
  appt: { label: string; inDays: string; today: string; passed: string; where: string; add: string };
  journey: { title: string; steps: { title: string; sub: string }[] };
  money: { title: string; state: string; inPkr: string; track: string[]; cta: string };
  docs: { title: string; progress: string; cta: string; items: string[] };
  tiles: { ba: string; hi: string; bank: string };
  support: { title: string; name: string; role: string; sub: string; cta: string; call: string };
  plan: { title: string; arrival: string; financing: string; financingValue: string; total: string; edit: string };
  balance: { label: string; iban: string; card: string; cardSub: string; send: string; add: string; freeze: string; frozen: string; copied: string };
  ba: { title: string; left: string; made: string; next: string; payouts: string; paid: string; upcoming: string; extend: string };
  tx: { title: string; all: string; today: string };
  txLabels: Record<'grocery' | 'ticket' | 'canteen' | 'rent' | 'bonus' | 'premium' | 'payout', string>;
  ins: { title: string; state: string; plan: string; next: string; card: string; doctor: string };
  todo: { title: string; items: string[]; done: string };
  bell: { title: string; empty: string; before: string[]; after: string[] };
  screens: { received: string; activatedOn: string; allReady: string };
  login: { demoTitle: string; demoText: string; before: string; after: string };
}

const en: DemoCopy = {
  demo: 'Demo account', before: 'Before departure', after: 'In Germany', demoNote: 'Sample data. Switch to see the same account three months later.',
  greet: { morning: 'Good morning, {name}', afternoon: 'Good afternoon, {name}', evening: 'Good evening, {name}' },
  state: { before: 'Before departure · Karachi', after: 'In Germany since {arrival} · Berlin' },
  next: { kicker: 'Next step · 2 of 4', title: 'Transfer your deposit', text: 'Send €11,904 with your reference. The confirmation letter is issued the day the money arrives, usually 2 to 4 business days after you send it.', cta: 'Show transfer details', alt: 'Pay in rupees' },
  appt: { label: 'Visa appointment', inDays: 'in {n} days', today: 'today', passed: '{n} days ago', where: 'German Embassy Islamabad · 09:30', add: 'Add to calendar' },
  journey: { title: 'Your journey', steps: [{ title: 'Applied', sub: '{applied}' }, { title: 'Deposit', sub: 'on its way' }, { title: 'Confirmation letter', sub: 'the day the money arrives' }, { title: 'Activate', sub: 'after landing' }] },
  money: { title: 'Your deposit', state: 'Not yet received', inPkr: 'about {pkr} at today\'s example rate', track: ['Transfer instructed', 'Received by the payments partner', 'Converted and forwarded', 'Arrived in your Blocked Account'], cta: 'I have sent the money' },
  docs: { title: 'Your embassy file', progress: '{a} of {b} documents ready', cta: 'Open your file', items: ['Travel health insurance certificate', 'Appointment confirmation', 'VIDEX form, printed and signed', 'Blocked Account confirmation letter'] },
  tiles: { ba: 'Blocked Account', hi: 'Health insurance', bank: 'Bank Account' },
  support: { title: 'Your contact', name: 'Zainab', role: 'Onboarding team · Lahore and Berlin', sub: 'Answers in Urdu, Punjabi and English, within 24 hours.', cta: 'WhatsApp', call: 'Book a call' },
  plan: { title: 'Your plan', arrival: 'Arrival', financing: 'Financing', financingValue: 'Own funds · €500 bonus after the third payout', total: 'To transfer before departure', edit: 'Change your plan' },
  balance: { label: 'Bank Account balance', iban: 'IBAN', card: 'Digital debit card', cardSub: 'In your phone wallet · Apple Pay and Google Pay', send: 'Send', add: 'Add money', freeze: 'Freeze card', frozen: 'Card frozen · tap to unfreeze', copied: 'Copied' },
  ba: { title: 'Blocked Account', left: '{amount} still blocked', made: '{n} of {m} payouts made', next: 'Next payout {amount} on {date}', payouts: 'Payouts', paid: 'Paid', upcoming: 'Upcoming', extend: 'Extend or close' },
  tx: { title: 'Recent transactions', all: 'See all', today: 'Today' },
  txLabels: { grocery: 'REWE · groceries', ticket: 'Deutschlandticket', canteen: 'Mensa · lunch', rent: 'Rent · Studentenwerk', bonus: 'Welcome bonus', premium: 'Health insurance premium', payout: 'Blocked Account payout' },
  ins: { title: 'Health insurance', state: 'Active since {arrival}', plan: 'Statutory student plan · €120 a month', next: 'Next debit {nextDebit}', card: 'Insurance card', doctor: 'Find an English-speaking doctor' },
  todo: { title: 'To do', items: ['Upload your residence permit after the appointment on {permitAppointment}', 'Decide by {extendBy} whether to extend or close the Blocked Account'], done: 'Done' },
  bell: { title: 'Notifications', empty: 'Nothing new', before: ['Your travel health insurance certificate is ready to download', 'Reminder: visa appointment on {appointment}'], after: ['Payout of €992 arrived in your Bank Account', 'Health insurance premium debited on {premiumDebit}'] },
  screens: { received: 'Deposit received on {received}. Your confirmation letter was issued the same day.', activatedOn: 'Activated on {arrival}', allReady: 'All documents issued' },
  login: { demoTitle: 'Try the demo account', demoText: 'Same customer, two moments: before departure and three months into life in Germany.', before: 'Before departure', after: 'In Germany' },
};

const ur: DemoCopy = {
  demo: 'ڈیمو اکاؤنٹ', before: 'روانگی سے پہلے', after: 'جرمنی میں', demoNote: 'نمونہ ڈیٹا۔ وہی اکاؤنٹ تین ماہ بعد دیکھنے کے لیے سوئچ کریں۔',
  greet: { morning: 'صبح بخیر، {name}', afternoon: 'دوپہر بخیر، {name}', evening: 'شام بخیر، {name}' },
  state: { before: 'روانگی سے پہلے · کراچی', after: '{arrival} سے جرمنی میں · برلن' },
  next: { kicker: 'اگلا مرحلہ · 4 میں سے 2', title: 'اپنی رقم ٹرانسفر کریں', text: 'اپنے حوالے کے ساتھ 11,904 یورو بھیجیں۔ تصدیقی خط اسی دن جاری ہوتا ہے جس دن رقم پہنچتی ہے، عموماً بھیجنے کے 2 سے 4 کاروباری دن بعد۔', cta: 'ٹرانسفر کی تفصیلات دکھائیں', alt: 'روپوں میں ادا کریں' },
  appt: { label: 'ویزا اپائنٹمنٹ', inDays: '{n} دن میں', today: 'آج', passed: '{n} دن پہلے', where: 'جرمن سفارت خانہ اسلام آباد · 09:30', add: 'کیلنڈر میں شامل کریں' },
  journey: { title: 'آپ کا سفر', steps: [{ title: 'درخواست دی', sub: '{applied}' }, { title: 'رقم', sub: 'راستے میں' }, { title: 'تصدیقی خط', sub: 'جس دن رقم پہنچے' }, { title: 'فعال کریں', sub: 'پہنچنے کے بعد' }] },
  money: { title: 'آپ کی رقم', state: 'ابھی موصول نہیں ہوئی', inPkr: 'آج کی مثالی شرح پر تقریباً {pkr}', track: ['ٹرانسفر کی ہدایت دی', 'پیمنٹ پارٹنر کو موصول', 'تبدیل اور آگے بھیجی', 'آپ کے بلاکڈ اکاؤنٹ میں پہنچی'], cta: 'میں نے رقم بھیج دی' },
  docs: { title: 'آپ کی سفارت خانہ فائل', progress: '{b} میں سے {a} دستاویزات تیار', cta: 'اپنی فائل کھولیں', items: ['ٹریول ہیلتھ انشورنس سرٹیفکیٹ', 'اپائنٹمنٹ کی تصدیق', 'VIDEX فارم، پرنٹ اور دستخط شدہ', 'بلاکڈ اکاؤنٹ تصدیقی خط'] },
  tiles: { ba: 'بلاکڈ اکاؤنٹ', hi: 'ہیلتھ انشورنس', bank: 'بینک اکاؤنٹ' },
  support: { title: 'آپ کا رابطہ', name: 'زینب', role: 'آن بورڈنگ ٹیم · لاہور اور برلن', sub: 'اردو، پنجابی اور انگریزی میں جواب، 24 گھنٹوں کے اندر۔', cta: 'واٹس ایپ', call: 'کال بک کریں' },
  plan: { title: 'آپ کا منصوبہ', arrival: 'آمد', financing: 'فنانسنگ', financingValue: 'اپنی رقم · تیسری ادائیگی کے بعد 500 یورو بونس', total: 'روانگی سے پہلے ٹرانسفر', edit: 'منصوبہ بدلیں' },
  balance: { label: 'بینک اکاؤنٹ بیلنس', iban: 'IBAN', card: 'ڈیجیٹل ڈیبٹ کارڈ', cardSub: 'آپ کے فون والٹ میں · ایپل پے اور گوگل پے', send: 'بھیجیں', add: 'رقم شامل کریں', freeze: 'کارڈ منجمد کریں', frozen: 'کارڈ منجمد · بحال کرنے کے لیے دبائیں', copied: 'کاپی ہو گیا' },
  ba: { title: 'بلاکڈ اکاؤنٹ', left: '{amount} ابھی بلاک', made: '{m} میں سے {n} ادائیگیاں ہو چکیں', next: 'اگلی ادائیگی {amount}، {date} کو', payouts: 'ادائیگیاں', paid: 'ادا شدہ', upcoming: 'آنے والی', extend: 'بڑھائیں یا بند کریں' },
  tx: { title: 'حالیہ لین دین', all: 'سب دیکھیں', today: 'آج' },
  txLabels: { grocery: 'REWE · گروسری', ticket: 'Deutschlandticket', canteen: 'Mensa · دوپہر کا کھانا', rent: 'کرایہ · Studentenwerk', bonus: 'خوش آمدید بونس', premium: 'ہیلتھ انشورنس پریمیم', payout: 'بلاکڈ اکاؤنٹ ادائیگی' },
  ins: { title: 'ہیلتھ انشورنس', state: '{arrival} سے فعال', plan: 'سرکاری اسٹوڈنٹ پلان · 120 یورو ماہانہ', next: 'اگلی کٹوتی {nextDebit}', card: 'انشورنس کارڈ', doctor: 'انگریزی بولنے والا ڈاکٹر تلاش کریں' },
  todo: { title: 'کرنے کے کام', items: ['{permitAppointment} کی اپائنٹمنٹ کے بعد اپنا رہائشی اجازت نامہ اپ لوڈ کریں', '{extendBy} تک فیصلہ کریں کہ بلاکڈ اکاؤنٹ بڑھانا ہے یا بند کرنا'], done: 'ہو گیا' },
  bell: { title: 'اطلاعات', empty: 'کچھ نیا نہیں', before: ['آپ کا ٹریول ہیلتھ انشورنس سرٹیفکیٹ ڈاؤن لوڈ کے لیے تیار ہے', 'یاد دہانی: ویزا اپائنٹمنٹ {appointment} کو'], after: ['992 یورو کی ادائیگی آپ کے بینک اکاؤنٹ میں پہنچ گئی', 'ہیلتھ انشورنس پریمیم {premiumDebit} کو کاٹ لیا گیا'] },
  screens: { received: 'رقم {received} کو موصول ہوئی۔ آپ کا تصدیقی خط اسی دن جاری ہوا۔', activatedOn: '{arrival} کو فعال', allReady: 'تمام دستاویزات جاری' },
  login: { demoTitle: 'ڈیمو اکاؤنٹ آزمائیں', demoText: 'وہی کسٹمر، دو لمحے: روانگی سے پہلے اور جرمنی میں زندگی کے تین ماہ بعد۔', before: 'روانگی سے پہلے', after: 'جرمنی میں' },
};

const pa: DemoCopy = {
  demo: 'ڈیمو اکاؤنٹ', before: 'روانگی توں پہلاں', after: 'جرمنی وچ', demoNote: 'نمونہ ڈیٹا۔ اوہو اکاؤنٹ تن مہینے بعد ویکھݨ لئی سوئچ کرو۔',
  greet: { morning: 'صبح بخیر، {name}', afternoon: 'دوپہر بخیر، {name}', evening: 'شام بخیر، {name}' },
  state: { before: 'روانگی توں پہلاں · کراچی', after: '{arrival} توں جرمنی وچ · برلن' },
  next: { kicker: 'اگلا قدم · 4 وچوں 2', title: 'آپݨی رقم ٹرانسفر کرو', text: 'آپݨے حوالے نال 11,904 یورو بھیجو۔ تصدیقی خط اوسے دن جاری ہوندا اے جس دن رقم پہنچدی اے، عام طور تے بھیجݨ توں 2 توں 4 کاروباری دن بعد۔', cta: 'ٹرانسفر دی تفصیل وکھاؤ', alt: 'روپیاں وچ ادا کرو' },
  appt: { label: 'ویزا اپائنٹمنٹ', inDays: '{n} دناں وچ', today: 'اج', passed: '{n} دن پہلاں', where: 'جرمن سفارت خانہ اسلام آباد · 09:30', add: 'کیلنڈر وچ شامل کرو' },
  journey: { title: 'تہاڈا سفر', steps: [{ title: 'درخواست دتی', sub: '{applied}' }, { title: 'رقم', sub: 'رستے وچ' }, { title: 'تصدیقی خط', sub: 'جس دن رقم پہنچے' }, { title: 'فعال کرو', sub: 'پہنچݨ توں بعد' }] },
  money: { title: 'تہاڈی رقم', state: 'ہالے موصول نہیں ہوئی', inPkr: 'اج دی مثالی شرح تے تقریباً {pkr}', track: ['ٹرانسفر دی ہدایت دتی', 'پیمنٹ پارٹنر نوں موصول', 'تبدیل تے اگے بھیجی', 'تہاڈے بلاکڈ اکاؤنٹ وچ پہنچی'], cta: 'میں رقم بھیج دتی' },
  docs: { title: 'تہاڈی سفارت خانہ فائل', progress: '{b} وچوں {a} دستاویزاں تیار', cta: 'آپݨی فائل کھولو', items: ['ٹریول ہیلتھ انشورنس سرٹیفکیٹ', 'اپائنٹمنٹ دی تصدیق', 'VIDEX فارم، پرنٹ تے دستخط شدہ', 'بلاکڈ اکاؤنٹ تصدیقی خط'] },
  tiles: { ba: 'بلاکڈ اکاؤنٹ', hi: 'ہیلتھ انشورنس', bank: 'بینک اکاؤنٹ' },
  support: { title: 'تہاڈا رابطہ', name: 'زینب', role: 'آن بورڈنگ ٹیم · لاہور تے برلن', sub: 'اردو، پنجابی تے انگریزی وچ جواب، 24 گھنٹیاں دے اندر۔', cta: 'واٹس ایپ', call: 'کال بک کرو' },
  plan: { title: 'تہاڈا منصوبہ', arrival: 'آمد', financing: 'فنانسنگ', financingValue: 'آپݨی رقم · تیجی ادائیگی توں بعد 500 یورو بونس', total: 'روانگی توں پہلاں ٹرانسفر', edit: 'منصوبہ بدلو' },
  balance: { label: 'بینک اکاؤنٹ بیلنس', iban: 'IBAN', card: 'ڈیجیٹل ڈیبٹ کارڈ', cardSub: 'تہاڈے فون والٹ وچ · ایپل پے تے گوگل پے', send: 'بھیجو', add: 'رقم شامل کرو', freeze: 'کارڈ منجمد کرو', frozen: 'کارڈ منجمد · بحال کرݨ لئی دباؤ', copied: 'کاپی ہو گیا' },
  ba: { title: 'بلاکڈ اکاؤنٹ', left: '{amount} ہالے بلاک', made: '{m} وچوں {n} ادائیگیاں ہو چکیاں', next: 'اگلی ادائیگی {amount}، {date} نوں', payouts: 'ادائیگیاں', paid: 'ادا شدہ', upcoming: 'آؤݨ والی', extend: 'ودھاؤ یا بند کرو' },
  tx: { title: 'حالیہ لین دین', all: 'سبھ ویکھو', today: 'اج' },
  txLabels: { grocery: 'REWE · گروسری', ticket: 'Deutschlandticket', canteen: 'Mensa · دوپہر دا کھاݨا', rent: 'کرایہ · Studentenwerk', bonus: 'جی آیاں نوں بونس', premium: 'ہیلتھ انشورنس پریمیم', payout: 'بلاکڈ اکاؤنٹ ادائیگی' },
  ins: { title: 'ہیلتھ انشورنس', state: '{arrival} توں فعال', plan: 'سرکاری سٹوڈنٹ پلان · 120 یورو مہینے دا', next: 'اگلی کٹوتی {nextDebit}', card: 'انشورنس کارڈ', doctor: 'انگریزی بولݨ والا ڈاکٹر لبھو' },
  todo: { title: 'کرݨ والے کم', items: ['{permitAppointment} دی اپائنٹمنٹ توں بعد آپݨا رہائشی اجازت نامہ اپ لوڈ کرو', '{extendBy} تک فیصلہ کرو کہ بلاکڈ اکاؤنٹ ودھاؤݨا اے یا بند کرݨا'], done: 'ہو گیا' },
  bell: { title: 'اطلاعاں', empty: 'کجھ نواں نہیں', before: ['تہاڈا ٹریول ہیلتھ انشورنس سرٹیفکیٹ ڈاؤن لوڈ لئی تیار اے', 'یاد دہانی: ویزا اپائنٹمنٹ {appointment} نوں'], after: ['992 یورو دی ادائیگی تہاڈے بینک اکاؤنٹ وچ پہنچ گئی', 'ہیلتھ انشورنس پریمیم {premiumDebit} نوں کٹ گیا'] },
  screens: { received: 'رقم {received} نوں موصول ہوئی۔ تہاڈا تصدیقی خط اوسے دن جاری ہویا۔', activatedOn: '{arrival} نوں فعال', allReady: 'ساریاں دستاویزاں جاری' },
  login: { demoTitle: 'ڈیمو اکاؤنٹ ازماؤ', demoText: 'اوہو گاہک، دو لمحے: روانگی توں پہلاں تے جرمنی وچ زندگی دے تن مہینے بعد۔', before: 'روانگی توں پہلاں', after: 'جرمنی وچ' },
};

export const DEMO: Record<Locale, DemoCopy> = { en, ur, pa };
