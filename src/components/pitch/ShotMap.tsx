"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { FilterChips } from "@/components/ui/FilterChips";
import { Pitch } from "./Pitch";
import type { ShotEvent, ShotOutcome, ShotZone } from "@/types/pitch-viz";

const PITCH_WIDTH = 300;
const PITCH_HEIGHT = 260;

const OUTCOME_COLOR: Record<ShotOutcome, string> = {
  goal: "#2bd97c",
  on_target: "#f5a524",
  off_target: "#5a5a66",
  blocked: "#e5484d",
};

const OUTCOME_LABEL: Record<ShotOutcome, string> = {
  goal: "Goal",
  on_target: "On Target",
  off_target: "Off Target",
  blocked: "Blocked",
};

type ResultFilter = "all" | ShotOutcome;
type ZoneFilter = "all" | ShotZone;

const RESULT_OPTIONS: ReadonlyArray<{ value: ResultFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "goal", label: "Goals" },
  { value: "on_target", label: "On Target" },
  { value: "off_target", label: "Off Target" },
  { value: "blocked", label: "Blocked" },
];

const ZONE_OPTIONS: ReadonlyArray<{ value: ZoneFilter; label: string }> = [
  { value: "all", label: "All Zones" },
  { value: "inside_box", label: "Inside Box" },
  { value: "outside_box", label: "Outside Box" },
];

export function ShotMap({ shots }: { shots: ShotEvent[] }) {
  const [result, setResult] = useState<ResultFilter>("all");
  const [zone, setZone] = useState<ZoneFilter>("all");

  const filtered = useMemo(
    () =>
      shots.filter(
        (shot) => (result === "all" || shot.outcome === result) && (zone === "all" || shot.zone === zone),
      ),
    [shots, result, zone],
  );

  const goals = shots.filter((shot) => shot.outcome === "goal").length;
  const onTargetCount = shots.filter((shot) => shot.outcome === "goal" || shot.outcome === "on_target").length;
  const onTargetPercent = shots.length ? Math.round((onTargetCount / shots.length) * 100) : 0;
  const totalXg = shots.reduce((sum, shot) => sum + shot.xg, 0);

  if (shots.length === 0) {
    return (
      <Card className="flex flex-col gap-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Shot Map</div>
        <p className="text-sm text-muted-foreground">No shots recorded yet.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Shot Map</div>

      <div className="grid grid-cols-4 gap-3">
        <StatTile label="Shots" value={String(shots.length)} />
        <StatTile label="Goals" value={String(goals)} />
        <StatTile label="On Target" value={`${onTargetPercent}%`} />
        <StatTile label="xG" value={totalXg.toFixed(2)} />
      </div>

      <div className="flex flex-col gap-2">
        <FilterChips options={RESULT_OPTIONS} value={result} onChange={setResult} />
        <FilterChips options={ZONE_OPTIONS} value={zone} onChange={setZone} />
      </div>

      <div className="mx-auto w-full max-w-xs" style={{ aspectRatio: `${PITCH_WIDTH} / ${PITCH_HEIGHT}` }}>
        <Pitch orientation="attacking-half">
          {filtered.map((shot) => (
            <circle
              key={shot.id}
              cx={(shot.x / 100) * PITCH_WIDTH}
              cy={(shot.y / 100) * PITCH_HEIGHT}
              r={4 + shot.xg * 10}
              fill={OUTCOME_COLOR[shot.outcome]}
              fillOpacity={0.85}
              stroke="#0a0a0d"
              strokeWidth={1}
            />
          ))}
        </Pitch>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        {(Object.entries(OUTCOME_COLOR) as [ShotOutcome, string][]).map(([outcome, color]) => (
          <span key={outcome} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {OUTCOME_LABEL[outcome]}
          </span>
        ))}
      </div>
    </Card>
  );
}
