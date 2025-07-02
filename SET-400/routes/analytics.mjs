import express from "express";
import { handleCountRequest, handleHistoryRequest } from "../modules/requestHandler.mjs";
import { ENDPOINT } from "../modules/constants.mjs";

const router = express.Router();

router.get(ENDPOINT.SUM_CALL_COUNT, handleCountRequest);
router.get(ENDPOINT.HISTORY, handleHistoryRequest);

export default router;
