import { promises as fs } from "fs";
import path from "path";
import { parseCsv } from "@/data/csv/parser";
import { adaptTrackerRows } from "@/data/adapters/tracker-adapter";
import { withMockData } from "@/data/mock/attach-mock-data";
import { getUploadedMetrics } from "@/lib/upload-store";
import type { Player } from "@/types/player";

const SAMPLE_CSV_PATH = path.join(
  process.cwd(),
  "src/data/csv/sample-match.csv",
);

/**
 * Current implementation reads the tracker's CSV export from disk,
 * layers in anything merged via the CSV upload feature, normalizes it,
 * then fills in every metric/bio field still missing with deterministic
 * mock data. Once a real backend exists, the CSV read becomes a
 * `fetch()` call against the matches API instead — its signature and
 * return type stay the same, so nothing that calls `getPlayers()` needs
 * to change. `withMockData` keeps working exactly the same way: it only
 * ever fills gaps, never overwrites a real field, uploaded or bundled.
 */
export async function getPlayers(): Promise<Player[]> {
  const csv = await fs.readFile(SAMPLE_CSV_PATH, "utf-8");
  const { rows } = parseCsv(csv);
  const trackedPlayers = adaptTrackerRows(rows);

  const withUploads = trackedPlayers.map((player) => ({
    ...player,
    metrics: { ...player.metrics, ...getUploadedMetrics(player.trackerId) },
  }));

  return withUploads.map(withMockData);
}
