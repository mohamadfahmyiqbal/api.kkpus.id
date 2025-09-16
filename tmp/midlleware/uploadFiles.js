import multer from "multer";

// Config multer: simpan di memori, batas 2MB, validasi tipe file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file JPG/PNG yang diperbolehkan"));
    }
  },
});

// Middleware upload untuk foto dan ktp
export const uploadFotoKtp = upload.fields([
  { name: "foto", maxCount: 1 },
  { name: "ktp", maxCount: 1 },
]);
