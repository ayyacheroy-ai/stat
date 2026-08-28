/**
 * Column -> metric-key map for tracker-sourced metrics only.
 *
 * This intentionally mirrors just the `mapsFrom` entries the frontend's
 * registry (src/data/registry/metrics.ts) tags `defaultSource: "tracker"`
 * — distance, averageSpeed, topSpeed, sprints, secondsTracked. This
 * backend never produces the ~20 mock metrics (rating, goals, passes,
 * etc.); those stay entirely a frontend concern (see AGENTS.md §7). If a
 * future tracker CSV adds a genuinely new real column, add it both here
 * and to the frontend registry's `mapsFrom` — the two are independent
 * copies by design (different packages, different deploy lifecycles) but
 * need to agree on column names.
 */
export const TRACKER_METRIC_COLUMNS: Record<string, string> = {
  distance_m: "distance",
  avg_speed_ms: "averageSpeed",
  top_speed_kmh: "topSpeed",
  sprints: "sprints",
  seconds_tracked: "secondsTracked",
};

export interface ExtractedMetric {
  metricKey: string;
  value: number;
}

/** Same semantics as the frontend's extractMetricsFromRow: unknown or non-numeric columns are skipped, never thrown on. */
export function extractTrackerMetrics(
  row: Record<string, string>,
): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = [];

  for (const [column, rawValue] of Object.entries(row)) {
    if (column === "tracker_id" || column === "team") continue;

    const metricKey = TRACKER_METRIC_COLUMNS[column];
    if (!metricKey) continue;

    const value = Number(rawValue);
    if (!Number.isFinite(value)) continue;

    metrics.push({ metricKey, value });
  }

  return metrics;
}

export function toNumberOrDefault(
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
