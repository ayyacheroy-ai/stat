import { db } from "../db";

/**
 * The single implicit "current" dataset every player-facing route scopes
 * to when no matchId is given — the most recently dated COMPLETE match.
 * Today there's exactly one match (`match-current`, from the seed), so
 * this is equivalent to "the only match." As more matches accumulate via
 * POST /matches, this keeps GET /players meaning the same thing it means
 * today ("current tracker snapshot") without every caller having to know
 * which match id is current.
 */
export async function getLatestCompleteMatch() {
  return db.match.findFirst({
    where: { status: "COMPLETE" },
    orderBy: { date: "desc" },
  });
}
