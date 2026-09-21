/**
 * Schritt-Abschnitte erkennen (Runde 29, M05: aus Section.astro herausgeloest, damit die Schrittkarten und die ScrollStory
 * dieselbe Lesart haben). "How to ...", "step by step": optional eine H2, ein einleitender Absatz, dann kurze Titel (H3/H4
 * oder fetter Absatz) mit je ein bis drei kurzen Absaetzen und hoechstens einem Button. Erkannt wird am englischen
 * Referenzblock an gleicher Position (Sprachparitaet), gerendert die Sprachkopie.
 */
import type { Block, Section } from './content';

export interface StepItem { title: string; titleEn: string; paras: string[]; buttons: Block[] }
export interface ParsedSteps { heading: Block | null; lead: Block | null; steps: StepItem[]; isSteps: boolean; numbered: boolean }

const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const strongTitle = (b: Block) => b.type === 'paragraph' && /^<strong>[^<]+<\/strong>$/.test(b.html.replace(/<br\s*\/?>/g, '').replace(/\s+/g, ' ').trim());
const titleText = (b: Block) => (b.type === 'heading' ? b.text : b.type === 'paragraph' ? strip(b.html) : '');
const processVerb = /^(apply|deposit|receive|activate|arrive|download|submit|record|order|start|choose|check|move|complete|register|get|pay|send|open|book|confirm|upload|sign|wait|we |tell|hold|unlock)/i;

/** hero/crumb: Hero- und Breadcrumb-Sektionen sind nie Schritt-Abschnitte (Section.astro entscheidet das vorab). */
export const parseSteps = (section: Section, refSection: Section | undefined, opts: { isHero?: boolean; isCrumb?: boolean } = {}): ParsedSteps => {
  const refBlocks = refSection?.blocks.length === section.blocks.length ? refSection.blocks : section.blocks;
  const en = (b: Block): Block => { const i = section.blocks.indexOf(b); return refBlocks[i] ?? b; };
  const isTitle = (b: Block) => (b.type === 'heading' && b.level >= 3) || strongTitle(en(b));
  const isStepTitle = (b: Block) => isTitle(b) && titleText(en(b)).length <= 48;
  const heading = section.blocks[0]?.type === 'heading' && section.blocks[0].level === 2 ? section.blocks[0] : null;
  let rest = section.blocks.slice(heading ? 1 : 0);
  // Ein einleitender Absatz direkt unter der H2 bleibt ueber den Kacheln stehen
  const lead = heading && rest[0]?.type === 'paragraph' && !isStepTitle(rest[0]) && rest[1] && isStepTitle(rest[1]) ? rest[0] : null;
  if (lead) rest = rest.slice(1);
  const steps: StepItem[] = [];
  let ok = !opts.isHero && !opts.isCrumb && rest.filter((b) => b.type !== 'button').length >= 6 && !!rest[0] && isStepTitle(rest[0]);
  for (const b of rest) {
    if (!ok) break;
    const cur = steps[steps.length - 1];
    if (isStepTitle(b)) steps.push({ title: titleText(b), titleEn: titleText(en(b)), paras: [], buttons: [] });
    else if (b.type === 'paragraph' && strip((en(b) as { html: string }).html).length <= 320 && cur.paras.length < 3) cur.paras.push(b.html);
    else if (b.type === 'button' && cur.buttons.length < 1) cur.buttons.push(b);
    else ok = false;
  }
  const isSteps = ok && steps.length >= 3 && steps.every((st) => st.paras.length > 0);
  const headingEn = heading ? (en(heading) as { text: string }).text : '';
  // Der Anker how-it-works zaehlt immer als Prozess (nummeriert); sonst entscheidet die Ueberschrift oder die Verben der Titel
  const numbered = isSteps && (section.anchor === 'how-it-works' || (heading ? /how|step|process|works|journey|timeline|apply|start/i.test(headingEn) : steps.filter((s) => processVerb.test(s.titleEn)).length >= 3));
  return { heading, lead, steps, isSteps, numbered };
};
