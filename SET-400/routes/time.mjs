import express from "express";
import { handleTimeRequest } from "../modules/requestHandler.mjs";
import { ENDPOINT } from "../modules/constants.mjs";

const router = express.Router();

router.get(ENDPOINT.CURRENT_TIME, handleTimeRequest);

export default router;
