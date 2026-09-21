/**
 * Texte des Studienkredit-Angebots je Sprache (07-PROMPT-STUDIENKREDIT.md). Zahlen, die noch nicht feststehen,
 * sind Platzhalter aus PH; die Liste dazu liegt in design-upgrade/OFFENE-ZAHLEN.md.
 * Urdu und Punjabi (Shahmukhi) sind vollwertige Sprachfassungen (Jan 19.09.).
 * Sperrbetrag exakt wie im Kostenblock von /blocked-account (Sektion s10): 992 x 12 = 11.904 Euro.
 */
import type { Locale } from './i18n';

export const DEPOSIT = '€11,904';
export const DEPOSIT_MONTHLY = '€992';

/** Beispielwerte fuer das Mockup (Jans Vorgabe 18.09.: Platzhalter mit Beispielzahlen fuellen). Nicht bestaetigt;
 *  Liste und Herkunft der Annahmen in design-upgrade/OFFENE-ZAHLEN.md. Partnerbanken bleiben ohne Namen. */
/** Betraege in Urdu und Punjabi: "11,904 یورو" statt "€11,904" (im RTL-Satz rutscht das Eurozeichen sonst hinter die Zahl, Rundgang 19.09.) */
export const rtlMoney = (s: string) => s.replace(/€\s?([\d,.]+)/g, '$1 یورو');
export const PH = {
  financingCost: '€2,150',
  total: '€14,054',
  term: '24 months',
  repaymentStart: 'six months after you arrive in Germany',
  maxAmount: '€11,904',
  banks: 'Our partner banks are commercial banks in Pakistan; we name them on your application.',
  visaRefused: 'The loan is cancelled and the bank gets the deposit back directly from the Blocked Account. You pay nothing.',
  requirements: 'A guarantor in Pakistan with a regular income, or collateral the partner bank accepts.',
  bonusConditions: 'Keep your Blocked Account for at least six months after arrival. If you close it earlier, the €500 is deducted from your final payout.',
} as const;

export interface LoanCopy {
  title: string; description: string;
  kicker: string; h1: string; lead: string; ctaQualify: string; ctaHow: string;
  home: { lead: string; kpis: [string, string][]; object: { title: string; meta: string; status: string; paid: string; interest: string; paidBy: string; repay: string; foot: string } };
  bonus: { h3: string; text: string; link: string; conditions: string; toast: { title: string; sub: string; amount: string } };
  how: { h2: string; steps: { title: string; text: string }[] };
  costs: { h2: string; head: [string, string]; rows: { label: string; a: string; b: string }[]; note: string };
  who: { h2: string; items: string[] };
  why: { h2: string; text: string };
  bonusH2: string;
  faq: { h2: string; items: { q: string; a: string }[] };
  closing: { h2: string; cta: string };
  footnote: string;
  hint: { text: string; link: string };
  plansLine: { text: string; link: string };
}

