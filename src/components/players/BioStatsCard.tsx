import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import type { PlayerBio } from "@/types/player";
import { formatCurrencyEur, formatHeight } from "@/lib/format";
import { showMockBadge } from "@/lib/demo-badge";

export function BioStatsCard({ bio }: { bio: PlayerBio }) {
  // Bio isn't part of the metric registry/upload path (see types/player.ts) —
  // it's always generated, so unlike a StatTile fed by getMetric(), there's
  // no per-field source check to make here. Always mock when the toggle is on.
  const mock = showMockBadge(true);

  return (
    <Card className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile label="Height" value={formatHeight(bio.heightCm)} mock={mock} />
      <StatTile
        label="Age"
        value={bio.ageYears != null ? String(bio.ageYears) : null}
        unit={bio.dateOfBirth}
        mock={mock}
      />
      <StatTile label="Foot" value={bio.preferredFoot ?? null} mock={mock} />
      <StatTile label="Country" value={bio.country ?? null} mock={mock} />
      <StatTile label="Value" value={formatCurrencyEur(bio.marketValueEur)} mock={mock} />
      <StatTile
        label="Contract"
        value={bio.contractEndYear != null ? String(bio.contractEndYear) : null}
        mock={mock}
      />
    </Card>
  );
}
