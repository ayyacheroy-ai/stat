import { Router } from "express";
import { healthRouter } from "./health";
import { ingestRouter } from "./ingest";
import { gamesRouter } from "./games";
import { playersRouter } from "./players";
import { awardsRouter } from "./awards";
import { competitionsRouter } from "./competitions";

export const router = Router();

router.use(healthRouter);
router.use("/api", ingestRouter);
router.use("/api", gamesRouter);
router.use("/api", playersRouter);
router.use("/api", awardsRouter);
router.use("/api", competitionsRouter);
