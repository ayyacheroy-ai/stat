import { Router } from "express";
import { prisma } from "../db/client";

export const awardsRouter = Router();

awardsRouter.get("/awards", async (_req, res) => {
  const awards = await prisma.award.findMany({ orderBy: { name: "asc" } });
  res.json(awards);
});

/// Recent-awards feed for a "what just happened" screen.
awardsRouter.get("/awards/feed", async (_req, res) => {
  const feed = await prisma.playerAward.findMany({
    orderBy: { awardedAt: "desc" },
    take: 50,
    include: { award: true, player: true, game: true },
  });
  res.json(feed);
});
