import type { MetricBag } from "./metrics";

/**
 * Bio/profile information. Entirely mock for now (see data/mock) — our
 * tracker has no way to know a player's height or contract. Kept separate
 * from `metrics` because it isn't ranked, compared, or CSV-uploadable the
 * way a stat is.
 */
export interface PlayerBio {
  heightCm?: number;
  ageYears?: number;
  dateOfBirth?: string;
  preferredFoot?: "Left" | "Right" | "Both";
  country?: string;
  shirtNumber?: number;
  marketValueEur?: number;
  contractEndYear?: number;
}

/**
 * Normalized player representation. This is the shape every part of the
 * frontend should depend on — never on raw CSV columns or a future API's
 * exact JSON keys. Today a CSV adapter + mock generator produce this;
 * later a REST client will produce the same shape.
 */
export interface Player {
  /** Stable identifier for use as a React key / route param. */
  id: string;
  /** Raw identifier assigned by the tracking system. */
  trackerId: number;
  name: string;
  teamId: number;
  metrics: MetricBag;
  bio: PlayerBio;
}
