import pool from "../config/db.js";

export const favoritesService = {
  /**
   * Get all favorite trails for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} - Array of favorite trails with details
   */
  async getUserFavorites(userId) {
    const result = await pool.query(
      `SELECT t.id, t.name, t.description, t.difficulty, t.length_km,
              t.elevation_gain_m, t.estimated_time_hours, t.location, t.image_url,
              uf.created_at as favorited_at,
              tr.congestion_level
       FROM user_favorites uf
       JOIN trails t ON uf.trail_id = t.id
       LEFT JOIN traffic_reports tr ON t.id = tr.trail_id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Check if a trail is favorited by a user
   * @param {number} userId - User ID
   * @param {number} trailId - Trail ID
   * @returns {Promise<boolean>} - True if favorited
   */
  async isFavorited(userId, trailId) {
    const result = await pool.query(
      `SELECT 1 FROM user_favorites WHERE user_id = $1 AND trail_id = $2`,
      [userId, trailId]
    );
    return result.rows.length > 0;
  },

  /**
   * Get favorite status for multiple trails
   * @param {number} userId - User ID
   * @param {Array<number>} trailIds - Array of trail IDs
   * @returns {Promise<Set<number>>} - Set of favorited trail IDs
   */
  async getFavoriteStatuses(userId, trailIds) {
    if (!trailIds || trailIds.length === 0) {
      return new Set();
    }

    const result = await pool.query(
      `SELECT trail_id FROM user_favorites
       WHERE user_id = $1 AND trail_id = ANY($2)`,
      [userId, trailIds]
    );

    return new Set(result.rows.map((row) => row.trail_id));
  },

  /**
   * Add a trail to user's favorites
   * @param {number} userId - User ID
   * @param {number} trailId - Trail ID
   * @returns {Promise<Object>} - Created favorite record
   */
  async addFavorite(userId, trailId) {
    const result = await pool.query(
      `INSERT INTO user_favorites (user_id, trail_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, trail_id) DO NOTHING
       RETURNING id, user_id, trail_id, created_at`,
      [userId, trailId]
    );
    return result.rows[0] || { user_id: userId, trail_id: trailId };
  },

  /**
   * Remove a trail from user's favorites
   * @param {number} userId - User ID
   * @param {number} trailId - Trail ID
   * @returns {Promise<boolean>} - True if removed
   */
  async removeFavorite(userId, trailId) {
    const result = await pool.query(
      `DELETE FROM user_favorites WHERE user_id = $1 AND trail_id = $2`,
      [userId, trailId]
    );
    return result.rowCount > 0;
  },

  /**
   * Get count of favorites for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} - Count of favorites
   */
  async getFavoriteCount(userId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM user_favorites WHERE user_id = $1`,
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  },
};

export default favoritesService;
