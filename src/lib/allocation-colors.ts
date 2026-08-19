/** Paleta de cores para os envelopes/objetivos. */
export const ALLOCATION_COLORS: Record<
  string,
  { swatch: string; bar: string; soft: string; text: string }
> = {
  emerald: {
    swatch: "bg-emerald-500",
    bar: "bg-emerald-500",
    soft: "bg-emerald-500/12",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  teal: {
    swatch: "bg-teal-500",
    bar: "bg-teal-500",
    soft: "bg-teal-500/12",
    text: "text-teal-600 dark:text-teal-400",
  },
  indigo: {
    swatch: "bg-indigo-500",
    bar: "bg-indigo-500",
    soft: "bg-indigo-500/12",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  slate: {
    swatch: "bg-slate-500",
    bar: "bg-slate-500",
    soft: "bg-slate-500/12",
    text: "text-slate-600 dark:text-slate-300",
  },
  gold: {
    swatch: "bg-amber-500",
    bar: "bg-amber-500",
    soft: "bg-amber-500/12",
    text: "text-amber-600 dark:text-amber-400",
  },
  rose: {
    swatch: "bg-rose-500",
    bar: "bg-rose-500",
    soft: "bg-rose-500/12",
    text: "text-rose-600 dark:text-rose-400",
  },
};

export function allocationColor(key: string) {
  return ALLOCATION_COLORS[key] ?? ALLOCATION_COLORS.emerald;
}
