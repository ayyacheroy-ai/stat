import { getPlayers } from "@/lib/data-source";
import { Container } from "@/components/ui/Container";
import { UploadClient } from "@/components/upload/UploadClient";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const players = await getPlayers();
  const knownTrackerIds = players.map((player) => player.trackerId);

  return (
    <Container className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl text-foreground">Upload Match Data</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop in a CSV to merge real stats onto matching players by tracker_id. The bundled demo
          data keeps working either way.
        </p>
      </div>
      <UploadClient knownTrackerIds={knownTrackerIds} />
    </Container>
  );
}
