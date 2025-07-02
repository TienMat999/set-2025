import express from "express";
import { handleCountRequest, handleHistoryRequest } from "../modules/requestHandler.mjs";

const router = express.Router();

router.get("/sum-call-count", handleCountRequest);
router.get("/history", handleHistoryRequest);

export default router;
