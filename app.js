import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import router from "./routes/routes.js";

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 3001; 
const httpPort = process.env.HTTP_PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

const app = express();

// CORS setup
const allowedOrigins = [
  "https://localhost:5000",
  "https://localhost:5001",
  "https://pik1com074.local.ikoito.co.id:5000",
  "https://kkpus.id",
  "https://admin.kkpus.id",
  "https://api.kkpus.id"
];

app.use(
  cors({
    origin: (origin, callback) => { 
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Pasang router
app.use(router);

// =========================================================================
// ✅ PENYESUAIAN SSL: Mengikuti struktur Gambar 3 (localhost vs production)
// =========================================================================
let sslOptions = {};

try {
  if (isProd) {
    // Mode Production: Menggunakan folder certs/production
    sslOptions = {
      key: fs.readFileSync(path.join(__dirname, "config/certs/production/kkpusid.key")),
      cert: fs.readFileSync(path.join(__dirname, "config/certs/production/kkpus_id.crt")),
      // Jika ada CA Bundle nantinya, tambahkan di sini:
      // ca: fs.readFileSync(path.join(__dirname, "config/certs/production/ca_bundle.crt"))
    };
  } else {
    // Mode Localhost: Menggunakan folder certs/localhost
    sslOptions = {
      key: fs.readFileSync(path.join(__dirname, "config/certs/localhost/localhost.key")),
      cert: fs.readFileSync(path.join(__dirname, "config/certs/localhost/localhost.crt")),
    };
  }
} catch (err) {
  console.warn("⚠️ SSL Certificates not found or failed to load. HTTPS might not start.");
}

let httpServer = null;
let httpsServer = null;

try {
  // Jalankan HTTP (Selalu)
  httpServer = http.createServer(app).listen(httpPort, () => {
    console.log(`✅ HTTP server running at port ${httpPort}`);
  });

  // Jalankan HTTPS (Otomatis deteksi ketersediaan cert)
  if (sslOptions.key && sslOptions.cert) {
    httpsServer = https.createServer(sslOptions, app).listen(port, () => {
      console.log(`✅ HTTPS server running at port ${port} (${isProd ? 'PRODUCTION' : 'LOCALHOST'})`);
    });
  }
} catch (err) {
  console.error("❌ Failed to start server", err);
  process.exit(1);
}

// Graceful shutdown helpers (tetap sama)
async function closeOtherResources() {
  return Promise.resolve();
}

function gracefulShutdown(signal) {
  return async () => {
    console.log(`\nReceived ${signal}. Closing servers...`);
    try {
      if (httpServer) httpServer.close();
      if (httpsServer) httpsServer.close();
      await closeOtherResources();
      setTimeout(() => process.exit(0), 500);
    } catch (err) {
      console.error("Error during graceful shutdown:", err);
      process.exit(1);
    }
  };
}

process.on("SIGTERM", gracefulShutdown("SIGTERM"));
process.on("SIGINT", gracefulShutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("uncaughtException")();
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection")();
});