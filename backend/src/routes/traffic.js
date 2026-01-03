import express from "express";
import trafficController from "../controllers/trafficController.js";
import { validators } from "../middleware/validators.js";

const router = express.Router();

/**
 * @route   GET /api/traffic
 * @desc    Get all traffic reports
 * @access  Public
 */
router.get("/", trafficController.getAll);

/**
 * @route   GET /api/traffic/stats
 * @desc    Get traffic statistics
 * @access  Public
 * 
 * NOTE: Static routes MUST come before parameterized routes!
 */
router.get("/stats", trafficController.getStats);

/**
 * @route   GET /api/traffic/refresh
 * @desc    Refresh all traffic data (simulates real-time updates)
 * @access  Public
 */
router.get("/refresh", trafficController.refreshAll);

/**
 * @route   GET /api/traffic/:trailId
 * @desc    Get traffic for a specific trail
 * @access  Public
 */
router.get("/:trailId", validators.trafficTrailId, trafficController.getByTrailId);

/**
 * @route   PUT /api/traffic/:trailId
 * @desc    Update traffic for a specific trail
 * @access  Public (would be protected in production)
 */
router.put("/:trailId", validators.updateTraffic, trafficController.update);

export default router;
