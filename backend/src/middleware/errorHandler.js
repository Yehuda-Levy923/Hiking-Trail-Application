// Custom error class for API errors
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

// Async handler wrapper to catch errors
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("🔴 Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Handle known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  // Handle validation errors from express-validator
  if (err.array && typeof err.array === "function") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: err.array(),
    });
  }

  // Handle PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case "23505": // Unique violation
        return res.status(409).json({
          success: false,
          message: "Resource already exists",
        });
      case "23503": // Foreign key violation
        return res.status(400).json({
          success: false,
          message: "Referenced resource does not exist",
        });
      case "22P02": // Invalid text representation
        return res.status(400).json({
          success: false,
          message: "Invalid input format",
        });
    }
  }

  // Default error response
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};

// 404 handler for unknown routes
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
