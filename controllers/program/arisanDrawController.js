import db from "../../models/index.js";
import { Op } from "sequelize";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Konfigurasi multer untuk upload file bukti transfer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/arisan-transfer/';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `transfer-${req.params.id}-${uniqueSuffix}${ext}`);
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

export const uploadTransferProof = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('bukti_transfer');

const { ArisanDraw, Member, ArisanBatch, ArisanParticipant } = db;

export const getDrawsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const draws = await ArisanDraw.findAll({
      where: { arisan_batch_id: batchId },
      include: [
        {
          model: Member,
          as: 'winner',
          attributes: ['member_id', 'member_no', 'full_name', 'phone_number']
        }
      ],
      order: [['draw_month', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: draws
    });
  } catch (error) {
    console.error("Error getDrawsByBatch:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const conductDraw = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { draw_month } = req.body;

    // Check if draw for this month already exists
    const existingDraw = await ArisanDraw.findOne({
      where: { arisan_batch_id: batchId, draw_month }
    });

    if (existingDraw) {
      return res.status(400).json({ success: false, message: "Kocokan untuk bulan ini sudah dilakukan." });
    }

    // Get batch info
    const batch = await ArisanBatch.findByPk(batchId, { include: ['program'] });
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    // Get all previous winners
    const previousDraws = await ArisanDraw.findAll({
      where: { arisan_batch_id: batchId },
      attributes: ['winner_member_id']
    });
    const winnerIds = previousDraws.map(d => d.winner_member_id);

    // Get eligible participants (approved, not won yet)
    const participantWhere = {
      arisan_batch_id: batchId,
      status: { [Op.in]: ['APPROVED', 'ACTIVE', 'PENDING'] }
    };
    if (winnerIds.length > 0) {
      participantWhere.member_id = { [Op.notIn]: winnerIds };
    }

    const activeParticipantsCount = await ArisanParticipant.count({
      where: {
        arisan_batch_id: batchId,
        status: { [Op.in]: ['APPROVED', 'ACTIVE', 'PENDING'] }
      }
    });

    if (activeParticipantsCount < batch.participants_quota) {
      return res.status(400).json({ success: false, message: `Jumlah peserta belum memenuhi kuota (${activeParticipantsCount}/${batch.participants_quota}).` });
    }

    const eligibleParticipants = await ArisanParticipant.findAll({
      where: participantWhere
    });

    if (eligibleParticipants.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada peserta yang memenuhi syarat untuk dikocok." });
    }

    // Random pick
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const winner = eligibleParticipants[randomIndex];

    // Create draw record
    const draw = await ArisanDraw.create({
      arisan_batch_id: batchId,
      winner_member_id: winner.member_id,
      draw_month,
      draw_date: new Date(),
      disbursement_amount: batch.program?.target_amount || 0,
      status: 'PENDING'
    });

    return res.status(200).json({
      success: true,
      message: "Kocokan berhasil dilakukan",
      data: draw
    });

  } catch (error) {
    console.error("Error conductDraw:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message, stack: error.stack });
  }
};

export const updateDrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const draw = await ArisanDraw.findByPk(id);
    if (!draw) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    if (req.file) {
      const normalizePath = (file) => file.path.replace(/\\/g, '/');
      draw.transfer_proof = normalizePath(req.file);
    }

    draw.status = status;
    await draw.save();

    return res.status(200).json({
      success: true,
      message: "Status berhasil diupdate",
      data: draw
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    console.error("Error updateDrawStatus:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
