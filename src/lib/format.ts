/**
 * Generic, metric-agnostic formatters. Anything specific to a metric's
 * label/unit/decimals lives in the metric registry instead — this file is
 * only for display helpers that aren't part of that system (bio fields,
 * currency, percentages).
 */

export function formatCurrencyEur(amount: number | undefined): string | null {
  if (amount == null) return null;
  if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `€${(amount / 1_000).toFixed(0)}K`;
  return `€${amount.toFixed(0)}`;
}

export function formatHeight(cm: number | undefined): string | null {
  if (cm == null) return null;
  return `${(cm / 100).toFixed(2)} m`;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * "YYYY-MM-DD" -> "D Mon" (e.g. "27 Aug"). There's no kickoff time in the
 * data model — matches only ever carry a date, never a time — so this
 * deliberately doesn't render one.
 */
export function formatMatchDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  const monthLabel = MONTH_LABELS[(month ?? 1) - 1] ?? "";
  return `${day} ${monthLabel}`;
}