const en: LoanCopy = {
  title: 'Interest-free study loan for your Blocked Account | EC Assets',
  description: 'Our partner banks fund your Blocked Account and EC Assets pays the interest directly to the bank. You repay only what you received.',
  kicker: 'Study loan · we pay the interest',
  h1: "Don't have the deposit yet? We finance it.", /* 21.09.: vorher "Come to Germany even if the money isn't there." (klang, als gaebe es das Visum ohne Geld) */
  lead: "A Blocked Account needs the full amount in one place before your visa appointment. If your family can't put that up, our partner banks can, and we pay the interest, so you repay only what you received.",
  ctaQualify: 'Check if you qualify',
  ctaHow: 'How it works',
  home: {
    lead: 'We arrange your Blocked Account funding through our partner banks and pay the interest ourselves, directly to the bank. You repay the amount you received. Nothing on top.',
    kpis: [[PH.financingCost, 'interest on a comparable loan, paid by us'], ['€0', 'interest paid by you']],
    object: { title: 'Study loan', meta: 'Partner bank · into your Blocked Account', status: 'funded', paid: 'Paid into your Blocked Account', interest: 'Interest', paidBy: 'paid by EC Assets', repay: 'You repay', foot: `Repayment starts ${PH.repaymentStart}.` },
  },
  bonus: {
    h3: 'Funding it yourself? Then €500 is on us.',
    text: 'Bring your own funds and we send you €500 once your visa is approved and your third monthly payout has gone through, straight into your German bank account.',
    link: 'See the conditions',
    toast: { title: 'Welcome bonus', sub: 'Bank Account · after your third payout', amount: '+€500.00' },
    conditions: PH.bonusConditions,
  },
  how: {
    h2: 'How it works',
    steps: [
      { title: 'Check if you qualify', text: 'Answer a few questions. Takes two minutes and costs nothing.' },
      { title: 'Apply through us', text: 'One application. We pass it to the partner bank and handle the paperwork with them.' },
      { title: 'The money goes to your Blocked Account', text: 'The bank transfers directly into the account in your name. You never handle the transfer yourself.' },
      { title: 'You repay what you received', text: `Repayment starts ${PH.repaymentStart}. We settle the interest with the bank. It never appears on your statement.` },
    ],
  },
  costs: {
    h2: 'What it costs you',
    head: ['A comparable loan', 'Through EC Assets'],
    rows: [
      { label: 'Amount you receive', a: DEPOSIT, b: DEPOSIT },
      { label: 'Interest', a: PH.financingCost, b: '€0, we pay it' },
      { label: 'Total you repay', a: PH.total, b: DEPOSIT },
    ],
    note: `Amounts based on the 2026 deposit of ${DEPOSIT} (${DEPOSIT_MONTHLY} × 12 months), as shown on the Blocked Account page.`,
  },
  who: {
    h2: 'Who can apply',
    items: [
      PH.requirements,
      'You are applying for a German student visa.',
      `The loan is issued by our partner banks, so the programme is available where those banks operate. ${PH.banks}`,
      'The partner bank approves your application. They make the credit decision, not us.',
    ],
  },
  why: {
    h2: 'Why we do this',
    text: 'We earn when you stay with us, through your account and your insurance, over the years you are in Germany. Paying your interest up front is how we win you as a customer instead of spending the same money on advertising. The payment goes straight to the bank and never passes through your hands.',
  },
  bonusH2: 'If you fund it yourself',
  faq: {
    h2: 'Frequently asked questions',
    items: [
      { q: 'Is this really interest-free?', a: 'For you, yes. The bank charges its usual interest; we pay it directly and in full. You repay the amount that was paid into your Blocked Account.' },
      { q: 'Who decides whether I get the loan?', a: 'The partner bank. We prepare and submit the application, but the credit decision is theirs.' },
      { q: 'Can I use a loan from my own bank?', a: 'No. The programme only works through our partner banks, because that is where the arrangement to cover your interest exists.' },
      { q: 'Does the money come to me?', a: 'No. It goes straight into the Blocked Account in your name. That is a requirement of the visa process and a protection for you.' },
      { q: 'When does repayment start?', a: `Repayment starts ${PH.repaymentStart}, in monthly instalments. The term and the instalment are set by the partner bank and shown to you before you sign.` },
      { q: 'What if my visa is refused?', a: PH.visaRefused },
    ],
  },
  closing: { h2: 'Find out in two minutes whether you qualify.', cta: 'Check if you qualify' },
  footnote: `The study loan is issued by our partner banks in Pakistan; they make the credit decision. EC Assets pays the interest directly to the bank. Interest, repayment term and start of repayment shown here are example figures for this mockup, based on a 24-month loan of €11,904, and will be confirmed with the partner banks.`,
  hint: { text: "Can't put up the full amount? We can arrange financing.", link: 'Interest-free study loan' },
  plansLine: { text: 'Not enough for the deposit? We finance it, and we pay the interest.', link: 'Interest-free study loan' },
};

