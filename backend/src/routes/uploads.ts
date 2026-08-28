import { Router } from "express";
import { db } from "../db";
import { parseCsv } from "../lib/csv";
import { extractTrackerMetrics, toNumberOrDefault } from "../lib/metric-columns";
import { getLatestCompleteMatch } from "../lib/latest-match";

export const uploadsRouter = Router();

/**
 * POST /uploads — the persisted replacement for the frontend's in-memory
 * upload-store.ts. Same contract as today's POST /api/upload: raw CSV
 * text in, { matchedCount, unmatchedTrackerIds, totalRows } out. A
 * recognized column for a known tracker_id is upserted as a real
 * PlayerMatchStatistic row against the latest complete match — durably,
 * unlike the frontend's globalThis Map, which the frontend's own code
 * comments already flag as unsafe across Vercel serverless instances.
 */
uploadsRouter.post("/uploads", async (req, res) => {
  const csvText = typeof req.body === "string" ? req.body : "";

  if (!csvText.trim()) {
    return res.status(400).json({ error: "The uploaded file is empty." });
  }

  const { headers, rows } = parseCsv(csvText);
  if (headers.length === 0 || rows.length === 0) {
    return res.status(400).json({ error: "That file doesn't look like a valid CSV — no rows were found." });
  }

  const targetMatch = await getLatestCompleteMatch();
  if (!targetMatch) {
    return res.status(409).json({ error: "No complete match exists yet to attach uploaded statistics to." });
  }

  const knownPlayers = await db.player.findMany();
  const trackerIdToPlayerId = new Map(knownPlayers.map((p) => [p.trackerId, p.id]));

  let matchedCount = 0;
  const unmatchedTrackerIds: number[] = [];

  for (const row of rows) {
    const trackerId = toNumberOrDefault(row.tracker_id, NaN);
    if (!Number.isFinite(trackerId)) continue;

    const metrics = extractTrackerMetrics(row);
    if (metrics.length === 0) continue;

    const playerId = trackerIdToPlayerId.get(trackerId);
    if (!playerId) {
      unmatchedTrackerIds.push(trackerId);
      continue;
    }

    for (const { metricKey, value } of metrics) {
      await db.playerMatchStatistic.upsert({
        where: { playerId_matchId_metricKey: { playerId, matchId: targetMatch.id, metricKey } },
        update: { value, source: "TRACKER" },
        create: { playerId, matchId: targetMatch.id, metricKey, value, source: "TRACKER" },
      });
    }
    matchedCount++;
  }

  res.json({ matchedCount, unmatchedTrackerIds, totalRows: rows.length });
});
