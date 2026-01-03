import trailsService from "../services/trailsService.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";

export const trailsController = {
  /**
   * GET /api/trails
   * Get all trails with optional filtering
   */
  getAll: asyncHandler(async (req, res) => {
    const { difficulty, maxLength, location } = req.query;

    const trails = await trailsService.getAll({
      difficulty,
      maxLength: maxLength ? parseFloat(maxLength) : undefined,
      location,
    });

    res.json({
      success: true,
      count: trails.length,
      data: trails,
    });
  }),

  /**
   * GET /api/trails/:id
   * Get a single trail by ID with traffic info
   */
  getById: asyncHandler(async (req, res) => {
    const trail = await trailsService.getWithTraffic(req.params.id);

    if (!trail) {
      throw ApiError.notFound(`Trail with ID ${req.params.id} not found`);
    }

    res.json({
      success: true,
      data: trail,
    });
  }),

  /**
   * POST /api/trails
   * Create a new trail
   */
  create: asyncHandler(async (req, res) => {
    const trail = await trailsService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Trail created successfully",
      data: trail,
    });
  }),

  /**
   * PUT /api/trails/:id
   * Update a trail
   */
  update: asyncHandler(async (req, res) => {
    const exists = await trailsService.exists(req.params.id);
    if (!exists) {
      throw ApiError.notFound(`Trail with ID ${req.params.id} not found`);
    }

    const trail = await trailsService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: "Trail updated successfully",
      data: trail,
    });
  }),

  /**
   * DELETE /api/trails/:id
   * Delete a trail
   */
  delete: asyncHandler(async (req, res) => {
    const trail = await trailsService.delete(req.params.id);

    if (!trail) {
      throw ApiError.notFound(`Trail with ID ${req.params.id} not found`);
    }

    res.json({
      success: true,
      message: "Trail deleted successfully",
      data: trail,
    });
  }),
};

export default trailsController;