const ur: LoanCopy = {
  title: 'آپ کے بلاکڈ اکاؤنٹ کے لیے سود سے پاک تعلیمی قرض | EC Assets',
  description: 'ہمارے پارٹنر بینک آپ کے بلاکڈ اکاؤنٹ کی رقم فراہم کرتے ہیں اور EC Assets سود براہِ راست بینک کو ادا کرتا ہے۔ آپ صرف وہی رقم واپس کرتے ہیں جو آپ کو ملی۔',
  kicker: 'تعلیمی قرض · سود ہم ادا کرتے ہیں',
  h1: 'ابھی ڈپازٹ نہیں ہے؟ ہم اس کی فنانسنگ کرتے ہیں۔', /* Entwurf 21.09. */
  lead: 'ویزا اپائنٹمنٹ سے پہلے بلاکڈ اکاؤنٹ میں پوری رقم ایک جگہ ہونی چاہیے۔ اگر آپ کا خاندان یہ رقم فراہم نہیں کر سکتا تو ہمارے پارٹنر بینک کر سکتے ہیں، اور سود ہم ادا کرتے ہیں، اس لیے آپ صرف وہی واپس کرتے ہیں جو آپ کو ملا۔',
  ctaQualify: 'دیکھیں کہ آپ اہل ہیں یا نہیں',
  ctaHow: 'یہ کیسے کام کرتا ہے',
  home: {
    lead: 'ہم اپنے پارٹنر بینکوں کے ذریعے آپ کے بلاکڈ اکاؤنٹ کی فنانسنگ کا انتظام کرتے ہیں اور سود خود، براہِ راست بینک کو ادا کرتے ہیں۔ آپ وہی رقم واپس کرتے ہیں جو آپ کو ملی۔ اس سے زیادہ کچھ نہیں۔',
    kpis: [[rtlMoney(PH.financingCost), 'عام قرض پر سود، ہم ادا کرتے ہیں'], ['0 یورو', 'سود جو آپ دیتے ہیں']],
    object: { title: 'تعلیمی قرض', meta: 'پارٹنر بینک · آپ کے بلاکڈ اکاؤنٹ میں', status: 'جمع شدہ', paid: 'آپ کے بلاکڈ اکاؤنٹ میں جمع', interest: 'سود', paidBy: 'EC Assets نے ادا کیا', repay: 'آپ واپس کرتے ہیں', foot: 'واپسی جرمنی پہنچنے کے چھ ماہ بعد شروع ہوتی ہے۔' },
  },
  bonus: {
    h3: 'رقم خود لا رہے ہیں؟ تو 500 یورو ہماری طرف سے۔',
    text: 'اپنی رقم خود لائیں اور ویزا منظور ہونے اور تیسری ماہانہ ادائیگی کے بعد ہم آپ کو 500 یورو بھیجتے ہیں، سیدھے آپ کے جرمن بینک اکاؤنٹ میں۔',
    link: 'شرائط دیکھیں',
    toast: { title: 'خوش آمدید بونس', sub: 'بینک اکاؤنٹ · تیسری ادائیگی کے بعد', amount: '+500.00 یورو' },
    conditions: 'آمد کے بعد کم از کم چھ ماہ تک اپنا بلاکڈ اکاؤنٹ رکھیں۔ پہلے بند کرنے پر 500 یورو آپ کی آخری ادائیگی سے کاٹ لیے جاتے ہیں۔',
  },
  how: {
    h2: 'یہ کیسے کام کرتا ہے',
    steps: [
      { title: 'دیکھیں کہ آپ اہل ہیں', text: 'چند سوالوں کے جواب دیں۔ دو منٹ لگتے ہیں اور کوئی خرچ نہیں۔' },
      { title: 'ہمارے ذریعے درخواست دیں', text: 'ایک درخواست۔ ہم اسے پارٹنر بینک کو بھیجتے ہیں اور کاغذی کارروائی ان کے ساتھ خود نمٹاتے ہیں۔' },
      { title: 'رقم آپ کے بلاکڈ اکاؤنٹ میں جاتی ہے', text: 'بینک براہِ راست آپ کے نام کے اکاؤنٹ میں منتقل کرتا ہے۔ آپ کو خود کوئی ٹرانسفر نہیں کرنا پڑتا۔' },
      { title: 'آپ وہی واپس کرتے ہیں جو آپ کو ملا', text: 'واپسی جرمنی پہنچنے کے چھ ماہ بعد شروع ہوتی ہے۔ سود ہم بینک کے ساتھ طے کرتے ہیں۔ وہ آپ کے اسٹیٹمنٹ پر کبھی نظر نہیں آتی۔' },
    ],
  },
  costs: {
    h2: 'آپ کا خرچ کیا ہے',
    head: ['عام قرض', 'EC Assets کے ذریعے'],
    rows: [
      { label: 'جو رقم آپ کو ملتی ہے', a: rtlMoney(DEPOSIT), b: rtlMoney(DEPOSIT) },
      { label: 'سود', a: rtlMoney(PH.financingCost), b: '0 یورو، ہم ادا کرتے ہیں' },
      { label: 'کل واپسی', a: rtlMoney(PH.total), b: rtlMoney(DEPOSIT) },
    ],
    note: `رقوم 2026 کے ڈپازٹ ${rtlMoney(DEPOSIT)} (${rtlMoney(DEPOSIT_MONTHLY)} × 12 ماہ) پر مبنی ہیں، جیسا کہ بلاکڈ اکاؤنٹ کے صفحے پر دکھایا گیا ہے۔`,
  },
  who: {
    h2: 'کون درخواست دے سکتا ہے',
    items: [
      'پاکستان میں ایک ضامن جس کی باقاعدہ آمدنی ہو، یا ایسی ضمانت جو پارٹنر بینک قبول کرے۔',
      'آپ جرمن اسٹوڈنٹ ویزے کے لیے درخواست دے رہے ہیں۔',
      'قرض ہمارے پارٹنر بینک جاری کرتے ہیں، اس لیے یہ پروگرام وہیں دستیاب ہے جہاں یہ بینک کام کرتے ہیں۔ ہمارے پارٹنر بینک پاکستان کے کمرشل بینک ہیں؛ نام آپ کی درخواست پر بتائے جاتے ہیں۔',
      'پارٹنر بینک آپ کی درخواست منظور کرتا ہے۔ قرض کا فیصلہ وہ کرتے ہیں، ہم نہیں۔',
    ],
  },
  why: {
    h2: 'ہم یہ کیوں کرتے ہیں',
    text: 'ہم تب کماتے ہیں جب آپ ہمارے ساتھ رہتے ہیں، آپ کے اکاؤنٹ اور انشورنس کے ذریعے، ان برسوں میں جو آپ جرمنی میں گزارتے ہیں۔ آپ کی سود پہلے سے ادا کرنا ہمارا طریقہ ہے آپ کو بطور صارف حاصل کرنے کا، بجائے اس کے کہ وہی رقم اشتہارات پر خرچ ہو۔ ادائیگی سیدھی بینک کو جاتی ہے اور کبھی آپ کے ہاتھ سے نہیں گزرتی۔',
  },
  bonusH2: 'اگر آپ خود رقم لاتے ہیں',
  faq: {
    h2: 'اکثر پوچھے جانے والے سوالات',
    items: [
      { q: 'کیا یہ واقعی سود سے پاک ہے؟', a: 'آپ کے لیے، ہاں۔ بینک اپنی معمول کا سود لیتا ہے؛ ہم اسے براہِ راست اور پوری ادا کرتے ہیں۔ آپ وہی رقم واپس کرتے ہیں جو آپ کے بلاکڈ اکاؤنٹ میں جمع ہوئی۔' },
      { q: 'قرض ملنے کا فیصلہ کون کرتا ہے؟', a: 'پارٹنر بینک۔ ہم درخواست تیار کر کے جمع کراتے ہیں، لیکن قرض کا فیصلہ ان کا ہوتا ہے۔' },
      { q: 'کیا میں اپنے بینک کا قرض استعمال کر سکتا ہوں؟', a: 'نہیں۔ یہ پروگرام صرف ہمارے پارٹنر بینکوں کے ذریعے کام کرتا ہے، کیونکہ آپ کی سود ادا کرنے کا انتظام وہیں موجود ہے۔' },
      { q: 'کیا رقم مجھے ملتی ہے؟', a: 'نہیں۔ یہ سیدھی آپ کے نام کے بلاکڈ اکاؤنٹ میں جاتی ہے۔ یہ ویزا کے عمل کی شرط ہے اور آپ کے لیے تحفظ بھی۔' },
      { q: 'واپسی کب شروع ہوتی ہے؟', a: 'جرمنی پہنچنے کے چھ ماہ بعد، ماہانہ قسطوں میں۔ مدت اور قسط پارٹنر بینک طے کرتا ہے اور دستخط سے پہلے آپ کو دکھائی جاتی ہے۔' },
      { q: 'اگر میرا ویزا مسترد ہو جائے تو؟', a: 'قرض منسوخ ہو جاتا ہے اور بینک کو ڈپازٹ براہِ راست بلاکڈ اکاؤنٹ سے واپس ملتا ہے۔ آپ کچھ ادا نہیں کرتے، سیٹ اپ فیس بھی نہیں۔' },
    ],
  },
  closing: { h2: 'دو منٹ میں جانیں کہ آپ اہل ہیں یا نہیں۔', cta: 'دیکھیں کہ آپ اہل ہیں یا نہیں' },
  footnote: `تعلیمی قرض پاکستان میں ہمارے پارٹنر بینک جاری کرتے ہیں؛ قرض کا فیصلہ وہ کرتے ہیں۔ EC Assets سود براہِ راست بینک کو ادا کرتا ہے۔ یہاں دکھائی گئی سود، مدت اور واپسی کا آغاز اس ماک اپ کے لیے مثالی اعداد ہیں (24 ماہ، 11,904 یورو) اور پارٹنر بینکوں کے ساتھ طے کیے جائیں گے۔`,
  hint: { text: 'پوری رقم فراہم نہیں کر سکتے؟ ہم فنانسنگ کا انتظام کر سکتے ہیں۔', link: 'سود سے پاک تعلیمی قرض' },
  plansLine: { text: 'ڈپازٹ کے لیے رقم کم ہے؟ ہم اس کی فنانسنگ کرتے ہیں، اور سود ہم ادا کرتے ہیں۔', link: 'سود سے پاک تعلیمی قرض' },
};

