/**
 * Vergleich gesetzlich gegen privat auf /health-insurance (Rundgang 20.09., design-upgrade/26-RUNDGANG-PREMIUM.md):
 * vier Zeilen, die die Aussagen der Seite (Kostenkacheln, Absatz "Public or private", FAQ zu Erstattung und Wechsel)
 * nebeneinander stellen. Zahlen sind die Beispielwerte der Seite; der genaue Beitrag steht in der Anwendung.
 */
import type { Locale } from './i18n';

export interface InsuranceCompare { title: string; head: [string, string]; rows: { label: string; a: string; b: string }[]; note: string }

const en: InsuranceCompare = {
  title: 'Side by side',
  head: ['Statutory (public)', 'Private'],
  rows: [
    { label: 'Monthly premium', a: 'about €120, set by law', b: 'from about €125, by age and plan' },
    { label: 'Who can join', a: 'students under 30', b: 'any age, students and professionals' },
    { label: 'At the doctor', a: 'show your insurance card, nothing to pay upfront', b: 'you pay first, the insurer reimburses you' },
    { label: 'Changing later', a: 'possible when your status changes', b: 'your choice stands for the whole of your studies' },
  ],
  note: 'Premium examples for planning. The exact premium is shown at the end of the application.',
};
const ur: InsuranceCompare = {
  title: 'آمنے سامنے',
  head: ['سرکاری (پبلک)', 'پرائیویٹ'],
  rows: [
    { label: 'ماہانہ پریمیم', a: 'تقریباً 120 یورو، قانون کے مطابق', b: 'تقریباً 125 یورو سے، عمر اور پلان کے مطابق' },
    { label: 'کون شامل ہو سکتا ہے', a: '30 سال سے کم عمر طلبہ', b: 'ہر عمر، طلبہ اور پیشہ ور' },
    { label: 'ڈاکٹر کے پاس', a: 'انشورنس کارڈ دکھائیں، پہلے کچھ ادا نہیں کرنا', b: 'آپ پہلے ادا کرتے ہیں، انشورر واپس کرتا ہے' },
    { label: 'بعد میں تبدیلی', a: 'حیثیت بدلنے پر ممکن', b: 'آپ کا انتخاب پوری تعلیم کے لیے رہتا ہے' },
  ],
  note: 'منصوبہ بندی کے لیے پریمیم کی مثالیں۔ درست پریمیم درخواست کے آخر میں دکھایا جاتا ہے۔',
};
const pa: InsuranceCompare = {
  title: 'آمنے سامنے',
  head: ['سرکاری (پبلک)', 'پرائیویٹ'],
  rows: [
    { label: 'مہینے دا پریمیم', a: 'تقریباً 120 یورو، قانون مطابق', b: 'تقریباً 125 یورو توں، عمر تے پلان مطابق' },
    { label: 'کون شامل ہو سکدا اے', a: '30 سال توں گھٹ عمر دے طالب علم', b: 'ہر عمر، طالب علم تے پیشہ ور' },
    { label: 'ڈاکٹر کول', a: 'انشورنس کارڈ وکھاؤ، پہلاں کجھ نہیں دیݨا', b: 'تسیں پہلاں دیندے او، انشورر واپس کردا اے' },
    { label: 'بعد وچ تبدیلی', a: 'حیثیت بدلݨ تے ممکن', b: 'تہاڈی چوݨ پوری پڑھائی لئی رہندی اے' },
  ],
  note: 'منصوبہ بندی لئی پریمیم دیاں مثالاں۔ درست پریمیم درخواست دے اخیر وچ وکھایا جاندا اے۔',
};
export const INSURANCE_COMPARE: Record<Locale, InsuranceCompare> = { en, ur, pa };
