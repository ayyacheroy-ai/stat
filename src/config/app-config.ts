/**
 * Single source of truth for editable demo/brand data.
 *
 * Change team names, player names, tracker-ID mappings, and branding here —
 * nowhere else in the codebase should hardcode these values. Components
 * read through the helpers below so this file stays the only place you
 * need to touch to re-brand the app or re-map a new match's CSV.
 */
export interface TeamConfig {
  name: string;
  color: string;
}

export interface AppConfig {
  brand: {
    name: string;
    tagline: string;
    /** Primary accent color (hex). Used sparingly: CTAs, active states, hero stats. */
    accentColor: string;
  };
  /** Team ID (as it appears in the tracker CSV's `team` column) -> display info. */
  teams: Record<number, TeamConfig>;
  /** Tracker ID (as it appears in the tracker CSV's `tracker_id` column) -> player name. */
  players: Record<number, string>;
  /** Demo-only toggles. Not read anywhere yet — reserved for a future "this stat is mock data" affordance. */
  demo: {
    showMockDataBadge: boolean;
  };
}

// The per-stat registry (labels, units, which CSV columns feed which
// metric, real-vs-mock defaults) lives in src/data/registry/metrics.ts —
// kept out of this file since it's sizable, but it's the other half of
// "everything editable in one obvious place."

export const appConfig: AppConfig = {
  brand: {
    name: "Pitchline",
    tagline: "Football analytics, from match video to insight.",
    accentColor: "#2BD97C",
  },
  teams: {
    0: { name: "Team A", color: "#2BD97C" },
    1: { name: "Team B", color: "#F5A524" },
  },
  players: {
    18: "M. Rossi",
    13: "D. Silva",
    9: "J. Owusu",
    8: "K. Novak",
  },
  demo: {
    showMockDataBadge: false,
  },
};

export function getTeamName(teamId: number): string {
  return appConfig.teams[teamId]?.name ?? `Team ${teamId}`;
}

export function getTeamColor(teamId: number): string {
  return appConfig.teams[teamId]?.color ?? "var(--color-muted-foreground)";
}

export function getPlayerName(trackerId: number): string {
  return appConfig.players[trackerId] ?? `Player #${trackerId}`;
}
