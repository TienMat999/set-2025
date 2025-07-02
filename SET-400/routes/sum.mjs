import express from "express";
import { handleSumRequest } from "../modules/requestHandler.mjs";
import { ENDPOINT } from "../modules/constants.mjs";

const router = express.Router();

router.post(ENDPOINT.SUM, handleSumRequest);

export default router;
