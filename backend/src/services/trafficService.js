import pool from "../config/db.js";

export const trafficService = {
  /**
   * Get traffic report for a specific trail
   */
  async getByTrailId(trailId) {
    const result = await pool.query(
      `SELECT 
        tr.*,
        t.name as trail_name
      FROM traffic_reports tr
      JOIN trails t ON tr.trail_id = t.id
      WHERE tr.trail_id = $1`,
      [trailId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get all traffic reports
   */
  async getAll() {
    const result = await pool.query(
      `SELECT 
        tr.*,
        t.name as trail_name,
        t.location
      FROM traffic_reports tr
      JOIN trails t ON tr.trail_id = t.id
      ORDER BY tr.congestion_level DESC`
    );
    return result.rows;
  },

  /**
   * Update traffic for a specific trail
   */
  async update(trailId, { congestion_level, notes }) {
    const result = await pool.query(
      `UPDATE traffic_reports 
      SET 
        congestion_level = $1,
        notes = COALESCE($2, notes),
        reporter_count = reporter_count + 1
      WHERE trail_id = $3
      RETURNING *`,
      [congestion_level, notes, trailId]
    );
    return result.rows[0] || null;
  },

  /**
   * Refresh all traffic data with simulated values
   * In production, this would aggregate real-time data
   */
  async refreshAll() {
    const trails = await pool.query("SELECT id FROM trails");

    const updates = [];
    for (const trail of trails.rows) {
      // Simulate traffic levels (1-5)
      const randomLevel = Math.floor(Math.random() * 5) + 1;

      const result = await pool.query(
        `UPDATE traffic_reports 
        SET congestion_level = $1, updated_at = NOW()
        WHERE trail_id = $2
        RETURNING *`,
        [randomLevel, trail.id]
      );

      if (result.rows[0]) {
        updates.push(result.rows[0]);
      }
    }

    return updates;
  },

  /**
   * Get traffic summary statistics
   */
  async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_trails,
        AVG(congestion_level)::numeric(3,2) as avg_congestion,
        COUNT(*) FILTER (WHERE congestion_level <= 2) as low_traffic,
        COUNT(*) FILTER (WHERE congestion_level = 3) as moderate_traffic,
        COUNT(*) FILTER (WHERE congestion_level >= 4) as high_traffic
      FROM traffic_reports
    `);
    return result.rows[0];
  },

  /**
   * Get congestion level label
   */
  getCongestionLabel(level) {
    const labels = {
      1: "Very Low",
      2: "Low",
      3: "Moderate",
      4: "High",
      5: "Very High",
    };
    return labels[level] || "Unknown";
  },
};

export default trafficService;
