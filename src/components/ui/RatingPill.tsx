import { getRatingColor } from "@/lib/rating-color";

/** A single FotMob-style rating pill: red -> amber -> green by value, 0-10. */
export function RatingPill({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "h-5 min-w-6 px-1 text-[11px]" : "h-7 min-w-9 px-1.5 text-sm";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-display font-semibold text-black/85 ${sizeClasses}`}
      style={{ backgroundColor: getRatingColor(rating) }}
    >
      {rating.toFixed(1)}
    </span>
  );
}
