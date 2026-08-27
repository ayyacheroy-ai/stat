import type {
  CareerClub,
  MarketValuePoint,
  MockMatch,
  PlayerProfileExtras,
} from "@/types/profile";
import { createRng, hashSeed, pick, randInt, randRange } from "./rng";
import {
  MOCK_CLUB_NAMES,
  MOCK_COMPETITIONS,
  MOCK_FIRST_NAMES,
  MOCK_LAST_NAMES,
  POSITIONS,
} from "./name-pools";
import { MOCK_REFERENCE_YEAR } from "./generate-player-mock";

const MONTH_NAMES = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
];

function buildMarketValueHistory(rng: () => number, currentValueEur: number): MarketValuePoint[] {
  const points: MarketValuePoint[] = [];
  let value = currentValueEur * randRange(rng, 0.55, 0.85);

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (11 - i + 6) % 12; // arbitrary but deterministic month labels
    const isLast = i === 0;
    value = isLast ? currentValueEur : value * randRange(rng, 0.92, 1.22);
    points.push({
      month: `${MOCK_REFERENCE_YEAR}-${MONTH_NAMES[monthIndex]}`,
      valueEur: Math.round(value / 1000) * 1000,
    });
  }

  return points;
}

function buildRecentMatches(rng: () => number, seasonRatingHint: number): MockMatch[] {
  const matches: MockMatch[] = [];

  for (let i = 0; i < 5; i++) {
    const dayOffset = (i + 1) * 7;
    const day = Math.max(1, 28 - dayOffset);
    const month = 8 - Math.floor(dayOffset / 28);

    const scoreFor = randInt(rng, 0, 3);
    const scoreAgainst = randInt(rng, 0, 3);
    const result = scoreFor > scoreAgainst ? "W" : scoreFor === scoreAgainst ? "D" : "L";

    const minutesPlayed = pick(rng, [90, 90, 90, 78, 65, 45]);
    const goals = rng() > 0.7 ? randInt(rng, 0, 2) : 0;
    const assists = rng() > 0.75 ? randInt(rng, 0, 1) : 0;
    const yellowCards = rng() > 0.85 ? 1 : 0;
    const redCards = rng() > 0.97 ? 1 : 0;
    const rating = Math.max(4.5, Math.min(9.5, seasonRatingHint + randRange(rng, -1.2, 1.2)));

    matches.push({
      id: `mock-match-${i}`,
      date: `${MOCK_REFERENCE_YEAR}-${String(Math.max(1, month)).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      opponent: pick(rng, MOCK_CLUB_NAMES),
      competition: pick(rng, MOCK_COMPETITIONS),
      result,
      scoreFor,
      scoreAgainst,
      minutesPlayed,
      goals,
      assists,
      yellowCards,
      redCards,
      rating: Math.round(rating * 10) / 10,
    });
  }

  return matches;
}

function buildTeammates(rng: () => number): string[] {
  const count = 4;
  const names = new Set<string>();
  while (names.size < count) {
    names.add(`${pick(rng, MOCK_FIRST_NAMES)} ${pick(rng, MOCK_LAST_NAMES)}`);
  }
  return Array.from(names);
}

function buildCareerClubs(rng: () => number, currentClub: string): CareerClub[] {
  const previousClub = pick(rng, MOCK_CLUB_NAMES.filter((club) => club !== currentClub));
  const joinedCurrentYear = randInt(rng, MOCK_REFERENCE_YEAR - 3, MOCK_REFERENCE_YEAR - 1);

  return [
    { club: currentClub, fromYear: joinedCurrentYear },
    { club: previousClub, fromYear: joinedCurrentYear - randInt(rng, 2, 4), toYear: joinedCurrentYear },
  ];
}

export function generatePlayerProfileExtras(
  trackerId: number,
  currentMarketValueEur: number,
  ratingHint: number,
): PlayerProfileExtras {
  const rng = createRng(hashSeed(`pitchline-profile-${trackerId}`));

  const primary = pick(rng, POSITIONS);
  const secondaryOptions = POSITIONS.filter((position) => position !== primary);
  const hasSecondary = rng() > 0.5;

  const currentClub = pick(rng, MOCK_CLUB_NAMES);

  return {
    currentClub,
    position: {
      primary,
      secondary: hasSecondary ? pick(rng, secondaryOptions) : undefined,
    },
    marketValueHistory: buildMarketValueHistory(rng, currentMarketValueEur),
    recentMatches: buildRecentMatches(rng, ratingHint),
    teammates: buildTeammates(rng),
    careerClubs: buildCareerClubs(rng, currentClub),
  };
}
