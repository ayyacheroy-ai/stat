import { promises as fs } from "fs";
import path from "path";
import { parseCsv } from "@/data/csv/parser";
import { adaptTrackerRows } from "@/data/adapters/tracker-adapter";
import { fetchPlayersFromApi } from "@/data/adapters/api-adapter";
import { withMockData } from "@/data/mock/attach-mock-data";
import { getUploadedMetrics } from "@/lib/upload-store";
import type { Player } from "@/types/player";

const SAMPLE_CSV_PATH = path.join(
  process.cwd(),
  "src/data/csv/sample-match.csv",
);

/**
 * This is the frontend/backend boundary (see /backend for the real
 * service). When `PITCHLINE_API_URL` is unset — the default, requiring
 * zero configuration — this reads the bundled CSV exactly as before,
 * with in-memory upload overrides layered in. When it's set, real player
 * data comes from the backend's `/players` instead, which already
 * persists uploads itself (see data/adapters/api-adapter.ts), so the
 * in-memory upload-store layer is skipped in that mode. Either way,
 * `withMockData` runs last and works identically: it only ever fills
 * gaps, never overwrites a real field, uploaded or bundled.
 */
export async function getPlayers(): Promise<Player[]> {
  const trackedPlayers = process.env.PITCHLINE_API_URL
    ? await fetchPlayersFromApi(process.env.PITCHLINE_API_URL)
    : await getPlayersFromCsv();

  return trackedPlayers.map(withMockData);
}

async function getPlayersFromCsv(): Promise<Player[]> {
  const csv = await fs.readFile(SAMPLE_CSV_PATH, "utf-8");
  const { rows } = parseCsv(csv);
  const trackedPlayers = adaptTrackerRows(rows);

  return trackedPlayers.map((player) => ({
    ...player,
    metrics: { ...player.metrics, ...getUploadedMetrics(player.trackerId) },
  }));
}
