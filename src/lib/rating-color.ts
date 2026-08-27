/**
 * Maps a 0-10 rating to a red -> amber -> green color, matching the same
 * hues used for the accent (green) and Team B indicator (amber) elsewhere
 * in the design system, so the rating scale doesn't introduce a fourth
 * unrelated color into the palette.
 */
const STOPS: Array<{ at: number; rgb: [number, number, number] }> = [
  { at: 0, rgb: [229, 72, 77] }, // danger red
  { at: 6, rgb: [245, 165, 36] }, // amber
  { at: 10, rgb: [43, 217, 124] }, // accent green
];

export function getRatingColor(rating: number): string {
  const clamped = Math.max(0, Math.min(10, rating));

  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (clamped >= STOPS[i].at && clamped <= STOPS[i + 1].at) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }

  const span = upper.at - lower.at || 1;
  const t = (clamped - lower.at) / span;
  const rgb = lower.rgb.map((channel, i) => Math.round(channel + (upper.rgb[i] - channel) * t));

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
