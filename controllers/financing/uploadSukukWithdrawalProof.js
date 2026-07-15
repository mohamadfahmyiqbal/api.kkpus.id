import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../../models/index.js';

// Configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/sukuk-evidence/';
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `sukuk-withdraw-${req.params.orderId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only images and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadProofMiddleware = upload.single('transfer_proof');

const uploadSukukWithdrawalProof = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { orderId } = req.params;

    const order = await db.SukukOrder.findOne({
      where: { order_id: orderId },
      transaction: t
    });

    if (!order) {
      if (req.file) fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Order Sukuk tidak ditemukan"
      });
    }

    if (order.status !== 'WITHDRAWAL_REQUESTED') {
      if (req.file) fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Hanya bisa upload bukti untuk order dengan status PENCAIRAN DIPROSES (WITHDRAWAL_REQUESTED)"
      });
    }

    if (!req.file) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Tidak ada file bukti transfer yang diupload"
      });
    }

    const normalizePath = (file) => file.path.replace(/\\/g, '/');
    const filePath = normalizePath(req.file);

    await order.update({
      transfer_proof: filePath,
      status: 'WITHDRAWN',
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      status: true,
      message: "Bukti transfer berhasil diupload dan status berubah menjadi SUDAH DICAIRKAN",
      data: {
        order_id: orderId,
        transfer_proof: filePath
      }
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    console.error("Upload Sukuk Withdrawal Proof Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan saat upload file"
    });
  }
};

export { uploadProofMiddleware, uploadSukukWithdrawalProof };
