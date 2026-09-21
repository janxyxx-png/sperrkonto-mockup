/**
 * Texte der Preisseite /pricing (18-NAECHSTES-LEVEL Hebel 5): Vergleich der drei Optionen, Gesamtkosten des Umzugs,
 * Vergleich mit anderen Anbietern (Namen und Zahlen als Platzhalter, bis sie am Stichtag geprueft sind; Hausregel: kein Vorlagenname im Build).
 * Preise aus facts.ts. Urdu und Punjabi (Shahmukhi) sind vollwertige Sprachfassungen (Jan 19.09.).
 * Runde 29 (M07): titleTail (Rest der Preis-Headline hinter der Zahl), lines.afterMonthly und lines.first90 fuer die zwei
 * Hauptbuch-Karten des Rechners; paths, compRows und compNote bleiben als Daten, werden aber nicht mehr gerendert.
 */
import type { Locale } from './i18n';

export type Cell = true | false | string;
export interface PricingCopy {
  kicker: string; title: string; titleTail: string; lead: string;
  cols: [string, string, string]; feature: string; rows: { label: string; cells: [Cell, Cell, Cell] }[]; premiumNote: string; choose: string;
  includedTitle: string; paths: { title: string; own: { figure: string; tag: string; title: string; text: string; link: string }; loan: { figure: string; tag: string; title: string; text: string; link: string } };
  calcTitle: string; calcLead: string; age: string; months: string; city: string; cities: { key: string; label: string; rent: number }[]; flight: string; rate: string; rateNote: string;
  lines: { deposit: string; setup: string; monthly: string; insurance: string; rent: string; flight: string; total: string; totalPkr: string; reserve: string; afterMonthly: string; first90: string }; exampleNote: string;
  compTitle: string; compLead: string; compCols: string[]; compRows: { label: string; ours: string; others: string[] }[]; compNote: string;
  faqTitle: string; cta: string;
  when: { title: string; items: { title: string; text: string }[] };
}

