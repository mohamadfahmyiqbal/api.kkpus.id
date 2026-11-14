// routes/healthRoute.js
import express from "express";
import fs from "fs";
import path from "path";

const router102 = express.Router();

/**
 * Health Check Endpoint - /api/health
 * Digunakan untuk monitoring server status dan database connectivity
 */
router102.get("/health", async (req, res) => {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {},
  };

  // Check database connectivity
  try {
    // Import database instance lazily
    const dbModule = await import("../models/index.js");
    const sequelizeInstance = dbModule.default ? dbModule.default.sequelize : dbModule.sequelize;

    await sequelizeInstance.authenticate();
    healthCheck.services.database = {
      status: "ok",
      message: "Connected",
    };
  } catch (error) {
    healthCheck.services.database = {
      status: "error",
      message: error.message || "Database connection failed",
    };
  }

  // Check disk space (simplified)
  try {
    const dbPath = path.join(process.cwd(), "./database");
    const freeSpace = fs.statSync(dbPath).size;
    healthCheck.services.database.storage = {
      status: "ok",
      size_bytes: freeSpace,
    };
  } catch (error) {
    healthCheck.services.database.storage = {
      status: "error",
      message: error.message || "Storage check failed",
    };
  }

  const isHealthy = Object.values(healthCheck.services).every(
    (service) => service.status === "ok" || !service.status
  );

  if (isHealthy) {
    return res.status(200).json({
      success: true,
      status: "ok",
      data: healthCheck,
    });
  } else {
    return res.status(503).json({
      success: false,
      status: "unhealthy",
      data: healthCheck,
    });
  }
});

export default router102;
