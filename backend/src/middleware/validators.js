import { param, body, validationResult } from "express-validator";
import { ApiError } from "./errorHandler.js";

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }
  next();
};

// Common validators
export const validators = {
  // Trail ID parameter validator
  trailId: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("Trail ID must be a positive integer")
      .toInt(),
    validate,
  ],

  // Traffic trail ID parameter validator
  trafficTrailId: [
    param("trailId")
      .isInt({ min: 1 })
      .withMessage("Trail ID must be a positive integer")
      .toInt(),
    validate,
  ],

  // Create trail validators
  createTrail: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Trail name is required")
      .isLength({ max: 255 })
      .withMessage("Trail name must be less than 255 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Description must be less than 2000 characters"),
    body("difficulty")
      .optional()
      .isIn(["easy", "moderate", "hard", "expert"])
      .withMessage("Difficulty must be: easy, moderate, hard, or expert"),
    body("length_km")
      .optional()
      .isFloat({ min: 0.1, max: 500 })
      .withMessage("Length must be between 0.1 and 500 km"),
    body("elevation_gain_m")
      .optional()
      .isInt({ min: 0, max: 10000 })
      .withMessage("Elevation gain must be between 0 and 10000 meters"),
    body("estimated_time_hours")
      .optional()
      .isFloat({ min: 0.1, max: 100 })
      .withMessage("Estimated time must be between 0.1 and 100 hours"),
    body("location")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Location must be less than 255 characters"),
    validate,
  ],

  // Update traffic validators
  updateTraffic: [
    param("trailId")
      .isInt({ min: 1 })
      .withMessage("Trail ID must be a positive integer")
      .toInt(),
    body("congestion_level")
      .isInt({ min: 1, max: 5 })
      .withMessage("Congestion level must be between 1 and 5"),
    body("notes")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Notes must be less than 500 characters"),
    validate,
  ],
};
