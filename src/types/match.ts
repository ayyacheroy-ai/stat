import type { Player } from "./player";
import type { Team } from "./team";

export type MatchStatus = "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";

/**
 * Per-team numbers for one match. Possession is always mock — there's no
 * tracker equivalent for it yet. Distance/sprints/topSpeed are real
 * aggregates (summed/maxed from actual player metrics) only when the
 * match they belong to is `isTracked`; for the mock match history these
 * are themselves generated, since we have no per-player data for matches
 * our tracker never processed.
 */
export interface MatchTeamStats {
  teamId: number;
  score: number;
  possession: number;
  distance: number;
  sprints: number;
  topSpeed: number;
}

export interface Match {
  id: string;
  status: MatchStatus;
  date: string;
  competition: string;
  /** [ours, opponent] */
  teams: [Team, Team];
  teamStats: [MatchTeamStats, MatchTeamStats];
  /** Only populated for the one match our tracker actually processed — real per-player data for the leaderboard section. Empty for mock match history. */
  players: Player[];
  playerCount: number;
  /** True only for the match built from the real bundled/uploaded CSV. */
  isTracked: boolean;
}
