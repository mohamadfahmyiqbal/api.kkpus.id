import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Validasi origin dan format input untuk Manual Payment
 */
export const manualPaymentSecurityMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === "development" || process.env.BYPASS_MANUAL_PAYMENT_SECURITY === "true") {
    return next();
  }

  const origin = req.get("Origin") || req.get("Referer") || "";
  const allowedHostnames = ["kkpus.id", "admin.kkpus.id", "localhost"];
  const isAllowedOrigin = allowedHostnames.some(host => origin.includes(host));

  if (!isAllowedOrigin && origin !== "") {
    console.warn(`[Security Alert] Unauthorized Origin Manual Payment: ${origin}`);
    return res.status(403).json({
      success: false,
      message: "Forbidden: Request pembayaran manual dari origin tidak diizinkan.",
    });
  }

  next();
};

/**
 * Validasi integritas request manual payment di server-side
 */
export const manualPaymentSignatureMiddleware = (req, res, next) => {
  // Verifikasi autentikasi user wajib ada
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Autentikasi gagal. Sesi tidak ditemukan.",
    });
  }

  // Validasi parameter nominal jika disertakan dalam request
  if (req.body.amount) {
    const parsedAmount = parseFloat(req.body.amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Nominal pembayaran tidak valid.",
      });
    }
  }

  next();
};

/**
 * Middleware validasi dan sanitasi file upload bukti pembayaran.
 * Digunakan di routes/billingRoute.js: POST /billing/manual-payment
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/payment-proofs/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `proof-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung. Harap upload gambar (JPG/PNG/WEBP) atau PDF."), false);
  }
};

export const uploadPaymentProofMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
}).single("proof");
