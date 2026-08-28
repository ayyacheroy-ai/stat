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
