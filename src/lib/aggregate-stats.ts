import type { Player } from "@/types/player";
import { getMetric } from "./metrics";

/** Whole-squad real physical totals for Home's headline stat tiles. */
export function aggregateSquadPhysicalStats(players: Player[]) {
  return {
    distance: players.reduce((sum, player) => sum + (getMetric(player, "distance")?.value ?? 0), 0),
    sprints: players.reduce((sum, player) => sum + (getMetric(player, "sprints")?.value ?? 0), 0),
    topSpeed: players.reduce((max, player) => Math.max(max, getMetric(player, "topSpeed")?.value ?? 0), 0),
  };
}

/**
 * Sums one metric across a match's players belonging to one team. Only
 * meaningful for `Match.isTracked` matches — the mock match history has an
 * empty `players` array (no per-player data ever existed for them), so
 * this correctly returns 0 rather than fabricating a team total.
 */
export function aggregateTeamMetric(players: Player[], teamId: number, key: string): number {
  return players
    .filter((player) => player.teamId === teamId)
    .reduce((sum, player) => sum + (getMetric(player, key)?.value ?? 0), 0);
}
