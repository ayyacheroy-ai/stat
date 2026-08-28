import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { LeaderboardClient } from "@/components/players/LeaderboardClient";

export default async function LeaderboardPage() {
  const players = await getPlayers();

  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">Leaderboard</h1>
      <LeaderboardClient players={players} />
    </Container>
  );
}
