import type { Player } from "@/types/player";
import type { MetricBag } from "@/types/metrics";

interface ApiPlayerDto {
  trackerId: number;
  teamId: number;
  name: string;
  metrics: MetricBag;
  bio: Player["bio"];
}

/**
 * Reads real players from the Pitchline backend (see /backend) instead of
 * the bundled CSV. This is the one function `getPlayers()` swaps in when
 * `PITCHLINE_API_URL` is set — everything downstream (upload merge is
 * skipped since the backend already persists uploads, then
 * `withMockData`) stays identical, because this returns the exact same
 * `Player[]` shape the CSV adapter does. The backend's response already
 * carries a resolved `name` and an empty-if-unknown `bio`, so this is a
 * near-passthrough: the only normalization done here is re-deriving the
 * `id` field, since `tracker-${trackerId}` is a frontend routing
 * convention (see data/adapters/tracker-adapter.ts), not something the
 * backend should need to know about.
 */
export async function fetchPlayersFromApi(apiBaseUrl: string): Promise<Player[]> {
  const res = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/players`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Pitchline API responded ${res.status} fetching /players`);
  }

  const { players } = (await res.json()) as { players: ApiPlayerDto[] };

  return players.map((player) => ({
    id: `tracker-${player.trackerId}`,
    trackerId: player.trackerId,
    teamId: player.teamId,
    name: player.name,
    metrics: player.metrics,
    bio: player.bio,
  }));
}

export interface ApiUploadResult {
  matchedCount: number;
  unmatchedTrackerIds: number[];
  totalRows: number;
}

/** Forwards raw uploaded CSV text to the backend's POST /uploads, same contract as the frontend's own POST /api/upload. */
export async function postUploadToApi(
  apiBaseUrl: string,
  csvText: string,
): Promise<{ status: number; body: ApiUploadResult | { error: string } }> {
  const res = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "text/csv" },
    body: csvText,
  });

  const body = (await res.json()) as ApiUploadResult | { error: string };
  return { status: res.status, body };
}
