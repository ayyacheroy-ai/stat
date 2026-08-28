import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { PlayerListItem } from "@/components/players/PlayerListItem";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <Container className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-foreground">Players</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {players.map((player) => (
          <PlayerListItem key={player.id} player={player} />
        ))}
      </div>
    </Container>
  );
}
