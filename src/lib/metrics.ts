import type { Player } from "@/types/player";
import type { MetricValue } from "@/types/metrics";
import { formatMetricValue, getMetricDefinition } from "@/data/registry/metrics";

/** Looks up one metric on a player. Returns undefined if the player has no value for it — never throws. */
export function getMetric(player: Player, key: string): MetricValue | undefined {
  return player.metrics[key];
}

/** Formatted display string for a metric, or null if the player doesn't have it (UI should render a placeholder). */
export function formatPlayerMetric(player: Player, key: string): string | null {
  const metric = getMetric(player, key);
  if (!metric) return null;
  return formatMetricValue(key, metric.value);
}

/** The unit suffix to show next to a formatted metric value, if any. */
export function getMetricUnit(key: string): string | undefined {
  return getMetricDefinition(key)?.unit;
}
