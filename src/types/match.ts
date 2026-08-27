import type { Player } from "./player";
import type { Team } from "./team";

/**
 * Not consumed by the current test screen yet — defined now so the data
 * model already has a place for match-level concepts (upload -> queued ->
 * processed) once a real backend and processing pipeline exist.
 */
export type MatchStatus = "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";

export interface Match {
  id: string;
  status: MatchStatus;
  date?: string;
  teams: Team[];
  players: Player[];
}
