import type { ShotEvent, ShotOutcome, ShotZone } from "@/types/pitch-viz";
import { createRng, hashSeed, randRange } from "./rng";

/** Caps how many dots render on the pitch — a season's 76 shots would just blur together. */
const MAX_DISPLAYED_SHOTS = 16;

// Mirrors the penalty-box rectangle drawn in components/pitch/Pitch.tsx's
// attacking-half viewBox (x 70-230 of 300, y 6-86 of 260), as percentages.
const BOX_X_RANGE: [number, number] = [23, 77];
const BOX_Y_RANGE: [number, number] = [0, 33];

function classifyZone(x: number, y: number): ShotZone {
  const insideBox = x >= BOX_X_RANGE[0] && x <= BOX_X_RANGE[1] && y >= BOX_Y_RANGE[0] && y <= BOX_Y_RANGE[1];
  return insideBox ? "inside_box" : "outside_box";
}

/**
 * Builds a display-sized, internally-consistent sample of shots from a
 * player's season totals: goals <= shots on target <= shots always
 * holds, and the proportions are preserved when downsampling to
 * MAX_DISPLAYED_SHOTS. Seeded per tracker_id for a stable demo.
 */
export function generateShotEvents(
  trackerId: number,
  totalShots: number,
  totalShotsOnTarget: number,
  totalGoals: number,
): ShotEvent[] {
  if (totalShots <= 0) return [];

  const rng = createRng(hashSeed(`pitchline-shotmap-${trackerId}`));
  const displayedCount = Math.max(1, Math.min(MAX_DISPLAYED_SHOTS, totalShots));
  const scale = displayedCount / totalShots;

  const displayedGoals = Math.min(displayedCount, Math.round(totalGoals * scale));
  const displayedOnTarget = Math.max(
    displayedGoals,
    Math.min(displayedCount, Math.round(totalShotsOnTarget * scale)),
  );

  const outcomes: ShotOutcome[] = [];
  for (let i = 0; i < displayedGoals; i++) outcomes.push("goal");
  for (let i = displayedGoals; i < displayedOnTarget; i++) outcomes.push("on_target");
  for (let i = displayedOnTarget; i < displayedCount; i++) {
    outcomes.push(rng() > 0.5 ? "off_target" : "blocked");
  }

  return outcomes.map((outcome, index) => {
    // Goals cluster tight to goal; off-target/blocked spread wider and further out.
    const spread = outcome === "goal" ? 22 : outcome === "on_target" ? 30 : 45;
    const maxDepth = outcome === "blocked" ? 55 : 42;

    const x = Math.min(98, Math.max(2, 50 + randRange(rng, -spread, spread)));
    const y = Math.min(96, Math.max(2, randRange(rng, 4, maxDepth)));
    const xgRange: [number, number] = outcome === "goal" ? [0.25, 0.75] : [0.03, 0.35];
    const xg = Math.round(randRange(rng, xgRange[0], xgRange[1]) * 100) / 100;

    return {
      id: `shot-${trackerId}-${index}`,
      x,
      y,
      xg,
      outcome,
      zone: classifyZone(x, y),
    };
  });
}
