import { promises as fs } from "fs";
import path from "path";
import { parseCsv } from "@/data/csv/parser";
import { adaptTrackerRows } from "@/data/adapters/tracker-adapter";
import type { Player } from "@/types/player";

const SAMPLE_CSV_PATH = path.join(
  process.cwd(),
  "src/data/csv/sample-match.csv",
);

/**
 * Current implementation reads the tracker's CSV export from disk and
 * normalizes it. Once a real backend exists, this function's body becomes
 * a `fetch()` call against the matches API instead — its signature and
 * return type stay the same, so nothing that calls `getPlayers()` needs
 * to change.
 */
export async function getPlayers(): Promise<Player[]> {
  const csv = await fs.readFile(SAMPLE_CSV_PATH, "utf-8");
  const { rows } = parseCsv(csv);
  return adaptTrackerRows(rows);
}
