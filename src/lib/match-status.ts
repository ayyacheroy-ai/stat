import type { MatchStatus } from "@/types/match";

/** Human-readable label for a match's processing/lifecycle status. */
const STATUS_LABELS: Record<MatchStatus, string> = {
  PENDING: "Scheduled",
  PROCESSING: "Processing",
  COMPLETE: "Completed",
  FAILED: "Failed",
};

export function getMatchStatusLabel(status: MatchStatus): string {
  return STATUS_LABELS[status];
}
