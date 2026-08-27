import { NextResponse } from "next/server";
import { getPlayers } from "@/lib/data-source";

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
