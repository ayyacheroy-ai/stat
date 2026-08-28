import type { Match, MatchTeamStats } from "@/types/match";
import type { Player } from "@/types/player";
import { getTeamName } from "@/config/app-config";
import { getMetric } from "@/lib/metrics";
import { createRng, hashSeed, pick, randInt, randRange } from "./rng";
import { MOCK_CLUB_NAMES, MOCK_COMPETITIONS } from "./name-pools";
import { MOCK_REFERENCE_YEAR } from "./generate-player-mock";

/** Sums/maxes a team's real per-player metrics — genuinely real when the match is tracked. */
function aggregateTeamPhysical(players: Player[], teamId: number) {
  const teamPlayers = players.filter((player) => player.teamId === teamId);
  return {
    distance: teamPlayers.reduce((sum, player) => sum + (getMetric(player, "distance")?.value ?? 0), 0),
    sprints: teamPlayers.reduce((sum, player) => sum + (getMetric(player, "sprints")?.value ?? 0), 0),
    topSpeed: teamPlayers.reduce((max, player) => Math.max(max, getMetric(player, "topSpeed")?.value ?? 0), 0),
  };
}

/**
 * The one match our tracker's CSV actually covers. Team names/ids come
 * from config (real teams 0 and 1); the scoreline and possession split
 * are mock (we don't detect goals or track the ball yet), but distance,
 * sprints, and top speed are genuine sums/maxes of the real per-player
 * data — never generated.
 */
export function buildCurrentMatch(players: Player[]): Match {
  const rng = createRng(hashSeed("pitchline-current-match"));
  const homeScore = randInt(rng, 0, 4);
  const awayScore = randInt(rng, 0, 3);
  const homePossession = randInt(rng, 42, 58);

  const teamStats: [MatchTeamStats, MatchTeamStats] = [
    { teamId: 0, score: homeScore, possession: homePossession, ...aggregateTeamPhysical(players, 0) },
    { teamId: 1, score: awayScore, possession: 100 - homePossession, ...aggregateTeamPhysical(players, 1) },
  ];

  return {
    id: "match-current",
    status: "COMPLETE",
    date: `${MOCK_REFERENCE_YEAR}-08-21`,
    competition: "League",
    teams: [
      { id: 0, name: getTeamName(0) },
      { id: 1, name: getTeamName(1) },
    ],
    teamStats,
    players,
    playerCount: players.length,
    isTracked: true,
  };
}

/**
 * A past match our tracker never covered — everything about it, including
 * the "team" physical stats, is generated. Always features our own team
 * (id 0) against a mock opponent, so the match history reads as one
 * club's fixture list rather than random unrelated fixtures.
 */
function buildMockMatch(index: number): Match {
  const rng = createRng(hashSeed(`pitchline-mock-match-${index}`));

  const ourScore = randInt(rng, 0, 4);
  const opponentScore = randInt(rng, 0, 3);
  const ourPossession = randInt(rng, 38, 62);

  const dayOffset = (index + 2) * 9;
  const day = Math.max(1, 28 - (dayOffset % 28));
  const month = Math.max(1, 8 - Math.floor(dayOffset / 28));

  const opponent = pick(rng, MOCK_CLUB_NAMES);

  function randomTeamPhysical(): Omit<MatchTeamStats, "teamId" | "score" | "possession"> {
    return {
      distance: Math.round(randRange(rng, 92_000, 118_000)),
      sprints: randInt(rng, 60, 140),
      topSpeed: Math.round(randRange(rng, 28, 34) * 10) / 10,
    };
  }

  const teamStats: [MatchTeamStats, MatchTeamStats] = [
    { teamId: 0, score: ourScore, possession: ourPossession, ...randomTeamPhysical() },
    { teamId: -1 - index, score: opponentScore, possession: 100 - ourPossession, ...randomTeamPhysical() },
  ];

  return {
    id: `match-mock-${index}`,
    status: "COMPLETE",
    date: `${MOCK_REFERENCE_YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    competition: pick(rng, MOCK_COMPETITIONS),
    teams: [
      { id: 0, name: getTeamName(0) },
      { id: -1 - index, name: opponent },
    ],
    teamStats,
    players: [],
    playerCount: randInt(rng, 14, 20),
    isTracked: false,
  };
}

const MOCK_MATCH_COUNT = 4;

export function getMatches(players: Player[]): Match[] {
  return [buildCurrentMatch(players), ...Array.from({ length: MOCK_MATCH_COUNT }, (_, i) => buildMockMatch(i))];
}
