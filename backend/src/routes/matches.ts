import { Router } from "express";
import { db } from "../db";
import { serializePlayer } from "../lib/serialize";

export const matchesRouter = Router();

/**
 * Real per-team aggregates only (distance/sprints/topSpeed) — genuine
 * sums/maxes of real per-player rows, same computation the frontend's
 * aggregateTeamPhysical does today. No score or possession: those are
 * fabricated for every match in this product (see schema.prisma's Match
 * model comment) and stay a frontend-only concern.
 */
function aggregateTeamPhysical(
  stats: { playerId: string; metricKey: string; value: number }[],
  playerIdsOnTeam: Set<string>,
) {
  const teamStats = stats.filter((stat) => playerIdsOnTeam.has(stat.playerId));
  const sum = (key: string) =>
    teamStats.filter((stat) => stat.metricKey === key).reduce((total, stat) => total + stat.value, 0);
  const max = (key: string) =>
    teamStats.filter((stat) => stat.metricKey === key).reduce((best, stat) => Math.max(best, stat.value), 0);

  return {
    distance: sum("distance"),
    sprints: sum("sprints"),
    topSpeed: max("topSpeed"),
  };
}

async function serializeMatchSummary(match: {
  id: string;
  status: string;
  date: Date;
  competition: string;
  homeTeamId: number;
  awayTeamId: number;
}) {
  const [homeTeam, awayTeam] = await Promise.all([
    db.team.findUnique({ where: { id: match.homeTeamId } }),
    db.team.findUnique({ where: { id: match.awayTeamId } }),
  ]);

  return {
    id: match.id,
    status: match.status,
    date: match.date.toISOString().slice(0, 10),
    competition: match.competition,
    homeTeam,
    awayTeam,
  };
}

matchesRouter.get("/matches", async (_req, res) => {
  const matches = await db.match.findMany({ orderBy: { date: "desc" } });
  res.json({ matches: await Promise.all(matches.map(serializeMatchSummary)) });
});

matchesRouter.get("/matches/:id", async (req, res) => {
  const match = await db.match.findUnique({ where: { id: req.params.id } });
  if (!match) return res.status(404).json({ error: "Match not found" });

  const stats = await db.playerMatchStatistic.findMany({ where: { matchId: match.id } });
  const players = await db.player.findMany({
    where: { id: { in: [...new Set(stats.map((stat) => stat.playerId))] } },
  });

  const homePlayerIds = new Set(players.filter((p) => p.teamId === match.homeTeamId).map((p) => p.id));
  const awayPlayerIds = new Set(players.filter((p) => p.teamId === match.awayTeamId).map((p) => p.id));

  const summary = await serializeMatchSummary(match);
  res.json({
    ...summary,
    playerCount: players.length,
    teamStats: [
      { teamId: match.homeTeamId, ...aggregateTeamPhysical(stats, homePlayerIds) },
      { teamId: match.awayTeamId, ...aggregateTeamPhysical(stats, awayPlayerIds) },
    ],
  });
});

matchesRouter.get("/matches/:id/players", async (req, res) => {
  const match = await db.match.findUnique({ where: { id: req.params.id } });
  if (!match) return res.status(404).json({ error: "Match not found" });

  const stats = await db.playerMatchStatistic.findMany({ where: { matchId: match.id } });
  const playerIds = [...new Set(stats.map((stat) => stat.playerId))];
  const players = await db.player.findMany({ where: { id: { in: playerIds } } });

  res.json({
    players: players.map((player) =>
      serializePlayer(player, stats.filter((stat) => stat.playerId === player.id)),
    ),
  });
});

/**
 * POST /matches — creates a match record + a QUEUED processing job.
 * Deliberately does NOT accept or process a video file: this route only
 * establishes the async boundary the handoff (§11) requires ("heavy
 * video processing must run in a queued, asynchronous worker — never
 * inside an HTTP request"). A real client would upload the source video
 * straight to object storage (out of scope here — no object store is
 * implemented in this repo) and pass the resulting storage key; a
 * separate worker process would then claim QUEUED jobs and write
 * PlayerMatchStatistic rows as it completes them. Nothing in this repo
 * runs that worker yet.
 */
matchesRouter.post("/matches", async (req, res) => {
  const { date, competition, homeTeamId, awayTeamId, sourceVideoKey } = req.body ?? {};

  if (
    typeof date !== "string" ||
    typeof competition !== "string" ||
    typeof homeTeamId !== "number" ||
    typeof awayTeamId !== "number"
  ) {
    return res.status(400).json({
      error: "Expected { date: string, competition: string, homeTeamId: number, awayTeamId: number, sourceVideoKey?: string }",
    });
  }

  const match = await db.match.create({
    data: { date: new Date(date), competition, homeTeamId, awayTeamId, status: "PENDING" },
  });

  const processingJob = await db.processingJob.create({
    data: { matchId: match.id, status: "QUEUED" },
  });

  if (typeof sourceVideoKey === "string" && sourceVideoKey.length > 0) {
    await db.mediaAsset.create({
      data: { matchId: match.id, kind: "SOURCE_VIDEO", storageKey: sourceVideoKey },
    });
  }

  res.status(201).json({
    match: await serializeMatchSummary(match),
    processingJob: { id: processingJob.id, status: processingJob.status },
  });
});
