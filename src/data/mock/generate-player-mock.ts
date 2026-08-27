import type { MetricBag } from "@/types/metrics";
import type { PlayerBio } from "@/types/player";
import { createRng, hashSeed, pick, randInt, randRange } from "./rng";

/**
 * Fixed anchor for computing a mock date of birth from a mock age. Kept
 * constant (not Date.now()) so a player's mock birth year never quietly
 * shifts depending on what day the demo happens to be viewed.
 */
const MOCK_REFERENCE_YEAR = 2026;

const COUNTRIES = [
  "England",
  "Spain",
  "Portugal",
  "France",
  "Brazil",
  "Argentina",
  "Netherlands",
  "Nigeria",
  "Morocco",
  "Croatia",
] as const;

const FEET = ["Right", "Right", "Right", "Left", "Both"] as const;

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function mock(value: number): MetricBag[string] {
  return { value, source: "mock" };
}

export interface PlayerMockData {
  metrics: MetricBag;
  bio: PlayerBio;
}

/**
 * Generates every metric/bio field the app might want to show for a
 * player, seeded off their tracker_id so the numbers never change between
 * reloads. Values are hand-tuned to stay internally consistent (shots on
 * target <= shots, xG < shots, pass accuracy 0-100, rating 0-10) rather
 * than fully independent random draws.
 */
export function generatePlayerMock(trackerId: number): PlayerMockData {
  const rng = createRng(hashSeed(`pitchline-player-${trackerId}`));

  const ageYears = randInt(rng, 18, 34);
  const birthYear = MOCK_REFERENCE_YEAR - ageYears;
  const birthMonth = randInt(rng, 1, 12);
  const birthDay = randInt(rng, 1, 28);

  const shots = randInt(rng, 15, 90);
  const shotsOnTarget = Math.min(shots, randInt(rng, Math.round(shots * 0.3), Math.round(shots * 0.55)));
  const goals = Math.min(shotsOnTarget, randInt(rng, 0, Math.round(shotsOnTarget * 0.4)));
  const xg = round(Math.min(shots - 0.5, goals * randRange(rng, 0.6, 1.3) + shots * 0.04), 2);
  const xgot = round(Math.min(shotsOnTarget - 0.2, xg * randRange(rng, 0.7, 1.1)), 2);

  const passes = randInt(rng, 250, 1200);
  const passAccuracy = randInt(rng, 62, 93);
  const assists = randInt(rng, 0, 10);
  const chancesCreated = randInt(rng, 2, 25);

  const touches = randInt(rng, 400, 1600);
  const touchesInBox = randInt(rng, 8, 80);
  const dribbles = randInt(rng, 4, 40);
  const duelsWon = randInt(rng, 35, 65);
  const possession = randInt(rng, 38, 62);

  const tackles = randInt(rng, 8, 60);
  const interceptions = randInt(rng, 4, 40);
  const recoveries = randInt(rng, 18, 90);
  const blocks = randInt(rng, 0, 20);

  const fouls = randInt(rng, 4, 30);
  const yellowCards = randInt(rng, 0, 6);
  const redCards = rng() > 0.92 ? 1 : 0;

  const matchesPlayed = randInt(rng, 8, 30);
  const matchesStarted = Math.min(matchesPlayed, randInt(rng, Math.round(matchesPlayed * 0.4), matchesPlayed));
  const minutesPlayed = matchesStarted * randInt(rng, 60, 90) + (matchesPlayed - matchesStarted) * randInt(rng, 5, 30);

  const ratingBase =
    6.0 +
    goals * 0.08 +
    assists * 0.06 +
    (tackles + interceptions) * 0.004 -
    fouls * 0.01 -
    yellowCards * 0.05 -
    redCards * 0.6 +
    randRange(rng, -0.3, 0.3);
  const rating = round(Math.max(4.5, Math.min(9.5, ratingBase)), 1);

  const metrics: MetricBag = {
    rating: mock(rating),
    minutesPlayed: mock(minutesPlayed),
    matchesPlayed: mock(matchesPlayed),
    matchesStarted: mock(matchesStarted),
    goals: mock(goals),
    shots: mock(shots),
    shotsOnTarget: mock(shotsOnTarget),
    xg: mock(xg),
    xgot: mock(xgot),
    assists: mock(assists),
    passes: mock(passes),
    passAccuracy: mock(passAccuracy),
    chancesCreated: mock(chancesCreated),
    touches: mock(touches),
    touchesInBox: mock(touchesInBox),
    dribbles: mock(dribbles),
    duelsWon: mock(duelsWon),
    possession: mock(possession),
    tackles: mock(tackles),
    interceptions: mock(interceptions),
    recoveries: mock(recoveries),
    blocks: mock(blocks),
    fouls: mock(fouls),
    yellowCards: mock(yellowCards),
    redCards: mock(redCards),
  };

  const bio: PlayerBio = {
    heightCm: randInt(rng, 168, 195),
    ageYears,
    dateOfBirth: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
    preferredFoot: pick(rng, FEET),
    country: pick(rng, COUNTRIES),
    shirtNumber: trackerId > 0 && trackerId <= 99 ? trackerId : randInt(rng, 2, 33),
    marketValueEur: Math.round(randRange(rng, 50_000, 3_000_000) / 1000) * 1000,
    contractEndYear: randInt(rng, MOCK_REFERENCE_YEAR, MOCK_REFERENCE_YEAR + 3),
  };

  return { metrics, bio };
}
