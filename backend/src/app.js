import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import trailsRouter from "./routes/trails.js";
import trafficRouter from "./routes/traffic.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// ============================================
// Security Middleware
// ============================================
app.use(helmet());

// ============================================
// CORS Configuration
// ============================================
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ============================================
// Request Parsing
// ============================================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ============================================
// Logging
// ============================================
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ============================================
// Health Check
// ============================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// API Info
// ============================================
app.get("/api", (req, res) => {
  res.json({
    name: "Hiking Trail Traffic API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/me": "Get current user (protected)",
        "POST /api/auth/forgot-password": "Request password reset",
        "POST /api/auth/reset-password": "Reset password with token",
      },
      users: {
        "GET /api/users/profile": "Get current user profile (protected)",
        "PUT /api/users/profile": "Update user profile (protected)",
        "GET /api/users/favorites": "Get user's favorite trails (protected)",
        "POST /api/users/favorites/:trailId": "Add trail to favorites (protected)",
        "DELETE /api/users/favorites/:trailId": "Remove trail from favorites (protected)",
      },
      trails: {
        "GET /api/trails": "Get all trails (supports pagination: page, limit)",
        "GET /api/trails/:id": "Get trail by ID",
        "POST /api/trails": "Create new trail",
        "PUT /api/trails/:id": "Update trail",
        "DELETE /api/trails/:id": "Delete trail",
      },
      traffic: {
        "GET /api/traffic": "Get all traffic reports",
        "GET /api/traffic/stats": "Get traffic statistics",
        "GET /api/traffic/refresh": "Refresh all traffic data",
        "GET /api/traffic/:trailId": "Get traffic for trail",
        "PUT /api/traffic/:trailId": "Update traffic for trail",
      },
    },
  });
});

// ============================================
// API Routes
// ============================================
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/trails", trailsRouter);
app.use("/api/traffic", trafficRouter);

// ============================================
// Error Handling
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
