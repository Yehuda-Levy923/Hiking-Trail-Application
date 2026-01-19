import express from "express";
import { body, param } from "express-validator";
import { usersController } from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validators.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.protect);

// ==========================================
// Profile Routes
// ==========================================

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/profile", usersController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put(
  "/profile",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage("Name must be between 2 and 255 characters"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    validate,
  ],
  usersController.updateProfile
);

// ==========================================
// Favorites Routes
// ==========================================

/**
 * @route   GET /api/users/favorites
 * @desc    Get current user's favorite trails
 * @access  Private
 */
router.get("/favorites", usersController.getFavorites);

/**
 * @route   POST /api/users/favorites/:trailId
 * @desc    Add a trail to favorites
 * @access  Private
 */
router.post(
  "/favorites/:trailId",
  [
    param("trailId")
      .isInt({ min: 1 })
      .withMessage("Trail ID must be a positive integer"),
    validate,
  ],
  usersController.addFavorite
);

/**
 * @route   DELETE /api/users/favorites/:trailId
 * @desc    Remove a trail from favorites
 * @access  Private
 */
router.delete(
  "/favorites/:trailId",
  [
    param("trailId")
      .isInt({ min: 1 })
      .withMessage("Trail ID must be a positive integer"),
    validate,
  ],
  usersController.removeFavorite
);

/**
 * @route   GET /api/users/favorites/:trailId
 * @desc    Check if a trail is favorited
 * @access  Private
 */
router.get(
  "/favorites/:trailId",
  [
    param("trailId")
      .isInt({ min: 1 })
      .withMessage("Trail ID must be a positive integer"),
    validate,
  ],
  usersController.checkFavorite
);

export default router;
