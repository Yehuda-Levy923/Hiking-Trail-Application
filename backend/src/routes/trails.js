import express from "express";
import trailsController from "../controllers/trailsController.js";
import { validators } from "../middleware/validators.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/trails
 * @desc    Get all trails (with optional filtering and pagination)
 * @query   difficulty, maxLength, location, search, page, limit
 * @access  Public (optionally authenticated for favorites)
 */
router.get("/", authMiddleware.optionalAuth, trailsController.getAll);

/**
 * @route   GET /api/trails/:id
 * @desc    Get a single trail by ID
 * @access  Public (optionally authenticated for favorites)
 */
router.get("/:id", authMiddleware.optionalAuth, validators.trailId, trailsController.getById);

/**
 * @route   POST /api/trails
 * @desc    Create a new trail
 * @access  Public (would be protected in production)
 */
router.post("/", validators.createTrail, trailsController.create);

/**
 * @route   PUT /api/trails/:id
 * @desc    Update a trail
 * @access  Public (would be protected in production)
 */
router.put("/:id", validators.trailId, trailsController.update);

/**
 * @route   DELETE /api/trails/:id
 * @desc    Delete a trail
 * @access  Public (would be protected in production)
 */
router.delete("/:id", validators.trailId, trailsController.delete);

export default router;
