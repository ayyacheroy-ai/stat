import type { HeatPoint } from "@/types/pitch-viz";
import { createRng, hashSeed, randRange } from "./rng";
import { getPositionCoord } from "./position-coords";

const POINT_COUNT = 9;

/**
 * Clusters heat blobs around the player's primary position, seeded per
 * tracker_id so it's identical on every reload. Real tracker coordinates
 * (once homography lands) would replace this function's output — same
 * HeatPoint[] shape, same consumer (components/pitch/Heatmap).
 */
export function generateHeatmapPoints(trackerId: number, primaryPosition: string): HeatPoint[] {
  const rng = createRng(hashSeed(`pitchline-heatmap-${trackerId}`));
  const center = getPositionCoord(primaryPosition);

  return Array.from({ length: POINT_COUNT }, () => ({
    x: Math.min(96, Math.max(4, center.x + randRange(rng, -28, 28))),
    y: Math.min(96, Math.max(4, center.y + randRange(rng, -30, 30))),
    intensity: randRange(rng, 0.35, 1),
  }));
}
