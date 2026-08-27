import type { MetricBag } from "@/types/metrics";
import { buildColumnToMetricKeyMap } from "@/data/registry/metrics";

/**
 * Turns one CSV row into tracker-sourced metrics, using the metric
 * registry's `mapsFrom` to route arbitrary column names to metric keys.
 *
 * This is the ONE function that knows CSV columns exist at all. It's
 * written to handle any column the registry recognizes, not just today's
 * 8 — so the future "upload a richer CSV" feature (which flips mock
 * metrics to real ones) calls this exact same function on uploaded rows.
 * An unknown column is ignored rather than crashing.
 */
export function extractMetricsFromRow(row: Record<string, string>): MetricBag {
  const columnToMetricKey = buildColumnToMetricKeyMap();
  const metrics: MetricBag = {};

  for (const [column, rawValue] of Object.entries(row)) {
    if (column === "tracker_id" || column === "team") continue;

    const metricKey = columnToMetricKey.get(column);
    if (!metricKey) {
      continue; // unrecognized column — ignored gracefully, never a crash
    }

    const value = Number(rawValue);
    if (!Number.isFinite(value)) continue;

    metrics[metricKey] = { value, source: "tracker" };
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
