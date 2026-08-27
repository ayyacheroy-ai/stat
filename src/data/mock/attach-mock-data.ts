import type { Player } from "@/types/player";
import { generatePlayerMock } from "./generate-player-mock";

/**
 * Fills in every metric/bio field a player doesn't already have real data
 * for. Real (tracker-sourced) metrics always win — this never overwrites
 * a value the CSV adapter already produced. This is the mechanism behind
 * "mock now, real the moment a CSV provides it": once a metric's key
 * exists with source 'tracker', mock generation simply doesn't touch it.
 */
export function withMockData(player: Player): Player {
  const generated = generatePlayerMock(player.trackerId);

  return {
    ...player,
    metrics: { ...generated.metrics, ...player.metrics },
    bio: { ...generated.bio, ...player.bio },
  };
}
