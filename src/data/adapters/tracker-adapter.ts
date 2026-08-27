import type { Player } from "@/types/player";
import type { PlayerMetrics } from "@/types/metrics";
import { getPlayerName } from "@/config/app-config";

/**
 * This is the ONLY file that should know the tracker CSV's column names.
 * Everything else in the app works with the normalized `Player` type.
 * When the real backend/API ships, replace this adapter's input (and the
 * data source that calls it) — the rest of the frontend does not change.
 */

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function adaptTrackerRow(row: Record<string, string>): Player {
  const trackerId = toNumber(row.tracker_id) ?? 0;
  const teamId = toNumber(row.team) ?? 0;

  const metrics: PlayerMetrics = {
    distance: toNumber(row.distance_m),
    averageSpeed: toNumber(row.avg_speed_ms),
    topSpeed: toNumber(row.top_speed_kmh),
    sprints: toNumber(row.sprints),
    secondsTracked: toNumber(row.seconds_tracked),
  };

  return {
    id: `tracker-${trackerId}`,
    trackerId,
    teamId,
    name: getPlayerName(trackerId),
    metrics,
  };
}

export function adaptTrackerRows(rows: Record<string, string>[]): Player[] {
  return rows.map(adaptTrackerRow);
}
