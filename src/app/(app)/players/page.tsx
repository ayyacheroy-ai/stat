import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PlayerListItem } from "@/components/players/PlayerListItem";

// Prevents build-time static prerendering — an uploaded CSV must show up
// here without a rebuild. See lib/upload-store.ts.
export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">Players</h1>
      {players.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {players.map((player) => (
            <PlayerListItem key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-muted-foreground">No players tracked yet.</p>
        </Card>
      )}
    </Container>
  );
}
