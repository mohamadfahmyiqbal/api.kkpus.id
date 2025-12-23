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
const port = process.env.PORT || 3001; // contoh https port
const httpPort = process.env.HTTP_PORT || 3000;

const app = express();

// CORS setup
const allowedOrigins = [
  "https://localhost:5000",
  "https://localhost:5001",
  "https://pik1com074.local.ikoito.co.id:5000",
  "https://kkpus.id",
  "https://admin.kkpus.id",
];

app.use(
  cors({
    origin: (origin, callback) => { 
      // Izinkan request tanpa origin (seperti dari postman atau file lokal)
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.set("trust proxy", true);

app.use(cookieParser());

// =========================================================================
// ✅ KOREKSI: ATASI PayloadTooLargeError dengan menaikkan batas ukuran payload
// =========================================================================
// Batas default 100kb terlalu kecil untuk data Base64 gambar.
// Menaikkan batas menjadi 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Pasang router
app.use(router);

// SSL config (pastikan file ada)
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "config/cert/localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "config/cert/localhost.pem")),
};

// Simpan referensi server sehingga bisa kita close saat shutdown
let httpServer = null;
let httpsServer = null;

// Pilihan: jalankan HTTPS + HTTP, atau hanya HTTP (sesuaikan kebutuhan)
try {
  // Uncomment jika ingin HTTPS juga
  // httpsServer = https.createServer(sslOptions, app).listen(port, () => {
  //   console.log(`✅ HTTPS server running at port ${port}`);
  // });

  httpServer = http.createServer(app).listen(httpPort, () => {
    console.log(`✅ HTTP server running at port ${httpPort}`);
  });
} catch (err) {
  console.error("Failed to start server", err);
  process.exit(1);
}

// Jika ada resource lain (DB, queue, dsb), tutup di sini
async function closeOtherResources() {
  // Contoh:
  // if (db && db.close) await db.close();
  // if (redisClient) await redisClient.quit();
  return Promise.resolve();
}

// Graceful shutdown helper
function gracefulShutdown(signal) {
  return async () => {
    console.log(`\nReceived ${signal}. Closing servers...`);
    try {
      // stop accepting new connections
      if (httpServer) {
        httpServer.close((err) => {
          if (err) console.error("Error closing HTTP server:", err);
          else console.log("HTTP server closed");
        });
      }
      if (httpsServer) {
        httpsServer.close((err) => {
          if (err) console.error("Error closing HTTPS server:", err);
          else console.log("HTTPS server closed");
        });
      }

      // tutup resource lain (DB, redis, dll)
      await closeOtherResources();

      // beri waktu singkat agar semua koneksi selesai, lalu exit
      setTimeout(() => {
        console.log("Shutdown complete. Exiting process.");
        process.exit(0);
      }, 500); // adjust timeout jika perlu
    } catch (err) {
      console.error("Error during graceful shutdown:", err);
      process.exit(1);
    }
  };
}

// Tangani sinyal dari nodemon / system
process.on("SIGTERM", gracefulShutdown("SIGTERM")); // nodemon --signal SIGTERM
process.on("SIGINT", gracefulShutdown("SIGINT")); // Ctrl+C

// Tangani uncaught exceptions / rejections supaya proses tidak meninggalkan port ter-occupy
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // lakukan graceful shutdown lalu exit
  gracefulShutdown("uncaughtException")();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // lakukan graceful shutdown lalu exit
  gracefulShutdown("unhandledRejection")();
});