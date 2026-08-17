import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/client";

/**
 * Award.criteria shapes this engine understands. Kept intentionally small —
 * extend with new criteria "type"s as new award ideas come up, rather than
 * building a general rule DSL up front.
 *
 * Threshold example (30+ point game):
 *   { "type": "threshold", "metric": "points", "operator": ">=", "value": 30 }
 *
 * All-of example (points + rebounds double-double):
 *   { "type": "all", "criteria": [
 *       { "type": "threshold", "metric": "points", "operator": ">=", "value": 10 },
 *       { "type": "threshold", "metric": "rebounds_defensive", "operator": ">=", "value": 10 }
 *   ] }
 *
 * Note: criteria can only check metric keys that exist verbatim in
 * GameStat.metrics (see docs/tracker-schema.md) — there's no support here
 * for derived values like "offensive + defensive rebounds combined" unless
 * the tracker or ingest pipeline also writes that combined key.
 */
type ThresholdOperator = ">=" | ">" | "<=" | "<" | "==";

type Criteria =
  | { type: "threshold"; metric: string; operator: ThresholdOperator; value: number }
  | { type: "all"; criteria: Criteria[] };

function compare(actual: number, operator: ThresholdOperator, target: number) {
  switch (operator) {
    case ">=":
      return actual >= target;
    case ">":
      return actual > target;
    case "<=":
      return actual <= target;
    case "<":
      return actual < target;
    case "==":
      return actual === target;
  }
}

function metricsMeetCriteria(metrics: Record<string, unknown>, criteria: Criteria): boolean {
  if (criteria.type === "threshold") {
    const actual = Number(metrics[criteria.metric] ?? NaN);
    if (Number.isNaN(actual)) return false;
    return compare(actual, criteria.operator, criteria.value);
  }
  return criteria.criteria.every((c) => metricsMeetCriteria(metrics, c));
}

/**
 * Evaluates every Award registered for a game's sport against each player's
 * stat line for that game, and records any newly-earned PlayerAward rows.
 * Safe to re-run for the same game (skips awards already granted).
 */
export async function evaluateAwardsForGame(gameId: string): Promise<number> {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: { stats: true },
  });

  const awards = await prisma.award.findMany({ where: { sport: game.sport } });
  if (awards.length === 0) return 0;

  let granted = 0;

  for (const stat of game.stats) {
    const metrics = stat.metrics as Record<string, unknown>;

    for (const award of awards) {
      const criteria = award.criteria as unknown as Criteria;
      if (!metricsMeetCriteria(metrics, criteria)) continue;

      const existing = await prisma.playerAward.findFirst({
        where: { awardId: award.id, playerId: stat.playerId, gameId: game.id },
      });
      if (existing) continue;

      await prisma.playerAward.create({
        data: {
          awardId: award.id,
          playerId: stat.playerId,
          gameId: game.id,
          value: metrics as Prisma.InputJsonValue,
        },
      });
      granted++;
    }
  }

  return granted;
}
