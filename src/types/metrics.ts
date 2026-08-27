/**
 * A metric is never just a number — it's tagged with where it came from.
 * 'tracker' = genuinely produced by our computer-vision pipeline's CSV export.
 * 'mock'    = demo dressing generated to make the product feel complete.
 *
 * This tag is what lets the CSV upload feature (see data/adapters) flip a
 * metric from mock to real without the UI changing at all — components
 * render a metric the same way regardless of its source.
 */
export type MetricSource = "tracker" | "mock";

export interface MetricValue {
  value: number;
  source: MetricSource;
}

/** A player's (or team's) full set of metrics, keyed by metric key. */
export type MetricBag = Record<string, MetricValue>;

/**
 * Grouping used to organize the season performance table and other
 * stat-heavy views. 'overall' covers rating/minutes/appearances — things
 * that don't belong to a single phase of play.
 */
export type MetricGroup =
  | "physical"
  | "shooting"
  | "passing"
  | "possession"
  | "defending"
  | "discipline"
  | "overall";

/**
 * The single source of truth for every stat the app can display. Adding a
 * new metric anywhere in the product means adding one entry here — never
 * hardcoding a label, unit, or CSV column name inside a component.
 */
export interface MetricDefinition {
  key: string;
  label: string;
  unit?: string;
  decimals: number;
  group: MetricGroup;
  /** Whether a bigger number is "better" — drives leaderboard sort direction and coloring. */
  higherIsBetter: boolean;
  /** CSV column name(s), bundled or uploaded, that populate this metric. */
  mapsFrom: string[];
  /** What this metric is today, absent any real data override. */
  defaultSource: MetricSource;
  /** Converts a stored raw value (e.g. meters) into its display unit (e.g. km). Identity if omitted. */
  toDisplay?: (rawValue: number) => number;
}

export type MetricRegistry = Record<string, MetricDefinition>;
