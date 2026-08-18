import { Router } from "express";
import multer from "multer";
import { HttpError } from "../middleware/errorHandler";
import { ingestGameCsv } from "../services/csvIngest";
import { evaluateAwardsForGame } from "../services/awards/engine";
import { prisma } from "../db/client";

export const ingestRouter = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * Accepts one tracker CSV for a completed game (see docs/tracker-schema.md),
 * upserts the game/players/stats, then evaluates awards for that game.
 */
ingestRouter.post("/ingest/game", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError(400, "Missing file upload (field name: 'file')");
    }

    const summary = await ingestGameCsv(req.file.buffer, req.file.originalname);

    const game = await prisma.game.findUniqueOrThrow({ where: { externalId: summary.gameExternalId } });
    const awardsGranted = await evaluateAwardsForGame(game.id);

    res.status(201).json({ ...summary, gameId: game.id, awardsGranted });
  } catch (err) {
    next(err);
  }
});
