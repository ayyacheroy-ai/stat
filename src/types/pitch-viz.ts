/**
 * Coordinates below are percentages (0-100) of the Pitch component's
 * drawing area, not real-world meters — deliberately, since the brief
 * only needs these to look credible, not be survey-accurate. When the
 * tracker eventually produces real pitch coordinates via homography,
 * they can be normalized to this same 0-100 space and plugged in here
 * without touching the Pitch/Heatmap/ShotMap components.
 */
export interface HeatPoint {
  x: number;
  y: number;
  /** 0-1, drives blob size/opacity. */
  intensity: number;
}

export type ShotOutcome = "goal" | "on_target" | "off_target" | "blocked";
export type ShotZone = "inside_box" | "outside_box";

export interface ShotEvent {
  id: string;
  x: number;
  y: number;
  xg: number;
  outcome: ShotOutcome;
  zone: ShotZone;
}
