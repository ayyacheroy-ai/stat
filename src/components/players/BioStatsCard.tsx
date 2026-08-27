import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import type { PlayerBio } from "@/types/player";
import { formatCurrencyEur, formatHeight } from "@/lib/format";

export function BioStatsCard({ bio }: { bio: PlayerBio }) {
  return (
    <Card className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile label="Height" value={formatHeight(bio.heightCm)} />
      <StatTile
        label="Age"
        value={bio.ageYears != null ? String(bio.ageYears) : null}
        unit={bio.dateOfBirth}
      />
      <StatTile label="Foot" value={bio.preferredFoot ?? null} />
      <StatTile label="Country" value={bio.country ?? null} />
      <StatTile label="Value" value={formatCurrencyEur(bio.marketValueEur)} />
      <StatTile
        label="Contract"
        value={bio.contractEndYear != null ? String(bio.contractEndYear) : null}
      />
    </Card>
  );
}
