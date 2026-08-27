import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PitchProps {
  /** 'full' for the heatmap (both halves); 'attacking-half' for the shot map (goal at top). */
  orientation?: "full" | "attacking-half";
  children?: ReactNode;
  className?: string;
}

const WIDTH = 300;
const FULL_HEIGHT = 450;
const HALF_HEIGHT = 260;

const LINE_COLOR = "#2f6b45";
const FILL_COLOR = "#0d3a22";

/**
 * A reusable, decorative SVG pitch other visualizations draw on top of via
 * `children`, in the same 0-{WIDTH}/0-{height} coordinate space. Not
 * physically precise — the brief only asks for "credible and premium,"
 * not surveyed proportions. The penalty-box geometry here (x 70-230,
 * y 6-86) is also what data/mock/generate-shot-map.ts uses to classify a
 * shot as inside vs outside the box, so keep them in sync if either changes.
 */
export function Pitch({ orientation = "full", children, className }: PitchProps) {
  const height = orientation === "full" ? FULL_HEIGHT : HALF_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className={cn("h-full w-full rounded-lg", className)}
      role="img"
      aria-label="Football pitch"
    >
      <rect x={0} y={0} width={WIDTH} height={height} fill={FILL_COLOR} />

      <g stroke={LINE_COLOR} strokeWidth={2} fill="none">
        <rect x={6} y={6} width={WIDTH - 12} height={height - 12} />

        {orientation === "full" && (
          <>
            <line x1={6} y1={height / 2} x2={WIDTH - 6} y2={height / 2} />
            <circle cx={WIDTH / 2} cy={height / 2} r={40} />
          </>
        )}

        {/* Top penalty box, six-yard box, and penalty arc — the "attacking" end for the shot map */}
        <rect x={70} y={6} width={160} height={80} />
        <rect x={115} y={6} width={70} height={30} />
        <path d="M 108 86 A 42 42 0 0 0 192 86" />

        {orientation === "full" && (
          <>
            <rect x={70} y={height - 86} width={160} height={80} />
            <rect x={115} y={height - 36} width={70} height={30} />
            <path d={`M 108 ${height - 86} A 42 42 0 0 1 192 ${height - 86}`} />
          </>
        )}
      </g>

      <g fill={LINE_COLOR} stroke="none">
        <rect x={130} y={0} width={40} height={6} />
        {orientation === "full" && <rect x={130} y={height - 6} width={40} height={6} />}
        <circle cx={WIDTH / 2} cy={70} r={1.6} />
        {orientation === "full" && (
          <>
            <circle cx={WIDTH / 2} cy={height / 2} r={1.6} />
            <circle cx={WIDTH / 2} cy={height - 70} r={1.6} />
          </>
        )}
      </g>

      {children}
    </svg>
  );
}
