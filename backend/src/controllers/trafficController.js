import trafficService from "../services/trafficService.js";
import trailsService from "../services/trailsService.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";

export const trafficController = {
  /**
   * GET /api/traffic
   * Get all traffic reports
   */
  getAll: asyncHandler(async (req, res) => {
    const reports = await trafficService.getAll();

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  }),

  /**
   * GET /api/traffic/stats
   * Get traffic statistics
   */
  getStats: asyncHandler(async (req, res) => {
    const stats = await trafficService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  }),

  /**
   * GET /api/traffic/refresh
   * Refresh all traffic data (simulates real-time updates)
   */
  refreshAll: asyncHandler(async (req, res) => {
    const updates = await trafficService.refreshAll();

    res.json({
      success: true,
      message: "Traffic data refreshed",
      count: updates.length,
      data: updates,
    });
  }),

  /**
   * GET /api/traffic/:trailId
   * Get traffic for a specific trail
   */
  getByTrailId: asyncHandler(async (req, res) => {
    const { trailId } = req.params;

    // Check if trail exists
    const trailExists = await trailsService.exists(trailId);
    if (!trailExists) {
      throw ApiError.notFound(`Trail with ID ${trailId} not found`);
    }

    const traffic = await trafficService.getByTrailId(trailId);

    if (!traffic) {
      throw ApiError.notFound(`No traffic report found for trail ${trailId}`);
    }

    // Add human-readable label
    traffic.congestion_label = trafficService.getCongestionLabel(
      traffic.congestion_level
    );

    res.json({
      success: true,
      data: traffic,
    });
  }),

  /**
   * PUT /api/traffic/:trailId
   * Update traffic for a specific trail
   */
  update: asyncHandler(async (req, res) => {
    const { trailId } = req.params;

    // Check if trail exists
    const trailExists = await trailsService.exists(trailId);
    if (!trailExists) {
      throw ApiError.notFound(`Trail with ID ${trailId} not found`);
    }

    const traffic = await trafficService.update(trailId, req.body);

    if (!traffic) {
      throw ApiError.notFound(`No traffic report found for trail ${trailId}`);
    }

    traffic.congestion_label = trafficService.getCongestionLabel(
      traffic.congestion_level
    );

    res.json({
      success: true,
      message: "Traffic updated successfully",
      data: traffic,
    });
  }),
};

export default trafficController;
