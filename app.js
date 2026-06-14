// app.js

import "dotenv/config";
import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/routes.js";
import { initSocket, users } from "./utils/socket.js";
import ErrorHandler from "./middleware/ErrorHandler.js";
// Trigger restart for CORS config
console.log("✅ App starting...");
console.log("✅ Router imported:", typeof router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://*.googleapis.com", "https://*.mozilla.com", "https://*.push.apple.com"],
      },
    },
  }),
);

let sslOptions = null;
try {
  if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
  } else {
    console.warn("⚠️ SSL paths not configured in environment variables");
  }
} catch (err) {
  console.warn("⚠️ SSL load failed:", err.message);
}

let serverInstance, io;
const PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const portToUse = sslOptions ? HTTPS_PORT : PORT;

if (sslOptions) {
  serverInstance = https.createServer(sslOptions, app);
  io = initSocket(serverInstance);
  console.log("✅ HTTPS Server configured on port", HTTPS_PORT);
} else {
  serverInstance = http.createServer(app);
  io = initSocket(serverInstance);
  console.log("✅ HTTP Server configured on port", PORT);
}

const allowedOrigins = [
  "https://kkpus.id",
  "https://admin.kkpus.id",
  "http://localhost:3000",
  "http://localhost:4173",
  "https://localhost:4173",
  "http://localhost:5173",
  "http://localhost:5174",
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(",").forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith("kkpus.id")) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Rejected origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  }),
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use((req, res, next) => {
  if (io) req.io = io;
  next();
});

console.log("🔄 Mounting router...");
app.use(router);
console.log("✅ Router mounted");

app.use(ErrorHandler);

let server = null;
let shuttingDown = false;

const startServer = () => {
  server = serverInstance.listen(portToUse, () => {
    console.log(`✅ Server & Socket Running on Port ${portToUse}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      // Optimasi: Kurangi delay retry menjadi 1 detik
      console.error(
        `⚠️ Port ${portToUse} sedang digunakan. Mencoba ulang dalam 1 detik...`,
      );
      setTimeout(async () => {
        if (server) server.close();
        if (io) {
          await new Promise((resolve) => io.close(() => resolve()));
          io = null;
        }
        startServer();
      }, 1000);
    } else {
      console.error(err);
    }
  });

  const connections = new Map();

  server.on("connection", (conn) => {
    conn.setMaxListeners(50);
    const key = `${conn.remoteAddress}:${conn.remotePort}`;
    connections.set(key, conn);
    conn.on("close", () => {
      connections.delete(key);
    });
  });

  server.forceShutdown = () => {
    console.log("🔄 Force closing active connections...");
    for (const [key, conn] of connections) {
      conn.destroy();
      connections.delete(key);
    }
  };
};

const shutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`\n🛑 Shutdown Sequence Started (${signal})`);

  // Fallback kill jika graceful shutdown hang
  setTimeout(() => {
    console.error("⏳ Shutdown timeout, forcing process exit...");
    process.exit(1);
  }, 5000).unref();

  try {
    console.log("1️⃣  Blocking new connections...");
    if (typeof serverInstance.closeAllConnections === "function") {
      serverInstance.closeAllConnections();
    }

    console.log("2️⃣  Force closing HTTP connections...");
    if (server && server.forceShutdown) {
      server.forceShutdown();
    }

    console.log("3️⃣  Closing Services Concurrently...");
    const cleanupTasks = [];

    if (io) {
      cleanupTasks.push(
        new Promise((resolve) => {
          io.close(() => {
            console.log("   ✅ Socket.IO closed");
            resolve();
          });
        }),
      );
    } else if (server) {
      cleanupTasks.push(
        new Promise((resolve) => {
          server.close(() => {
            console.log("   ✅ HTTP server closed");
            resolve();
          });
        }),
      );
    }

    await Promise.all(cleanupTasks);

    console.log("4️⃣  Cleaning up socket users...");
    if (users && typeof users.clear === "function") {
      users.clear();
      console.log("   ✅ Socket users cleared");
    }

    console.log("🚪 Process exiting cleanly");
    if (signal === "SIGUSR2") {
      process.kill(process.pid, "SIGUSR2");
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("❌ Critical shutdown error:", err);
    process.exit(1);
  }
};

process.removeAllListeners("SIGTERM");
process.removeAllListeners("SIGINT");
process.removeAllListeners("SIGUSR2");

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGUSR2", () => shutdown("SIGUSR2")); // Untuk nodemon restart

startServer();

// Monitoring memori setiap 60 detik
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log(
    `📊 Memory Usage: RSS=${Math.round(memUsage.rss / 1024 / 1024)}MB, Heap Used=${Math.round(memUsage.heapUsed / 1024 / 1024)}MB, Heap Total=${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  );

  // Auto restart jika heap used > 512MB
  if (memUsage.heapUsed > 512 * 1024 * 1024) {
    console.warn("🚨 Memory usage too high, shutting down gracefully...");
    shutdown("SIGTERM");
  }
}, 60000);
