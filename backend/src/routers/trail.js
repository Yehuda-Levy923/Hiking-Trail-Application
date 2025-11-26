import express from "express";
import { getTrailDetails } from "../controllers/trailsController.js";

const router = express.Router();

router.get("/:id", getTrailDetails);

export default router;