const en: PricingCopy = {
  kicker: 'Pricing', title: 'One price. Nothing hidden.', titleTail: 'a month.', lead: '{{price.monthly}} a month, no set-up fee. Your deposit stays your money. Insurance is billed only after you arrive.',
  cols: ['Blocked Account only', 'Complete Setup', 'Health Insurance only'], feature: 'What you get',
  rows: [
    { label: 'Blocked Account with confirmation letter for the embassy', cells: [true, true, false] },
    { label: 'German Bank Account with debit card, no account fee', cells: [true, true, false] },
    { label: 'Travel health insurance for the first weeks', cells: [false, true, true] },
    { label: 'German health insurance, statutory or private', cells: [false, true, true] },
    { label: 'Interest-free study loan for the deposit (student visa)', cells: [true, true, false] },
    { label: 'Full refund if your visa is refused', cells: [true, true, true] },
    { label: 'Set-up fee', cells: ['{{price.setup}}', '{{price.setup}}', 'none'] },
    { label: 'Monthly fee', cells: ['{{price.monthly}}', '{{price.monthly}}', 'none'] },
    { label: 'Insurance premium', cells: ['not included', 'by age, billed on arrival', 'by age, billed on arrival'] },
  ],
  premiumNote: 'Premium examples: statutory student plan about €120 a month under 30, private student plan from about €125. The exact premium is shown in the application.', choose: 'Choose',
  includedTitle: 'What the Complete Setup includes', paths: { title: 'Two ways to fund the deposit', own: { figure: '+€500', tag: 'welcome bonus', title: 'You bring the deposit', text: 'Transfer it in rupees through our payments partner. After your visa is approved and your third monthly payout has gone through, we send you €500.', link: 'See the conditions' }, loan: { figure: '0%', tag: 'interest, we pay it', title: 'You need financing', text: 'Our partner banks in Pakistan fund the deposit and we pay the interest. You repay only what you received, from the seventh month after arrival.', link: 'Interest-free study loan' } },
  when: { title: 'What you pay, and when', items: [{ title: 'Before you fly', text: 'No fees. Only the deposit goes to your Blocked Account, and it stays your money.' }, { title: 'When you land', text: 'You activate everything in the portal. From that day the monthly fee runs, 12 months in total.' }, { title: 'Every month', text: '{{price.monthly}} for the accounts plus your health insurance premium, billed in Germany.' }] },
  calcTitle: 'What the whole move costs', calcLead: 'Deposit, fees, insurance, first rent and the flight, in euros and rupees. Rent and flight are examples; change them.',
  age: 'Age at arrival', months: 'Months of insurance', city: 'City (rent)', cities: [{ key: 'berlin', label: 'Berlin', rent: 550 }, { key: 'munich', label: 'Munich', rent: 750 }, { key: 'hamburg', label: 'Hamburg', rent: 600 }, { key: 'frankfurt', label: 'Frankfurt', rent: 620 }, { key: 'other', label: 'Smaller city', rent: 420 }],
  flight: 'Flight, one way', rate: 'Exchange rate (PKR per EUR)', rateNote: 'Example rate; enter today\'s.',
  lines: { deposit: 'Blocked Account deposit (yours, paid back monthly)', setup: 'Set-up fee', monthly: 'Monthly fee × 12', insurance: 'Health insurance', rent: 'First month\'s rent plus deposit (2 months)', flight: 'Flight', total: 'Total to have ready', totalPkr: 'in rupees, at your rate', reserve: 'of which the deposit comes back to you as monthly payouts', afterMonthly: 'After you land, per month', first90: 'First 90 days' },
  exampleNote: 'Rent, flight and premiums are examples for planning, not quotes.',
  compTitle: 'How we compare', compLead: 'The same products from other providers, as published on their websites. We fill in their numbers on a fixed date and show the date.',
  compCols: ['EC Assets', 'Provider A', 'Provider B', 'Provider C'],
  compRows: [
    { label: 'Set-up fee, Blocked Account', ours: '{{price.setup}}', others: ['[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]'] },
    { label: 'Monthly fee, Blocked Account', ours: '{{price.monthly}}', others: ['[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]'] },
    { label: 'Bank Account included', ours: 'Yes, no account fee', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'Refund if the visa is refused', ours: '100% of fees and deposit', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'Financing of the deposit', ours: 'Interest-free study loan, we pay the interest', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'Support in Urdu and Punjabi', ours: 'Yes', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
  ],
  compNote: 'Providers A to C are the three largest Blocked Account providers; names and prices as published on their sites on [PLACEHOLDER: date]. Where we are more expensive, we say so here.',
  faqTitle: 'Questions about money', cta: 'Start your Complete Setup',
};

const ur: PricingCopy = {
  kicker: 'قیمتیں', title: 'ایک قیمت۔ کچھ چھپا نہیں۔', titleTail: 'ماہانہ۔', lead: '{{price.monthly}} ماہانہ، کوئی سیٹ اپ فیس نہیں۔ آپ کی رقم آپ کی رہتی ہے۔ انشورنس صرف پہنچنے کے بعد وصول ہوتی ہے۔',
  cols: ['صرف بلاکڈ اکاؤنٹ', 'کمپلیٹ سیٹ اپ', 'صرف ہیلتھ انشورنس'], feature: 'آپ کو کیا ملتا ہے',
  rows: [
    { label: 'سفارت خانے کے لیے تصدیقی خط کے ساتھ بلاکڈ اکاؤنٹ', cells: [true, true, false] },
    { label: 'ڈیبٹ کارڈ کے ساتھ جرمن بینک اکاؤنٹ، بغیر اکاؤنٹ فیس', cells: [true, true, false] },
    { label: 'پہلے ہفتوں کے لیے ٹریول ہیلتھ انشورنس', cells: [false, true, true] },
    { label: 'جرمن ہیلتھ انشورنس، سرکاری یا پرائیویٹ', cells: [false, true, true] },
    { label: 'رقم کے لیے سود سے پاک تعلیمی قرض', cells: [true, true, false] },
    { label: 'ویزا مسترد ہونے پر مکمل رقم واپس', cells: [true, true, true] },
    { label: 'سیٹ اپ فیس', cells: ['{{price.setup}}', '{{price.setup}}', 'کوئی نہیں'] },
    { label: 'ماہانہ فیس', cells: ['{{price.monthly}}', '{{price.monthly}}', 'کوئی نہیں'] },
    { label: 'انشورنس پریمیم', cells: ['شامل نہیں', 'عمر کے مطابق، پہنچنے پر', 'عمر کے مطابق، پہنچنے پر'] },
  ],
  premiumNote: 'پریمیم کی مثالیں: 30 سال سے کم عمر کے لیے سرکاری اسٹوڈنٹ پلان تقریباً 120 یورو ماہانہ، پرائیویٹ اسٹوڈنٹ پلان تقریباً 125 یورو سے۔ درست پریمیم درخواست میں دکھایا جاتا ہے۔', choose: 'منتخب کریں',
  includedTitle: 'کمپلیٹ سیٹ اپ میں کیا شامل ہے', paths: { title: 'رقم جمع کرنے کے دو راستے', own: { figure: '+500 یورو', tag: 'خوش آمدید بونس', title: 'آپ خود رقم لاتے ہیں', text: 'ہمارے پیمنٹ پارٹنر کے ذریعے روپوں میں بھیجیں۔ ویزا منظور ہونے اور تیسری ماہانہ ادائیگی کے بعد ہم آپ کو 500 یورو بھیجتے ہیں۔', link: 'شرائط دیکھیں' }, loan: { figure: '0%', tag: 'سود، ہم ادا کرتے ہیں', title: 'آپ کو فنانسنگ چاہیے', text: 'پاکستان میں ہمارے پارٹنر بینک رقم فراہم کرتے ہیں اور سود ہم دیتے ہیں۔ آپ صرف وہی واپس کرتے ہیں جو آپ کو ملا، آمد کے بعد ساتویں مہینے سے۔', link: 'سود سے پاک تعلیمی قرض' } },
  when: { title: 'آپ کیا ادا کرتے ہیں، اور کب', items: [{ title: 'پرواز سے پہلے', text: 'کوئی فیس نہیں۔ صرف رقم آپ کے بلاکڈ اکاؤنٹ میں جاتی ہے، اور وہ آپ کی رہتی ہے۔' }, { title: 'جب آپ پہنچتے ہیں', text: 'آپ پورٹل میں سب کچھ فعال کرتے ہیں۔ اس دن سے ماہانہ فیس چلتی ہے، کل 12 ماہ۔' }, { title: 'ہر مہینے', text: 'اکاؤنٹس کے لیے {{price.monthly}} اور آپ کا ہیلتھ انشورنس پریمیم، جرمنی میں وصول۔' }] },
  calcTitle: 'پورے سفر کی لاگت', calcLead: 'رقم، فیسیں، انشورنس، پہلا کرایہ اور پرواز، یورو اور روپوں میں۔ کرایہ اور پرواز مثالیں ہیں؛ بدل لیں۔',
  age: 'پہنچنے پر آپ کی عمر', months: 'انشورنس کے مہینے', city: 'شہر (کرایے کی مثال)', cities: [{ key: 'berlin', label: 'برلن', rent: 550 }, { key: 'munich', label: 'میونخ', rent: 750 }, { key: 'hamburg', label: 'ہیمبرگ', rent: 600 }, { key: 'frankfurt', label: 'فرینکفرٹ', rent: 620 }, { key: 'other', label: 'چھوٹا شہر', rent: 420 }],
  flight: 'پرواز، یک طرفہ (مثال)', rate: 'شرحِ تبادلہ (روپے فی یورو)', rateNote: 'مثالی شرح؛ آج کی لکھیں۔',
  lines: { deposit: 'بلاکڈ اکاؤنٹ کی رقم (آپ کی، ماہانہ واپس)', setup: 'سیٹ اپ فیس', monthly: 'ماہانہ فیس × 12', insurance: 'ہیلتھ انشورنس', rent: 'پہلے مہینے کا کرایہ اور ضمانت (2 ماہ)', flight: 'پرواز', total: 'کل تیار رکھنے کی رقم', totalPkr: 'روپوں میں، آپ کی شرح پر', reserve: 'جس میں سے رقم ماہانہ ادائیگیوں میں آپ کو واپس ملتی ہے', afterMonthly: 'پہنچنے کے بعد، ہر مہینے', first90: 'پہلے 90 دن' },
  exampleNote: 'کرایہ، پرواز اور پریمیم منصوبہ بندی کی مثالیں ہیں، پیشکش نہیں۔',
  compTitle: 'ہمارا موازنہ', compLead: 'دوسرے فراہم کنندگان کی وہی مصنوعات، جیسا کہ ان کی ویب سائٹس پر شائع ہیں۔ ہم ان کے اعداد ایک مقررہ تاریخ پر بھرتے ہیں اور تاریخ دکھاتے ہیں۔',
  compCols: ['EC Assets', 'فراہم کنندہ A', 'فراہم کنندہ B', 'فراہم کنندہ C'],
  compRows: [
    { label: 'سیٹ اپ فیس، بلاکڈ اکاؤنٹ', ours: '{{price.setup}}', others: ['[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]'] },
    { label: 'ماہانہ فیس، بلاکڈ اکاؤنٹ', ours: '{{price.monthly}}', others: ['[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]'] },
    { label: 'بینک اکاؤنٹ شامل', ours: 'جی ہاں، بغیر اکاؤنٹ فیس', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'ویزا مسترد ہونے پر رقم واپس', ours: 'فیسوں اور رقم کا 100%', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'رقم کی فنانسنگ', ours: 'سود سے پاک تعلیمی قرض، سود ہم دیتے ہیں', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'اردو اور پنجابی میں سپورٹ', ours: 'جی ہاں', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
  ],
  compNote: 'فراہم کنندہ A تا C بلاکڈ اکاؤنٹ کے تین بڑے فراہم کنندگان ہیں؛ نام اور قیمتیں [PLACEHOLDER: date] کو ان کی سائٹس پر شائع شدہ۔ جہاں ہم مہنگے ہیں، یہاں لکھتے ہیں۔',
  faqTitle: 'پیسوں کے بارے میں سوالات', cta: 'اپنا کمپلیٹ سیٹ اپ شروع کریں',
};

const pa: PricingCopy = {
  kicker: 'قیمتاں', title: 'اک قیمت۔ کجھ لکیا نہیں۔', titleTail: 'مہینے دا۔', lead: '{{price.monthly}} مہینے دا، کوئی سیٹ اپ فیس نہیں۔ تہاڈی رقم تہاڈی رہندی اے۔ انشورنس صرف پہنچݨ توں بعد لگدی اے۔',
  cols: ['صرف بلاکڈ اکاؤنٹ', 'کمپلیٹ سیٹ اپ', 'صرف ہیلتھ انشورنس'], feature: 'تہانوں کیہ ملدا اے',
  rows: [
    { label: 'سفارت خانے لئی تصدیقی خط نال بلاکڈ اکاؤنٹ', cells: [true, true, false] },
    { label: 'ڈیبٹ کارڈ نال جرمن بینک اکاؤنٹ، بغیر اکاؤنٹ فیس', cells: [true, true, false] },
    { label: 'پہلے ہفتیاں لئی ٹریول ہیلتھ انشورنس', cells: [false, true, true] },
    { label: 'جرمن ہیلتھ انشورنس، سرکاری یا پرائیویٹ', cells: [false, true, true] },
    { label: 'رقم لئی بغیر سود تعلیمی قرضہ', cells: [true, true, false] },
    { label: 'ویزا رد ہووے تے پوری رقم واپس', cells: [true, true, true] },
    { label: 'سیٹ اپ فیس', cells: ['{{price.setup}}', '{{price.setup}}', 'کوئی نہیں'] },
    { label: 'مہینے دی فیس', cells: ['{{price.monthly}}', '{{price.monthly}}', 'کوئی نہیں'] },
    { label: 'انشورنس پریمیم', cells: ['شامل نہیں', 'عمر موجب، پہنچݨ تے', 'عمر موجب، پہنچݨ تے'] },
  ],
  premiumNote: 'پریمیم دیاں مثالاں: 30 سال توں گھٹ عمر لئی سرکاری سٹوڈنٹ پلان لگ بھگ 120 یورو مہینے دا، پرائیویٹ سٹوڈنٹ پلان لگ بھگ 125 یورو توں۔ ٹھیک پریمیم درخواست وچ دسدا اے۔', choose: 'چݨو',
  includedTitle: 'کمپلیٹ سیٹ اپ وچ کیہ شامل اے', paths: { title: 'رقم جمع کرݨ دے دو راہ', own: { figure: '+500 یورو', tag: 'جی آیاں نوں بونس', title: 'تسیں آپ رقم لیاندے او', text: 'ساڈے پیمنٹ پارٹنر راہیں روپیاں وچ بھیجو۔ ویزا منظور ہوݨ تے تیجی مہینے دی ادائیگی توں بعد اسیں تہانوں 500 یورو بھیجدے آں۔', link: 'شرطاں ویکھو' }, loan: { figure: '0%', tag: 'سود، اسیں دیندے آں', title: 'تہانوں فنانسنگ چاہیدی اے', text: 'پاکستان وچ ساڈے پارٹنر بینک رقم دیندے نیں تے سود اسیں دیندے آں۔ تسیں صرف اوہی واپس کردے او جو تہانوں ملیا، آمد توں بعد ستویں مہینے توں۔', link: 'بغیر سود تعلیمی قرضہ' } },
  when: { title: 'تسیں کیہ دیندے او، تے کدوں', items: [{ title: 'پرواز توں پہلاں', text: 'کوئی فیس نہیں۔ صرف رقم تہاڈے بلاکڈ اکاؤنٹ وچ جاندی اے، تے اوہ تہاڈی رہندی اے۔' }, { title: 'جدوں تسیں پہنچدے او', text: 'تسیں پورٹل وچ سبھ کجھ فعال کردے او۔ اوس دن توں مہینے دی فیس چلدی اے، کل 12 مہینے۔' }, { title: 'ہر مہینے', text: 'اکاؤنٹاں لئی {{price.monthly}} تے تہاڈا ہیلتھ انشورنس پریمیم، جرمنی وچ وصول۔' }] },
  calcTitle: 'پورے سفر دا خرچ', calcLead: 'رقم، فیساں، انشورنس، پہلا کرایہ تے فلائٹ، یورو تے روپیاں وچ۔ کرایہ تے فلائٹ مثالاں نیں؛ بدل لوو۔',
  age: 'پہنچݨ تے تہاڈی عمر', months: 'انشورنس دے مہینے', city: 'شہر (کرائے دی مثال)', cities: [{ key: 'berlin', label: 'برلن', rent: 550 }, { key: 'munich', label: 'میونخ', rent: 750 }, { key: 'hamburg', label: 'ہیمبرگ', rent: 600 }, { key: 'frankfurt', label: 'فرینکفرٹ', rent: 620 }, { key: 'other', label: 'چھوٹا شہر', rent: 420 }],
  flight: 'فلائٹ، اک پاسے (مثال)', rate: 'شرحِ تبادلہ (روپے فی یورو)', rateNote: 'مثالی شرح؛ اج دی لکھو۔',
  lines: { deposit: 'بلاکڈ اکاؤنٹ دی رقم (تہاڈی، مہینے مہینے واپس)', setup: 'سیٹ اپ فیس', monthly: 'مہینے دی فیس × 12', insurance: 'ہیلتھ انشورنس', rent: 'پہلے مہینے دا کرایہ تے ضمانت (2 مہینے)', flight: 'فلائٹ', total: 'کل تیار رکھݨ والی رقم', totalPkr: 'روپیاں وچ، تہاڈی شرح تے', reserve: 'جیہدے وچوں رقم مہینے دیاں ادائیگیاں وچ تہانوں واپس ملدی اے', afterMonthly: 'پہنچݨ توں بعد، ہر مہینے', first90: 'پہلے 90 دن' },
  exampleNote: 'کرایہ، فلائٹ تے پریمیم منصوبہ بندی دیاں مثالاں نیں، پیشکش نہیں۔',
  compTitle: 'ساڈا موازنہ', compLead: 'دوجے فراہم کنندیاں دیاں اوہی مصنوعات، جویں اوہناں دیاں ویب سائٹاں تے چھپیاں نیں۔ اسیں اوہناں دے انگ اک مقررہ تاریخ تے بھردے آں تے تاریخ وکھاندے آں۔',
  compCols: ['EC Assets', 'فراہم کنندہ A', 'فراہم کنندہ B', 'فراہم کنندہ C'],
  compRows: [
    { label: 'سیٹ اپ فیس، بلاکڈ اکاؤنٹ', ours: '{{price.setup}}', others: ['[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]'] },
    { label: 'مہینے دی فیس، بلاکڈ اکاؤنٹ', ours: '{{price.monthly}}', others: ['[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]', '[PLACEHOLDER: fee]'] },
    { label: 'بینک اکاؤنٹ شامل', ours: 'ہاں، بغیر اکاؤنٹ فیس', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'ویزا رد ہووے تے رقم واپس', ours: 'فیساں تے رقم دا 100%', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'رقم دی فنانسنگ', ours: 'بغیر سود تعلیمی قرضہ، سود اسیں دیندے آں', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
    { label: 'اردو تے پنجابی وچ سپورٹ', ours: 'ہاں', others: ['[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]', '[PLACEHOLDER: verify]'] },
  ],
  compNote: 'فراہم کنندہ A توں C بلاکڈ اکاؤنٹ دے تن وڈے فراہم کنندے نیں؛ ناں تے قیمتاں [PLACEHOLDER: date] نوں اوہناں دیاں سائٹاں تے چھپیاں۔ جتھے اسیں مہنگے آں، ایتھے لکھدے آں۔',
  faqTitle: 'پیسیاں بارے سوال', cta: 'آپݨا کمپلیٹ سیٹ اپ شروع کرو',
};

export const PRICING: Record<Locale, PricingCopy> = { en, ur, pa };
