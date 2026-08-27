import type { Player } from "@/types/player";
import { getPlayerName } from "@/config/app-config";
import { extractMetricsFromRow, toNumberOrDefault } from "./csv-row-adapter";

/**
 * Converts one row of the bundled (or uploaded) tracker CSV into a
 * normalized Player. `tracker_id` and `team` are structural (identity),
 * so they're read directly; every other column flows through the metric
 * registry via `extractMetricsFromRow`. `bio` is filled in later by the
 * mock layer — this adapter only knows about real tracker data.
 */
export function adaptTrackerRow(row: Record<string, string>): Player {
  const trackerId = toNumberOrDefault(row.tracker_id, 0);
  const teamId = toNumberOrDefault(row.team, 0);

  return {
    id: `tracker-${trackerId}`,
    trackerId,
    teamId,
    name: getPlayerName(trackerId),
    metrics: extractMetricsFromRow(row),
    bio: {},
  };
}

export function adaptTrackerRows(rows: Record<string, string>[]): Player[] {
  return rows.map(adaptTrackerRow);
}
