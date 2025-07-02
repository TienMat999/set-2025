import express from "express";
import { handleSumRequest } from "../modules/requestHandler.mjs";

const router = express.Router();

router.post("/sum", handleSumRequest);

export default router;
