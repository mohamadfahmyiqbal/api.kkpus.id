import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

import router from "./routes/routes.js";
import { initSocket } from "./controllers/utility/socket.js";

dotenv.config();

/* =======================
   BASIC CONFIG
======================= */
const __dirname = path.resolve();
const isProd = process.env.NODE_ENV === "production";

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.PORT || 3001;

const app = express();

/* =======================
   TRUST PROXY
======================= */
app.set("trust proxy", true);

/* =======================
   SECURITY & LOGGING
======================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan(isProd ? "combined" : "dev"));

/* =======================
   CORS CONFIG (FINAL FIX)
======================= */
const allowedOrigins = [
  "https://pik1com074.local.ikoito.co.id:5000",
  "https://localhost:5000",
  "https://localhost:5001",
  "https://kkpus.id",
  "https://admin.kkpus.id",
  "https://api.kkpus.id",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

/**
 * 🔴 PENTING:
 * Jangan pakai "*", jangan pakai "/*"
 * WAJIB pakai REGEX
 */
app.options(/.*/, cors(corsOptions));

/* =======================
   BODY & COOKIE
======================= */
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   ROUTES
======================= */
app.use(router);

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

/* =======================
   SSL CONFIG
======================= */
let sslOptions = null;

try {
  const certDir = isProd
    ? "config/certs/production"
    : "config/certs/localhost";

  const keyPath = path.join(
    __dirname,
    certDir,
    isProd ? "kkpusid.key" : "localhost.key"
  );
  const certPath = path.join(
    __dirname,
    certDir,
    isProd ? "kkpus_id.crt" : "localhost.crt"
  );

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    console.log("🔐 SSL certificate loaded");
  }
} catch (err) {
  console.warn("⚠️ SSL load failed:", err.message);
}

/* =======================
   SERVER START
======================= */
// if (sslOptions) {
  // const httpsServer = https.createServer(sslOptions, app);
  // httpsServer.listen(HTTPS_PORT, () => {
  //   console.log(`✅ HTTPS Server running on port ${HTTPS_PORT}`);
  // });

  // initSocket(httpsServer);
// } else {
  const httpServer = http.createServer(app);
  httpServer.listen(HTTP_PORT, () => {
    console.log(`⚠️ HTTP Server running on port ${HTTP_PORT}`);
  });

  initSocket(httpServer);
// }

export default app;
