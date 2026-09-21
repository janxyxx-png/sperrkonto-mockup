/**
 * Zahlen im Text weich umschalten (Feinschliff 27): Visa-Chips (11.904 -> 13.092, 992 -> 1.091) und EUR/PKR auf der Preisseite
 * springen nicht mehr hart um, die Ziffern laufen in 550 ms vom alten auf den neuen Wert. Der Text um die Zahlen herum
 * (Waehrung, "a month", Zusatz) kommt sofort aus dem Zieltext; Tausenderzeichen und Dezimalstellen folgen dem Ziel.
 * Bei "prefers-reduced-motion" oder wenn sich die Anzahl der Zahlen unterscheidet, steht der Zieltext sofort da.
 */
const SPLIT = /(\d[\d.,]*)/;
type Fmt = { sep: string; decimals: number; thousands: string; value: number };
const parse = (num: string): Fmt | null => {
  const sep = (num.match(/[.,](?=\d{1,2}$)/) ?? [''])[0];
  const decimals = sep ? num.length - num.indexOf(sep) - 1 : 0;
  const thousands = num.includes(sep === ',' ? '.' : ',') ? (sep === ',' ? '.' : ',') : '';
  const value = Number(num.replace(/[.,]/g, (c) => (c === sep ? '.' : '')));
  return Number.isFinite(value) ? { sep, decimals, thousands, value } : null;
};
const fmt = (v: number, like: Fmt) => {
  const [int, frac] = v.toFixed(like.decimals).split('.');
  const grouped = like.thousands ? int.replace(/\B(?=(\d{3})+(?!\d))/g, like.thousands) : int;
  return grouped + (frac ? like.sep + frac : '');
};
const running = new WeakMap<Element, number>();

export function tweenText(el: HTMLElement, target: string, dur = 550) {
  const prev = running.get(el); if (prev) { cancelAnimationFrame(prev); running.delete(el); }
  const a = (el.textContent ?? '').split(SPLIT), b = target.split(SPLIT);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || a.length !== b.length || a.length < 3) { el.textContent = target; return; }
  // Zahlen stehen an den ungeraden Positionen; Text davor, dazwischen, danach kommt aus dem Ziel
  const nums = b.map((s, i) => (i % 2 === 1 ? { from: parse(a[i]), to: parse(s) } : null));
  if (nums.some((n, i) => i % 2 === 1 && (!n || !n.from || !n.to))) { el.textContent = target; return; }
  if (nums.every((n) => !n || n.from!.value === n.to!.value)) { el.textContent = target; return; }
  const t0 = performance.now();
  const tick = (t: number) => {
    const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3);
    if (k >= 1) { el.textContent = target; running.delete(el); return; }
    el.textContent = b.map((s, i) => { const n = nums[i]; if (!n) return s; const f = n.from!, g = n.to!; return fmt(f.value + (g.value - f.value) * e, g); }).join('');
    running.set(el, requestAnimationFrame(tick));
  };
  running.set(el, requestAnimationFrame(tick));
}
