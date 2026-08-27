/**
 * Where each named position sits on a 0-100 x, 0-100 y pitch (attacking
 * direction = up, y=0 is the goal line). Shared by PositionCard (the
 * profile's small position graphic) and the heatmap generator, so a
 * player's heatmap is centered on the same spot their position dot shows.
 */
export const POSITION_COORDS: Record<string, { x: number; y: number }> = {
  GK: { x: 50, y: 92 },
  CB: { x: 50, y: 75 },
  LB: { x: 18, y: 72 },
  RB: { x: 82, y: 72 },
  CDM: { x: 50, y: 58 },
  CM: { x: 50, y: 45 },
  CAM: { x: 50, y: 32 },
  LW: { x: 18, y: 25 },
  RW: { x: 82, y: 25 },
  ST: { x: 50, y: 12 },
};

export function getPositionCoord(position: string): { x: number; y: number } {
  return POSITION_COORDS[position] ?? { x: 50, y: 50 };
}
