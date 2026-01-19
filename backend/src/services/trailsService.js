import pool from "../config/db.js";

export const trailsService = {
  /**
   * Get all trails with optional filtering, search, and pagination
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options (page, limit)
   * @returns {Promise<{data: Array, total: number, page: number, totalPages: number}>}
   */
  async getAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    // Build base query for both data and count
    let baseConditions = "";
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Search by name or location
    if (filters.search) {
      conditions.push(`(t.name ILIKE $${paramIndex} OR t.location ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.difficulty) {
      conditions.push(`t.difficulty = $${paramIndex++}`);
      params.push(filters.difficulty);
    }

    if (filters.maxLength) {
      conditions.push(`t.length_km <= $${paramIndex++}`);
      params.push(filters.maxLength);
    }

    if (filters.location) {
      conditions.push(`t.location ILIKE $${paramIndex++}`);
      params.push(`%${filters.location}%`);
    }

    if (conditions.length > 0) {
      baseConditions = ` WHERE ${conditions.join(" AND ")}`;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM trails t${baseConditions}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated data
    let dataQuery = `
      SELECT
        t.*,
        tr.congestion_level,
        tr.updated_at as traffic_updated_at
      FROM trails t
      LEFT JOIN traffic_reports tr ON t.id = tr.trail_id
      ${baseConditions}
      ORDER BY t.id
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    const dataParams = [...params, limit, offset];
    const result = await pool.query(dataQuery, dataParams);

    return {
      data: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get a single trail by ID
   */
  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM trails WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Get trail with its current traffic info
   */
  async getWithTraffic(id) {
    const result = await pool.query(
      `SELECT 
        t.*,
        tr.congestion_level,
        tr.reporter_count,
        tr.notes as traffic_notes,
        tr.updated_at as traffic_updated_at
      FROM trails t
      LEFT JOIN traffic_reports tr ON t.id = tr.trail_id
      WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Create a new trail
   */
  async create(trailData) {
    const {
      name,
      description,
      difficulty,
      length_km,
      elevation_gain_m,
      estimated_time_hours,
      location,
      image_url,
    } = trailData;

    const result = await pool.query(
      `INSERT INTO trails (
        name, description, difficulty, length_km, 
        elevation_gain_m, estimated_time_hours, location, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        name,
        description,
        difficulty,
        length_km,
        elevation_gain_m,
        estimated_time_hours,
        location,
        image_url,
      ]
    );

    // Create initial traffic report
    await pool.query(
      `INSERT INTO traffic_reports (trail_id, congestion_level) VALUES ($1, 1)`,
      [result.rows[0].id]
    );

    return result.rows[0];
  },

  /**
   * Update a trail
   */
  async update(id, trailData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      "name",
      "description",
      "difficulty",
      "length_km",
      "elevation_gain_m",
      "estimated_time_hours",
      "location",
      "image_url",
    ];

    for (const field of allowedFields) {
      if (trailData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(trailData[field]);
      }
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE trails SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  /**
   * Delete a trail
   */
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM trails WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Check if trail exists
   */
  async exists(id) {
    const result = await pool.query(
      `SELECT 1 FROM trails WHERE id = $1`,
      [id]
    );
    return result.rows.length > 0;
  },
};

export default trailsService;
