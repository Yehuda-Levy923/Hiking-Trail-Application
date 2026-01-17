import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const passwordService = {
  /**
   * Hash a password with bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  async hash(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Verify a password against a hash
   * @param {string} password - Plain text password
   * @param {string} hash - Bcrypt hash to compare against
   * @returns {Promise<boolean>} - True if password matches
   */
  async verify(password, hash) {
    return bcrypt.compare(password, hash);
  },
};

export default passwordService;
