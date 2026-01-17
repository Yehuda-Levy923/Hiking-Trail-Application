import pool from "../config/db.js";
import passwordService from "./passwordService.js";

export const authService = {
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null
   */
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT id, email, password_hash, name, created_at, updated_at
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  /**
   * Find a user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} - User object (without password) or null
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT id, email, name, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Create a new user
   * @param {Object} userData - User data with email, password, name
   * @returns {Promise<Object>} - Created user (without password)
   */
  async create(userData) {
    const { email, password, name } = userData;

    // Hash the password
    const passwordHash = await passwordService.hash(password);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at, updated_at`,
      [email.toLowerCase(), passwordHash, name]
    );

    return result.rows[0];
  },

  /**
   * Verify user credentials
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object|null>} - User object (without password) if valid, null if invalid
   */
  async verifyCredentials(email, password) {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await passwordService.verify(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - True if email exists
   */
  async emailExists(email) {
    const result = await pool.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows.length > 0;
  },
};

export default authService;
