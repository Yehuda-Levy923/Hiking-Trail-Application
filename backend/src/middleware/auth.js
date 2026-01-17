import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "24h";

export const authMiddleware = {
  /**
   * Generate a JWT token for a user
   * @param {Object} user - User object with id, email, name
   * @returns {string} - JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  /**
   * Verify a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} - Decoded token payload
   */
  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  },

  /**
   * Middleware to protect routes - requires valid JWT
   */
  protect(req, res, next) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw ApiError.badRequest("No token provided. Authorization header must be: Bearer <token>");
      }

      const token = authHeader.split(" ")[1];

      // Verify token
      const decoded = authMiddleware.verifyToken(token);

      // Add user info to request
      req.user = decoded;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(ApiError.badRequest("Token has expired. Please log in again."));
      }
      if (error.name === "JsonWebTokenError") {
        return next(ApiError.badRequest("Invalid token. Please log in again."));
      }
      next(error);
    }
  },

  /**
   * Optional auth middleware - attaches user if token present, but doesn't require it
   */
  optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = authMiddleware.verifyToken(token);
        req.user = decoded;
      }

      next();
    } catch (error) {
      // Token invalid but not required, continue without user
      next();
    }
  },
};

export default authMiddleware;
