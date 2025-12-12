import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import router from "./routes/routes.js"; // Pastikan ini mengimpor router utama

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 3001; // contoh https port
const httpPort = process.env.HTTP_PORT || 3000;

const app = express();

// CORS setup
const allowedOrigins = [
  "https://pik1com074.local.ikoito.co.id:5000",
  "https://localhost:5000",
  "https://localhost:5001",
  "https://kkpus.id",
  "https://admin.kkpus.id",
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

app.use(cookieParser());

// ✅ PENTING: TINGKATKAN BATAS UKURAN BODY UNTUK MENGAKOMODASI BASE64 GAMBAR (KTP/SWAFOTO)
app.use(
  express.json({
    limit: "5mb", // Meningkatkan batas payload JSON menjadi 5MB
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb", // Meningkatkan batas payload URL-encoded menjadi 5MB
  })
);

// Pasang router
app.use(router);

// Serve static files dari folder 'uploads'
// Ini diperlukan agar path gambar yang disimpan di database bisa diakses oleh frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SSL config (pastikan file ada)
// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, "config/cert/localhost-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "config/cert/localhost.pem")),
// };
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "config/pik1com074/private.key")),
  cert: fs.readFileSync(path.join(__dirname, "config/pik1com074/certificate.cer")),
};

// ... (Kode untuk menangani HTTP dan HTTPS server)

let httpServer = null;
let httpsServer = null;

const closeOtherResources = async () => {
  // Tambahkan logika untuk menutup koneksi database, dll.
  console.log("Closing other resources...");
  // await db.close(); // Contoh
};

function gracefulShutdown(signal) {
  return () => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    try {
      // Tutup server untuk menghentikan penerimaan koneksi baru
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
      closeOtherResources();

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

// Mulai server (gunakan http atau https berdasarkan kebutuhan)
try {
  // HTTPS Server
  httpsServer = https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server running securely at https://localhost:${port}`);
  });

  // HTTP Server (optional, untuk redirect atau development)
  httpServer = http
    .createServer((req, res) => {
      // Redirect HTTP ke HTTPS
      res.writeHead(301, {
        Location: `https://${req.headers.host.split(":")[0]}:${port}${req.url}`,
      });
      res.end();
    })
    .listen(httpPort, () => {
      console.log(`HTTP server running at http://localhost:${httpPort}`);
    });
} catch (error) {
  console.error("Failed to start server:", error.message);
}
