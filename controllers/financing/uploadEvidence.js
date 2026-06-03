// 📁 controllers/financing/uploadEvidence.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../../models/index.js';

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/financing-evidence/';
    
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `evidence-${req.params.financingId}-${uniqueSuffix}${ext}`);
  }
});

// Filter untuk validasi file
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only images, PDF, and Word documents are allowed.'), false);
  }
};

// Konfigurasi upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Middleware untuk single file upload
const uploadEvidence = upload.single('evidence');

// Controller untuk handle upload
const handleEvidenceUpload = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { financingId } = req.params;
    const memberId = req.userId;

    // Validasi financing application
    const application = await db.FinancingApplication.findOne({
      where: { 
        financing_id: financingId,
        member_id: memberId 
      },
      transaction: t
    });

    if (!application) {
      // Hapus file yang sudah diupload jika financing tidak ditemukan
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        status: false,
        message: "Pengajuan pembiayaan tidak ditemukan"
      });
    }

    // Validasi status (hanya bisa upload jika status PENDING)
    if (application.status !== 'PENDING') {
      // Hapus file yang sudah diupload jika status tidak PENDING
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: false,
        message: "Hanya bisa upload file evidence untuk pengajuan dengan status PENDING"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Tidak ada file yang diupload"
      });
    }

    // Update database dengan path file
    const filePath = req.file.path.replace(/\\/g, '/'); // Normalisasi path untuk Windows/Linux
    
    await db.FinancingApplication.update(
      { 
        file_evidence: filePath,
        updated_at: new Date()
      },
      {
        where: { financing_id: financingId },
        transaction: t
      }
    );

    await t.commit();

    return res.status(200).json({
      status: true,
      message: "File evidence berhasil diupload",
      data: {
        financing_id: parseInt(financingId),
        file_path: filePath,
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_size: req.file.size
      }
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    
    // Hapus file jika terjadi error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    console.error("Upload Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan saat upload file"
    });
  }
};

// Controller untuk download file evidence
const downloadEvidence = async (req, res) => {
  try {
    const { financingId } = req.params;
    const memberId = req.userId;

    // Validasi financing application
    const application = await db.FinancingApplication.findOne({
      where: { 
        financing_id: financingId,
        member_id: memberId 
      }
    });

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Pengajuan pembiayaan tidak ditemukan"
      });
    }

    if (!application.file_evidence) {
      return res.status(404).json({
        status: false,
        message: "File evidence tidak ditemukan"
      });
    }

    const filePath = application.file_evidence;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: false,
        message: "File tidak ditemukan di server"
      });
    }

    // Get file info
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    // Set content type based on file extension
    let contentType = 'application/octet-stream';
    switch (fileExtension) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }

    // Send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error("Download Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan saat download file"
    });
  }
};

// Controller untuk delete file evidence
const deleteEvidence = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { financingId } = req.params;
    const memberId = req.userId;

    // Validasi financing application
    const application = await db.FinancingApplication.findOne({
      where: { 
        financing_id: financingId,
        member_id: memberId 
      },
      transaction: t
    });

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Pengajuan pembiayaan tidak ditemukan"
      });
    }

    if (!application.file_evidence) {
      return res.status(404).json({
        status: false,
        message: "File evidence tidak ditemukan"
      });
    }

    // Validasi status (hanya bisa delete jika status PENDING)
    if (application.status !== 'PENDING') {
      return res.status(400).json({
        status: false,
        message: "Hanya bisa menghapus file evidence untuk pengajuan dengan status PENDING"
      });
    }

    // Hapus file dari storage
    const filePath = application.file_evidence;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update database
    await db.FinancingApplication.update(
      { 
        file_evidence: null,
        updated_at: new Date()
      },
      {
        where: { financing_id: financingId },
        transaction: t
      }
    );

    await t.commit();

    return res.status(200).json({
      status: true,
      message: "File evidence berhasil dihapus"
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    
    console.error("Delete Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan saat menghapus file"
    });
  }
};

export {
  uploadEvidence,
  handleEvidenceUpload,
  downloadEvidence,
  deleteEvidence
};
