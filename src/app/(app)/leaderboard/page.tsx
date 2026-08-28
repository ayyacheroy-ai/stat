import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { LeaderboardClient } from "@/components/players/LeaderboardClient";

// Prevents build-time static prerendering — an uploaded CSV must show up
// here without a rebuild. See lib/upload-store.ts.
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const players = await getPlayers();

  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">Leaderboard</h1>
      <LeaderboardClient players={players} />
    </Container>
  );
}
