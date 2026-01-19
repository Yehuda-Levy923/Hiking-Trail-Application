import trailsService from "../services/trailsService.js";
import favoritesService from "../services/favoritesService.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";

export const trailsController = {
  /**
   * GET /api/trails
   * Get all trails with optional filtering, search, and pagination
   */
  getAll: asyncHandler(async (req, res) => {
    const { difficulty, maxLength, location, search, page, limit } = req.query;

    // Parse and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const result = await trailsService.getAll(
      {
        difficulty,
        maxLength: maxLength ? parseFloat(maxLength) : undefined,
        location,
        search,
      },
      {
        page: pageNum,
        limit: limitNum,
      }
    );

    // If user is authenticated, add favorite status to each trail
    let trailsWithFavorites = result.data;
    if (req.user) {
      const trailIds = result.data.map((trail) => trail.id);
      const favoriteSet = await favoritesService.getFavoriteStatuses(req.user.id, trailIds);
      trailsWithFavorites = result.data.map((trail) => ({
        ...trail,
        is_favorite: favoriteSet.has(trail.id),
      }));
    }

    res.json({
      success: true,
      count: trailsWithFavorites.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: trailsWithFavorites,
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

    // If user is authenticated, add favorite status
    let trailData = trail;
    if (req.user) {
      const isFavorite = await favoritesService.isFavorited(req.user.id, trail.id);
      trailData = { ...trail, is_favorite: isFavorite };
    }

    res.json({
      success: true,
      data: trailData,
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
