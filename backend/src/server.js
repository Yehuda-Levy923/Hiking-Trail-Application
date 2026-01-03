import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { testConnection } from "./config/db.js";

const PORT = process.env.PORT || 4000;

// Graceful shutdown handler
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("❌ Cannot start server without database connection");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║     🥾 Hiking Trail Traffic API Server 🥾      ║
╠════════════════════════════════════════════════╣
║  Status:  Running                              ║
║  Port:    ${PORT.toString().padEnd(36)}║
║  Mode:    ${(process.env.NODE_ENV || "development").padEnd(36)}║
║  Health:  http://localhost:${PORT}/health        ║
║  API:     http://localhost:${PORT}/api           ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
