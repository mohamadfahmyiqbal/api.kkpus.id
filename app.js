import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

// Import Router & Socket Logic
import router from "./routes/routes.js";
import { initSocket } from "./controllers/utility/socket.js";

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 3001; 
const httpPort = process.env.HTTP_PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

const app = express();

// ==========================================
// 1. MIDDLEWARE KEAMANAN & LOGGING
// ==========================================
app.use(helmet({ 
    crossOriginResourcePolicy: false // Izinkan akses image dari frontend
}));
app.use(morgan(isProd ? "combined" : "dev"));

// Konfigurasi CORS
const allowedOrigins = [
  "https://localhost:5000",
  "https://localhost:5001",
  "https://pik1com074.local.ikoito.co.id:5000",
  "https://kkpus.id",
  "https://admin.kkpus.id",
  "https://api.kkpus.id"
];

app.use(cors({
    origin: (origin, callback) => { 
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==========================================
// 2. AKSES FILE STATIS (HANYA FOTO PROFIL)
// ==========================================
// Folder KTP & Swafoto sengaja TIDAK dipublikasikan di sini untuk keamanan.
app.use("/uploads/foto", express.static(path.join(__dirname, "uploads/foto")));

// ==========================================
// 3. ROUTING
// ==========================================
app.use(router);

// ==========================================
// 4. KONFIGURASI SSL (HTTPS)
// ==========================================
let sslOptions = {};
try {
  const certPath = isProd ? "config/certs/production" : "config/certs/localhost";
  const keyFile = isProd ? "kkpusid.key" : "localhost.key";
  const crtFile = isProd ? "kkpus_id.crt" : "localhost.crt";

  sslOptions = {
    key: fs.readFileSync(path.join(__dirname, certPath, keyFile)),
    cert: fs.readFileSync(path.join(__dirname, certPath, crtFile)),
  };
} catch (err) {
  console.warn("⚠️ SSL Certificates not found. HTTPS server will not start.");
}

// ==========================================
// 5. INISIALISASI SERVER & SOCKET.IO
// ==========================================
let httpServer = null;
let httpsServer = null;

try {
  // Jalankan HTTP Server
  httpServer = http.createServer(app).listen(httpPort, () => {
    console.log(`✅ HTTP Server running at port ${httpPort}`);
  });

  // Jalankan HTTPS Server & Inisialisasi Socket.io
  if (sslOptions.key && sslOptions.cert) {
    httpsServer = https.createServer(sslOptions, app).listen(port, () => {
      console.log(`✅ HTTPS Server running at port ${port} (${isProd ? 'PRODUCTION' : 'LOCALHOST'})`);
    });

    // Tempelkan Socket ke HTTPS Server
    initSocket(httpsServer);
  } else {
    // Jika SSL gagal, tempelkan Socket ke HTTP Server (untuk dev)
    initSocket(httpServer);
  }
} catch (err) {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
}

// ==========================================
// 6. GRACEFUL SHUTDOWN
// ==========================================
const gracefulShutdown = (signal) => {
  return async () => {
    console.log(`\n🛑 Received ${signal}. Closing servers...`);
    try {
      if (httpServer) httpServer.close();
      if (httpsServer) httpsServer.close();
      // Tambahkan logic tutup DB di sini jika diperlukan
      // await sequelize.close();
      console.log("✔️ Cleanup complete. Server exited.");
      setTimeout(() => process.exit(0), 500);
    } catch (err) {
      console.error("❌ Error during shutdown:", err);
      process.exit(1);
    }
  };
};

process.on("SIGTERM", gracefulShutdown("SIGTERM"));
process.on("SIGINT", gracefulShutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  gracefulShutdown("uncaughtException")();
});