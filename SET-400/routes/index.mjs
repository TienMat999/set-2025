import express from "express";
import sumRouter from "./sum.mjs";
import analyticsRouter from "./analytics.mjs";
import timeRouter from "./time.mjs";
import { HTTP_STATUS } from "../modules/constants.mjs";

const router = express.Router();

router.use(sumRouter);
router.use(analyticsRouter);
router.use(timeRouter);

router.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Not found" });
});

export default router;
