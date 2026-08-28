import type { Match } from "@/types/match";
import type { MatchResult } from "@/components/ui/WDLBadge";

/** Result from teams[0]'s perspective — always "our" team, per generate-matches.ts. */
export function getMatchResult(match: Match): MatchResult {
  const [home, away] = match.teamStats;
  if (home.score === away.score) return "D";
  return home.score > away.score ? "W" : "L";
}
