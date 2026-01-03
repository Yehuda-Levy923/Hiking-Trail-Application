import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import trailsRouter from "./routes/trails.js";
import trafficRouter from "./routes/traffic.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// ============================================
// Security Middleware
// ============================================
app.use(helmet());

// ============================================
// CORS Configuration
// ============================================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
      trails: {
        "GET /api/trails": "Get all trails",
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
app.use("/api/trails", trailsRouter);
app.use("/api/traffic", trafficRouter);

// ============================================
// Error Handling
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
