import { Router } from "express";
import { db } from "../db";
import { serializePlayer } from "../lib/serialize";
import { getLatestCompleteMatch } from "../lib/latest-match";

export const playersRouter = Router();

/**
 * GET /players — every player, with metrics scoped to the latest complete
 * match (see lib/latest-match.ts). Response shape is a direct precursor
 * of the frontend's Player[]: the frontend's api-adapter.ts prepends the
 * `tracker-` id prefix and passes everything else through unchanged.
 */
playersRouter.get("/players", async (_req, res) => {
  const latestMatch = await getLatestCompleteMatch();
  const players = await db.player.findMany({ orderBy: { trackerId: "asc" } });

  const statsByPlayer = latestMatch
    ? await db.playerMatchStatistic.findMany({ where: { matchId: latestMatch.id } })
    : [];

  const players_ = players.map((player) =>
    serializePlayer(
      player,
      statsByPlayer.filter((stat) => stat.playerId === player.id),
    ),
  );

  res.json({ players: players_ });
});

playersRouter.get("/players/:trackerId", async (req, res) => {
  const trackerId = Number(req.params.trackerId);
  if (!Number.isFinite(trackerId)) {
    return res.status(400).json({ error: "trackerId must be a number" });
  }

  const player = await db.player.findUnique({ where: { trackerId } });
  if (!player) return res.status(404).json({ error: "Player not found" });

  const latestMatch = await getLatestCompleteMatch();
  const stats = latestMatch
    ? await db.playerMatchStatistic.findMany({
        where: { playerId: player.id, matchId: latestMatch.id },
      })
    : [];

  res.json({ player: serializePlayer(player, stats) });
});

/**
 * GET /players/:trackerId/statistics — the endpoint the handoff's worked
 * example (§12) names directly. Optional ?matchId= scopes to one match;
 * default is the latest complete match, matching GET /players/:trackerId.
 * Response is the MetricBag shape alone (no player/bio wrapper), since
 * that's the shape the frontend's registry/adapter layer already knows
 * how to consume.
 */
playersRouter.get("/players/:trackerId/statistics", async (req, res) => {
  const trackerId = Number(req.params.trackerId);
  if (!Number.isFinite(trackerId)) {
    return res.status(400).json({ error: "trackerId must be a number" });
  }

  const player = await db.player.findUnique({ where: { trackerId } });
  if (!player) return res.status(404).json({ error: "Player not found" });

  const matchId = typeof req.query.matchId === "string" ? req.query.matchId : undefined;
  const targetMatch = matchId
    ? await db.match.findUnique({ where: { id: matchId } })
    : await getLatestCompleteMatch();

  if (!targetMatch) return res.json({ matchId: null, metrics: {} });

  const stats = await db.playerMatchStatistic.findMany({
    where: { playerId: player.id, matchId: targetMatch.id },
  });

  res.json({ matchId: targetMatch.id, metrics: serializePlayer(player, stats).metrics });
});
