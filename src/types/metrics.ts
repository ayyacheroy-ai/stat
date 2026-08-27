/**
 * Flexible metrics bag for a tracked entity (currently: a player).
 *
 * Every field is optional by design. The current CSV tracker only produces
 * a handful of these; a future computer-vision pipeline may add many more
 * (goals, passes, possession, ...), and other sports may use a different
 * subset entirely. UI components must treat any metric as possibly absent
 * and degrade gracefully rather than assuming a fixed set always exists.
 */
export interface PlayerMetrics {
  /** Total distance covered, in meters. */
  distance?: number;
  /** Average speed across tracked time, in meters/second. */
  averageSpeed?: number;
  /** Peak speed reached, in km/h. */
  topSpeed?: number;
  /** Count of sprint efforts. */
  sprints?: number;
  /** Seconds of match time the player was actively tracked for. */
  secondsTracked?: number;

  // Not produced by the current tracker yet, but part of the eventual
  // football analytics vocabulary. Left here so the UI and data model
  // don't need to change shape when the AI pipeline starts emitting them.
  goals?: number;
  assists?: number;
  shots?: number;
  shotsOnTarget?: number;
  passes?: number;
  passAccuracy?: number;
  possession?: number;
  touches?: number;
  tackles?: number;
  interceptions?: number;

  /** Escape hatch for any metric a data source provides that isn't modeled above yet. */
  [metric: string]: number | undefined;
}

export type MetricKey = keyof PlayerMetrics;
