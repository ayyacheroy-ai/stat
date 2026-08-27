import type {
  MetricDefinition,
  MetricGroup,
  MetricRegistry,
} from "@/types/metrics";

/**
 * Every stat the app knows about, real or mock. This is the ONLY place
 * that should ever say "this metric is called Top Speed, shown in km/h,
 * comes from the top_speed_kmh column, and higher is better." Everything
 * else — the season table, the leaderboard, the CSV upload mapper —
 * reads from here instead of hardcoding stat definitions.
 *
 * `mapsFrom` doubles as the CSV upload feature's column map: dropping a
 * richer CSV with a `goals` column automatically routes it to the
 * `goals` metric and flips its source from mock to tracker.
 */
export const metricRegistry: MetricRegistry = {
  // --- Physical: genuinely produced by the tracker today ---
  distance: {
    key: "distance",
    label: "Distance",
    unit: "km",
    decimals: 2,
    group: "physical",
    higherIsBetter: true,
    mapsFrom: ["distance_m"],
    defaultSource: "tracker",
    toDisplay: (meters) => meters / 1000,
  },
  averageSpeed: {
    key: "averageSpeed",
    label: "Avg Speed",
    unit: "m/s",
    decimals: 2,
    group: "physical",
    higherIsBetter: true,
    mapsFrom: ["avg_speed_ms"],
    defaultSource: "tracker",
  },
  topSpeed: {
    key: "topSpeed",
    label: "Top Speed",
    unit: "km/h",
    decimals: 1,
    group: "physical",
    higherIsBetter: true,
    mapsFrom: ["top_speed_kmh"],
    defaultSource: "tracker",
  },
  sprints: {
    key: "sprints",
    label: "Sprints",
    decimals: 0,
    group: "physical",
    higherIsBetter: true,
    mapsFrom: ["sprints"],
    defaultSource: "tracker",
  },
  secondsTracked: {
    key: "secondsTracked",
    label: "Time Tracked",
    unit: "s",
    decimals: 0,
    group: "physical",
    higherIsBetter: false,
    mapsFrom: ["seconds_tracked"],
    defaultSource: "tracker",
  },

  // --- Overall: mock until we produce real match/rating data ---
  rating: {
    key: "rating",
    label: "Rating",
    decimals: 1,
    group: "overall",
    higherIsBetter: true,
    mapsFrom: ["rating"],
    defaultSource: "mock",
  },
  minutesPlayed: {
    key: "minutesPlayed",
    label: "Minutes",
    decimals: 0,
    group: "overall",
    higherIsBetter: true,
    mapsFrom: ["minutes"],
    defaultSource: "mock",
  },
  matchesPlayed: {
    key: "matchesPlayed",
    label: "Matches",
    decimals: 0,
    group: "overall",
    higherIsBetter: true,
    mapsFrom: ["matches"],
    defaultSource: "mock",
  },
  matchesStarted: {
    key: "matchesStarted",
    label: "Started",
    decimals: 0,
    group: "overall",
    higherIsBetter: true,
    mapsFrom: ["started"],
    defaultSource: "mock",
  },

  // --- Shooting: mock ---
  goals: {
    key: "goals",
    label: "Goals",
    decimals: 0,
    group: "shooting",
    higherIsBetter: true,
    mapsFrom: ["goals"],
    defaultSource: "mock",
  },
  shots: {
    key: "shots",
    label: "Shots",
    decimals: 0,
    group: "shooting",
    higherIsBetter: true,
    mapsFrom: ["shots"],
    defaultSource: "mock",
  },
  shotsOnTarget: {
    key: "shotsOnTarget",
    label: "Shots on Target",
    decimals: 0,
    group: "shooting",
    higherIsBetter: true,
    mapsFrom: ["shots_on_target", "shotsOnTarget"],
    defaultSource: "mock",
  },
  xg: {
    key: "xg",
    label: "xG",
    decimals: 2,
    group: "shooting",
    higherIsBetter: true,
    mapsFrom: ["xg"],
    defaultSource: "mock",
  },
  xgot: {
    key: "xgot",
    label: "xGOT",
    decimals: 2,
    group: "shooting",
    higherIsBetter: true,
    mapsFrom: ["xgot"],
    defaultSource: "mock",
  },

  // --- Passing: mock ---
  assists: {
    key: "assists",
    label: "Assists",
    decimals: 0,
    group: "passing",
    higherIsBetter: true,
    mapsFrom: ["assists"],
    defaultSource: "mock",
  },
  passes: {
    key: "passes",
    label: "Passes",
    decimals: 0,
    group: "passing",
    higherIsBetter: true,
    mapsFrom: ["passes"],
    defaultSource: "mock",
  },
  passAccuracy: {
    key: "passAccuracy",
    label: "Pass Accuracy",
    unit: "%",
    decimals: 0,
    group: "passing",
    higherIsBetter: true,
    mapsFrom: ["pass_accuracy", "passAccuracy"],
    defaultSource: "mock",
  },
  chancesCreated: {
    key: "chancesCreated",
    label: "Chances Created",
    decimals: 0,
    group: "passing",
    higherIsBetter: true,
    mapsFrom: ["chances_created"],
    defaultSource: "mock",
  },

  // --- Possession: mock ---
  touches: {
    key: "touches",
    label: "Touches",
    decimals: 0,
    group: "possession",
    higherIsBetter: true,
    mapsFrom: ["touches"],
    defaultSource: "mock",
  },
  touchesInBox: {
    key: "touchesInBox",
    label: "Touches in Box",
    decimals: 0,
    group: "possession",
    higherIsBetter: true,
    mapsFrom: ["touches_in_box"],
    defaultSource: "mock",
  },
  dribbles: {
    key: "dribbles",
    label: "Dribbles",
    decimals: 0,
    group: "possession",
    higherIsBetter: true,
    mapsFrom: ["dribbles"],
    defaultSource: "mock",
  },
  duelsWon: {
    key: "duelsWon",
    label: "Duels Won",
    unit: "%",
    decimals: 0,
    group: "possession",
    higherIsBetter: true,
    mapsFrom: ["duels_won"],
    defaultSource: "mock",
  },
  possession: {
    key: "possession",
    label: "Possession",
    unit: "%",
    decimals: 0,
    group: "possession",
    higherIsBetter: true,
    mapsFrom: ["possession"],
    defaultSource: "mock",
  },

  // --- Defending: mock ---
  tackles: {
    key: "tackles",
    label: "Tackles",
    decimals: 0,
    group: "defending",
    higherIsBetter: true,
    mapsFrom: ["tackles"],
    defaultSource: "mock",
  },
  interceptions: {
    key: "interceptions",
    label: "Interceptions",
    decimals: 0,
    group: "defending",
    higherIsBetter: true,
    mapsFrom: ["interceptions"],
    defaultSource: "mock",
  },
  recoveries: {
    key: "recoveries",
    label: "Recoveries",
    decimals: 0,
    group: "defending",
    higherIsBetter: true,
    mapsFrom: ["recoveries"],
    defaultSource: "mock",
  },
  blocks: {
    key: "blocks",
    label: "Blocks",
    decimals: 0,
    group: "defending",
    higherIsBetter: true,
    mapsFrom: ["blocks"],
    defaultSource: "mock",
  },

  // --- Discipline: mock ---
  fouls: {
    key: "fouls",
    label: "Fouls",
    decimals: 0,
    group: "discipline",
    higherIsBetter: false,
    mapsFrom: ["fouls"],
    defaultSource: "mock",
  },
  yellowCards: {
    key: "yellowCards",
    label: "Yellow Cards",
    decimals: 0,
    group: "discipline",
    higherIsBetter: false,
    mapsFrom: ["yellow_cards"],
    defaultSource: "mock",
  },
  redCards: {
    key: "redCards",
    label: "Red Cards",
    decimals: 0,
    group: "discipline",
    higherIsBetter: false,
    mapsFrom: ["red_cards"],
    defaultSource: "mock",
  },
};

