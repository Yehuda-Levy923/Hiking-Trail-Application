import crypto from "crypto";
import pool from "../config/db.js";

export const passwordResetService = {
  /**
   * Generate a secure random token
   * @returns {string} - Random hex token
   */
  generateToken() {
    return crypto.randomBytes(32).toString("hex");
  },

  /**
   * Create a password reset token for a user
   * @param {number} userId - User ID
   * @returns {Promise<string>} - The reset token
   */
  async createToken(userId) {
    // Invalidate any existing tokens for this user
    await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1 AND used = FALSE`,
      [userId]
    );

    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );

    return token;
  },

  /**
   * Validate a password reset token
   * @param {string} token - The reset token
   * @returns {Promise<Object|null>} - Token record with user_id if valid, null if invalid
   */
  async validateToken(token) {
    const result = await pool.query(
      `SELECT id, user_id, expires_at, used
       FROM password_reset_tokens
       WHERE token = $1`,
      [token]
    );

    const tokenRecord = result.rows[0];

    if (!tokenRecord) {
      return null;
    }

    // Check if token is used
    if (tokenRecord.used) {
      return null;
    }

    // Check if token is expired
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return null;
    }

    return tokenRecord;
  },

  /**
   * Mark a token as used
   * @param {string} token - The reset token
   * @returns {Promise<boolean>} - True if marked as used
   */
  async markTokenUsed(token) {
    const result = await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE token = $1`,
      [token]
    );
    return result.rowCount > 0;
  },

  /**
   * Clean up expired tokens (can be run periodically)
   * @returns {Promise<number>} - Number of deleted tokens
   */
  async cleanupExpiredTokens() {
    const result = await pool.query(
      `DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE`
    );
    return result.rowCount;
  },
};

export default passwordResetService;
