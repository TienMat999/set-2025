import express from "express";
import { handleTimeRequest } from "../modules/requestHandler.mjs";

const router = express.Router();

router.get("/current-time", handleTimeRequest);

export default router;