export const metricGroupLabels: Record<MetricGroup, string> = {
  overall: "Overall",
  physical: "Physical",
  shooting: "Shooting",
  passing: "Passing",
  possession: "Possession",
  defending: "Defending",
  discipline: "Discipline",
};

/** Display order for grouped stat tables (season performance, etc). */
export const metricGroupOrder: MetricGroup[] = [
  "overall",
  "shooting",
  "passing",
  "possession",
  "defending",
  "discipline",
  "physical",
];

export function getMetricDefinition(key: string): MetricDefinition | undefined {
  return metricRegistry[key];
}

export function getMetricsByGroup(group: MetricGroup): MetricDefinition[] {
  return Object.values(metricRegistry).filter((def) => def.group === group);
}

/** CSV/upload column name -> metric key, built once from every definition's `mapsFrom`. */
export function buildColumnToMetricKeyMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const def of Object.values(metricRegistry)) {
    for (const column of def.mapsFrom) {
      map.set(column, def.key);
    }
  }
  return map;
}

export function formatMetricValue(key: string, rawValue: number): string {
  const def = metricRegistry[key];
  if (!def) return rawValue.toString();
  const displayValue = def.toDisplay ? def.toDisplay(rawValue) : rawValue;
  return displayValue.toFixed(def.decimals);
}
