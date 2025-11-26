import express from "express";
import { getTraffic, refreshTraffic } from "../controllers/trafficController.js";

const router = express.Router();

router.get("/:trailId", getTraffic);
router.get("/refresh/all", refreshTraffic);

export default router;
