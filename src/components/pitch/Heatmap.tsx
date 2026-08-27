import { Card } from "@/components/ui/Card";
import { Pitch } from "./Pitch";
import type { HeatPoint } from "@/types/pitch-viz";

const PITCH_WIDTH = 300;
const PITCH_HEIGHT = 450;

export function Heatmap({ points, touches }: { points: HeatPoint[]; touches?: number }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Heatmap</div>
        {touches != null && (
          <span className="text-xs font-medium text-foreground">Touches: {touches}</span>
        )}
      </div>
      <div className="mx-auto w-full max-w-[220px]" style={{ aspectRatio: `${PITCH_WIDTH} / ${PITCH_HEIGHT}` }}>
        <Pitch orientation="full">
          <defs>
            <radialGradient id="heatBlob" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e5484d" stopOpacity={0.85} />
              <stop offset="55%" stopColor="#f5a524" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#2bd97c" stopOpacity={0} />
            </radialGradient>
          </defs>
          {points.map((point, index) => {
            const radius = 22 + point.intensity * 20;
            return (
              <circle
                key={index}
                cx={(point.x / 100) * PITCH_WIDTH}
                cy={(point.y / 100) * PITCH_HEIGHT}
                r={radius}
                fill="url(#heatBlob)"
                opacity={0.5 + point.intensity * 0.4}
              />
            );
          })}
        </Pitch>
      </div>
    </Card>
  );
}
