import type { PlayerMetrics } from "./metrics";

/**
 * Normalized player representation. This is the shape every part of the
 * frontend should depend on — never on raw CSV columns or a future API's
 * exact JSON keys. Today a CSV adapter produces this; later a REST client
 * will produce the same shape, and nothing downstream needs to change.
 */
export interface Player {
  /** Stable identifier for use as a React key / route param. */
  id: string;
  /** Raw identifier assigned by the tracking system. */
  trackerId: number;
  name: string;
  teamId: number;
  metrics: PlayerMetrics;
}
