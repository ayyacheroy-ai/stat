import type { MatchResult } from "@/components/ui/WDLBadge";

/**
 * Content specific to the deep Player Profile page. Kept separate from
 * the core `Player` type (metrics/bio) because it's page-specific mock
 * dressing — matches, career history, teammates — not part of the
 * flexible metric model other screens (cards, leaderboards) depend on.
 * Entirely mock; there's no tracker equivalent for any of this yet.
 */
export interface PlayerPosition {
  primary: string;
  secondary?: string;
}

export interface MarketValuePoint {
  /** "YYYY-MM" */
  month: string;
  valueEur: number;
}

export interface MockMatch {
  id: string;
  date: string;
  opponent: string;
  competition: string;
  result: MatchResult;
  scoreFor: number;
  scoreAgainst: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
}

export interface CareerClub {
  club: string;
  fromYear: number;
  /** Omitted = still there. */
  toYear?: number;
}

export interface PlayerProfileExtras {
  currentClub: string;
  position: PlayerPosition;
  marketValueHistory: MarketValuePoint[];
  recentMatches: MockMatch[];
  teammates: string[];
  careerClubs: CareerClub[];
}