const pa: LoanCopy = {
  title: 'تہاڈے بلاکڈ اکاؤنٹ لئی بغیر سود تعلیمی قرضہ | EC Assets',
  description: 'ساڈے پارٹنر بینک تہاڈے بلاکڈ اکاؤنٹ دی رقم دیندے نیں تے EC Assets سود سدھا بینک نوں ادا کردا اے۔ تسیں صرف اوہی رقم واپس کردے او جیہڑی تہانوں ملی۔',
  kicker: 'تعلیمی قرضہ · سود اسیں دیندے آں',
  h1: 'ہالے ڈپازٹ نہیں؟ اسیں ایہدی فنانسنگ کرنے آں۔', /* Entwurf 21.09. */
  lead: 'ویزا اپائنٹمنٹ توں پہلاں بلاکڈ اکاؤنٹ وچ پوری رقم اک تھاں ہوݨی چاہیدی اے۔ جے تہاڈا ٹبر ایہ رقم نہیں دے سکدا تے ساڈے پارٹنر بینک دے سکدے نیں، تے سود اسیں ادا کردے آں، ایس لئی تسیں صرف اوہی واپس کردے او جو تہانوں ملیا۔',
  ctaQualify: 'ویکھو کہ تسیں اہل او یا نہیں',
  ctaHow: 'ایہ کیویں کم کردا اے',
  home: {
    lead: 'اسیں آپݨے پارٹنر بینکاں راہیں تہاڈے بلاکڈ اکاؤنٹ دی فنانسنگ دا انتظام کردے آں تے سود آپ، سدھا بینک نوں ادا کردے آں۔ تسیں اوہی رقم واپس کردے او جیہڑی تہانوں ملی۔ اوس توں ودھ کجھ نہیں۔',
    kpis: [[rtlMoney(PH.financingCost), 'عام قرضے تے سود، اسیں دیندے آں'], ['0 یورو', 'سود جیہڑا تسیں دیندے او']],
    object: { title: 'تعلیمی قرضہ', meta: 'پارٹنر بینک · تہاڈے بلاکڈ اکاؤنٹ وچ', status: 'جمع شدہ', paid: 'تہاڈے بلاکڈ اکاؤنٹ وچ جمع', interest: 'سود', paidBy: 'EC Assets نے ادا کیتا', repay: 'تسیں واپس کردے او', foot: 'واپسی جرمنی پہنچݨ توں چھ مہینے بعد شروع ہوندی اے۔' },
  },
  bonus: {
    h3: 'رقم آپ لیا رہے او؟ تے 500 یورو ساڈے ولوں۔',
    text: 'آپݨی رقم آپ لیاؤ تے ویزا منظور ہوݨ تے تیجی ماہانہ ادائیگی توں بعد اسیں تہانوں 500 یورو بھیجدے آں، سدھے تہاڈے جرمن بینک اکاؤنٹ وچ۔',
    link: 'شرطاں ویکھو',
    toast: { title: 'جی آیاں نوں بونس', sub: 'بینک اکاؤنٹ · تیجی ادائیگی توں بعد', amount: '+500.00 یورو' },
    conditions: 'آمد توں بعد گھٹو گھٹ چھ مہینے آپݨا بلاکڈ اکاؤنٹ رکھو۔ پہلاں بند کرن تے 500 یورو تہاڈی آخری ادائیگی توں کٹ لئے جاندے نیں۔',
  },
  how: {
    h2: 'ایہ کیویں کم کردا اے',
    steps: [
      { title: 'ویکھو کہ تسیں اہل او', text: 'کجھ سوالاں دے جواب دیو۔ دو منٹ لگدے نیں تے کوئی خرچ نہیں۔' },
      { title: 'ساڈے راہیں درخواست دیو', text: 'اک درخواست۔ اسیں اینوں پارٹنر بینک نوں بھیجدے آں تے کاغذی کم اوہناں نال آپ نبیڑدے آں۔' },
      { title: 'رقم تہاڈے بلاکڈ اکاؤنٹ وچ جاندی اے', text: 'بینک سدھا تہاڈے ناں دے اکاؤنٹ وچ منتقل کردا اے۔ تہانوں آپ کوئی ٹرانسفر نہیں کرنا پیندا۔' },
      { title: 'تسیں اوہی واپس کردے او جو تہانوں ملیا', text: 'واپسی جرمنی پہنچݨ توں چھ مہینے بعد شروع ہوندی اے۔ سود اسیں بینک نال طے کردے آں۔ اوہ تہاڈے اسٹیٹمنٹ تے کدے نظر نہیں آؤندا۔' },
    ],
  },
  costs: {
    h2: 'تہاڈا خرچ کیہ اے',
    head: ['عام قرضہ', 'EC Assets راہیں'],
    rows: [
      { label: 'جیہڑی رقم تہانوں ملدی اے', a: rtlMoney(DEPOSIT), b: rtlMoney(DEPOSIT) },
      { label: 'سود', a: rtlMoney(PH.financingCost), b: '0 یورو، اسیں ادا کردے آں' },
      { label: 'کل واپسی', a: rtlMoney(PH.total), b: rtlMoney(DEPOSIT) },
    ],
    note: `رقماں 2026 دے ڈپازٹ ${rtlMoney(DEPOSIT)} (${rtlMoney(DEPOSIT_MONTHLY)} × 12 مہینے) تے مبنی نیں، جیویں بلاکڈ اکاؤنٹ دے صفحے تے دسیا گیا اے۔`,
  },
  who: {
    h2: 'کون درخواست دے سکدا اے',
    items: [
      'پاکستان وچ اک ضامن جیدی باقاعدہ آمدن ہووے، یا اجیہی ضمانت جیہڑی پارٹنر بینک منظور کرے۔',
      'تسیں جرمن اسٹوڈنٹ ویزے لئی درخواست دے رہے او۔',
      'قرضہ ساڈے پارٹنر بینک جاری کردے نیں، ایس لئی ایہ پروگرام اوتھے دستیاب اے جتھے ایہ بینک کم کردے نیں۔ ساڈے پارٹنر بینک پاکستان دے کمرشل بینک نیں؛ ناں تہاڈی درخواست تے دسے جاندے نیں۔',
      'پارٹنر بینک تہاڈی درخواست منظور کردا اے۔ قرضے دا فیصلہ اوہ کردے نیں، اسیں نہیں۔',
    ],
  },
  why: {
    h2: 'اسیں ایہ کیوں کردے آں',
    text: 'اسیں اودوں کماندے آں جدوں تسیں ساڈے نال رہندے او، تہاڈے اکاؤنٹ تے انشورنس راہیں، اوہناں ورھیاں وچ جیہڑے تسیں جرمنی وچ گزاردے او۔ تہاڈی سود پہلاں ادا کرنا ساڈا طریقہ اے تہانوں گاہک بݨاؤن دا، بجائے ایس دے کہ اوہی رقم اشتہاراں تے لگے۔ ادائیگی سدھی بینک نوں جاندی اے تے کدے تہاڈے ہتھوں نہیں لنگھدی۔',
  },
  bonusH2: 'جے تسیں آپ رقم لیاندے او',
  faq: {
    h2: 'اکثر پچھے جاݨ والے سوال',
    items: [
      { q: 'کیہ ایہ واقعی بغیر سود اے؟', a: 'تہاڈے لئی، ہاں۔ بینک آپݨا عام سود لیندا اے؛ اسیں اوہ سدھا تے پورا ادا کردے آں۔ تسیں اوہی رقم واپس کردے او جیہڑی تہاڈے بلاکڈ اکاؤنٹ وچ جمع ہوئی۔' },
      { q: 'قرضہ ملݨ دا فیصلہ کون کردا اے؟', a: 'پارٹنر بینک۔ اسیں درخواست تیار کر کے جمع کراندے آں، پر قرضے دا فیصلہ اوہناں دا ہوندا اے۔' },
      { q: 'کیہ میں آپݨے بینک دا قرضہ ورت سکدا آں؟', a: 'نہیں۔ ایہ پروگرام صرف ساڈے پارٹنر بینکاں راہیں کم کردا اے، کیوں جے تہاڈی سود ادا کرن دا انتظام اوتھے ای موجود اے۔' },
      { q: 'کیہ رقم مینوں ملدی اے؟', a: 'نہیں۔ ایہ سدھی تہاڈے ناں دے بلاکڈ اکاؤنٹ وچ جاندی اے۔ ایہ ویزا دے عمل دی شرط اے تے تہاڈے لئی حفاظت وی۔' },
      { q: 'واپسی کدوں شروع ہوندی اے؟', a: 'جرمنی پہنچݨ توں چھ مہینے بعد، مہینے دیاں قسطاں وچ۔ مدت تے قسط پارٹنر بینک طے کردا اے تے دستخط توں پہلاں تہانوں دکھائی جاندی اے۔' },
      { q: 'جے میرا ویزا رد ہو جاوے تے؟', a: 'قرضہ منسوخ ہو جاندا اے تے بینک نوں ڈپازٹ سدھا بلاکڈ اکاؤنٹ توں واپس ملدا اے۔ تسیں کجھ ادا نہیں کردے، سیٹ اپ فیس وی نہیں۔' },
    ],
  },
  closing: { h2: 'دو منٹاں وچ جاݨو کہ تسیں اہل او یا نہیں۔', cta: 'ویکھو کہ تسیں اہل او یا نہیں' },
  footnote: `تعلیمی قرضہ پاکستان وچ ساڈے پارٹنر بینک جاری کردے نیں؛ قرضے دا فیصلہ اوہ کردے نیں۔ EC Assets سود سدھا بینک نوں ادا کردا اے۔ ایتھے دسے سود، مدت تے واپسی دا آغاز ایس ماک اپ لئی مثالی انگ نیں (24 مہینے، 11,904 یورو) تے پارٹنر بینکاں نال طے کیتے جاݨ گے۔`,
  hint: { text: 'پوری رقم نہیں دے سکدے؟ اسیں فنانسنگ دا انتظام کر سکدے آں۔', link: 'بغیر سود تعلیمی قرضہ' },
  plansLine: { text: 'ڈپازٹ لئی رقم گھٹ اے؟ اسی ایہدی فنانسنگ کردے آں، تے سود اسی دیندے آں۔', link: 'بغیر سود تعلیمی قرضہ' },
};

export const LOAN: Partial<Record<Locale, LoanCopy>> & { en: LoanCopy } = { en, ur, pa };
