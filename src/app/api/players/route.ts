import { NextResponse } from "next/server";
import { getPlayers } from "@/lib/data-source";

// Matches the sibling routes/pages that already set this to stop Next
// from statically prerendering a response that must reflect live upload
// state (or, now, a live backend).
export const dynamic = "force-dynamic";

/**
 * Preview of the future API shape (`GET /players`, see architecture brief).
 * The test screen reads `getPlayers()` directly as a Server Component,
 * which is the normal Next.js pattern — this route exists so the same
 * normalized data is reachable over HTTP today, for any other client.
 */
export async function GET() {
  const players = await getPlayers();
  return NextResponse.json({ players });
}
