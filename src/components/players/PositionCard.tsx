import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import type { PlayerPosition } from "@/types/profile";
import { getPositionCoord } from "@/data/mock/position-coords";

/**
 * A small decorative pitch graphic for the position block only — not the
 * canonical reusable Pitch component (that's for the heatmap/shot map,
 * which draw on a full/half pitch rather than this compact card).
 */
export function PositionCard({ position }: { position: PlayerPosition }) {
  const primary = getPositionCoord(position.primary);
  const secondary = position.secondary ? getPositionCoord(position.secondary) : undefined;

  return (
    <Card className="flex items-center gap-5">
      <svg viewBox="0 0 100 140" className="h-32 w-24 shrink-0 rounded-lg border border-border bg-surface-2">
        <rect x="4" y="4" width="92" height="132" rx="4" fill="none" stroke="#3a3a45" strokeWidth={1} />
        <circle cx="50" cy="70" r="14" fill="none" stroke="#3a3a45" strokeWidth={1} />
        {secondary && (
          <circle
            cx={secondary.x}
            cy={(secondary.y / 100) * 140}
            r="5"
            fill="#1b1b22"
            stroke="#9a9aa6"
            strokeWidth={1.5}
          />
        )}
        <circle cx={primary.x} cy={(primary.y / 100) * 140} r="6" fill="#2bd97c" />
      </svg>
      <div className="flex flex-col gap-3">
        <StatTile label="Primary" value={position.primary} />
        {position.secondary && <StatTile label="Secondary" value={position.secondary} />}
      </div>
    </Card>
  );
}
