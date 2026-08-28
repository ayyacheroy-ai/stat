import { NextResponse } from "next/server";
import { parseCsv } from "@/data/csv/parser";
import { extractMetricsFromRow } from "@/data/adapters/csv-row-adapter";
import { applyUploadedMetrics } from "@/lib/upload-store";
import { getPlayers } from "@/lib/data-source";

export const dynamic = "force-dynamic";

/**
 * Merges an uploaded CSV's recognized columns onto matching players by
 * tracker_id, using the exact same registry-driven extractor the bundled
 * CSV adapter uses (see data/adapters/csv-row-adapter.ts) — so a metric
 * that arrives here is tagged source: 'tracker' and immediately looks
 * identical to any other real stat. Never throws on bad input: malformed
 * rows and unknown tracker_ids are just counted and reported back, not
 * merged.
 */
export async function POST(request: Request) {
  const csvText = await request.text();

  if (!csvText.trim()) {
    return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
  }

  const { headers, rows } = parseCsv(csvText);

  if (headers.length === 0 || rows.length === 0) {
    return NextResponse.json(
      { error: "That file doesn't look like a valid CSV — no rows were found." },
      { status: 400 },
    );
  }

  const players = await getPlayers();
  const knownTrackerIds = new Set(players.map((player) => player.trackerId));

  let matchedCount = 0;
  const unmatchedTrackerIds: number[] = [];

  for (const row of rows) {
    const trackerId = Number(row.tracker_id);
    if (!Number.isFinite(trackerId)) continue;

    const metrics = extractMetricsFromRow(row);
    if (Object.keys(metrics).length === 0) continue;

    if (knownTrackerIds.has(trackerId)) {
      applyUploadedMetrics(trackerId, metrics);
      matchedCount++;
    } else {
      unmatchedTrackerIds.push(trackerId);
    }
  }

  return NextResponse.json({ matchedCount, unmatchedTrackerIds, totalRows: rows.length });
}
