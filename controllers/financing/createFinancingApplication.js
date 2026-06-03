import db from "../../models/index.js";
import { sendGlobalNotification } from "../utility/notificationHelper.js";

const createFinancingApplication = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;

    const { category } = req.body;

    // Get valid loan product names to distinguish from general financing
    const loanProducts = await db.LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name);
    
    const isPinjaman = loanProductNames.includes(category);

    const whereClause = {
      member_id: memberId,
      status: {
        [db.Sequelize.Op.notIn]: ['COMPLETED', 'CANCELLED', 'REJECTED']
      }
    };

    // If applying for Pinjaman, check for active Pinjaman. Else, check for active Pembiayaan.
    if (isPinjaman) {
      whereClause.category = {
        [db.Sequelize.Op.in]: loanProductNames
      };
    } else {
      whereClause.category = {
        [db.Sequelize.Op.notIn]: loanProductNames
      };
    }

    // Cek apakah member sudah memiliki transaksi yang sama yang belum selesai
    const existingApplication = await db.FinancingApplication.findOne({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    if (existingApplication) {
      const typeName = isPinjaman ? "Pinjaman" : "Pembiayaan";
      return res.status(400).json({
        status: false,
        message: `Anda memiliki ${typeName} yang sedang berjalan (Status: ${existingApplication.status}). Tidak dapat mengajukan ${typeName} baru sampai transaksi sebelumnya selesai.`,
        data: {
          existing_financing_id: existingApplication.financing_id,
          existing_status: existingApplication.status
        }
      });
    }

    const { 
      item_name, 
      amount_requested, 
      down_payment, 
      principal_amount, 
      tenure, 
      monthly_installment,
      metode_pencairan,
      nama_nasabah,
      // Field untuk Non Tunai
      no_rekening,
      bank_tujuan,
      // Field untuk Tunai
      lokasi_pencairan,
      tanggal_pencairan,
      jam_pencairan
    } = req.body;

    // Validasi metode pencairan
    if (!metode_pencairan || !['Tunai', 'Non Tunai'].includes(metode_pencairan)) {
      throw new Error("Metode pencairan tidak valid. Pilih 'Tunai' atau 'Non Tunai'");
    }

    // Validasi field berdasarkan metode pencairan
    if (metode_pencairan === 'Non Tunai') {
      if (!no_rekening || !bank_tujuan) {
        throw new Error("Untuk metode Non Tunai, nomor rekening dan bank tujuan wajib diisi");
      }
      // Validasi format nomor rekening (hanya angka, minimal 10 digit)
      if (!/^\d{10,}$/.test(no_rekening)) {
        throw new Error("Nomor rekening minimal 10 digit dan hanya boleh angka");
      }
    } else if (metode_pencairan === 'Tunai') {
      if (!lokasi_pencairan || !tanggal_pencairan || !jam_pencairan) {
        throw new Error("Untuk metode Tunai, lokasi, tanggal dan jam pencairan wajib diisi");
      }
      // Validasi tanggal tidak boleh kurang dari hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(tanggal_pencairan);
      if (selectedDate < today) {
        throw new Error("Tanggal pencairan tidak boleh kurang dari hari ini");
      }
    }

    // Validasi nama nasabah
    if (!nama_nasabah || nama_nasabah.trim().length < 3) {
      throw new Error("Nama nasabah minimal 3 karakter");
    }

    const flow = await db.ApprovalFlow.findOne({ 
      where: { entity_ref: 'financing_applications' },
      transaction: t 
    });

    if (!flow) throw new Error("Approval Flow belum dikonfigurasi.");

    const firstStep = await db.ApprovalStep.findOne({
      where: { approval_flow_id: flow.approval_flow_id },
      order: [['step_order', 'ASC']],
      transaction: t
    });

    if (!firstStep) throw new Error("Approval Step belum dikonfigurasi.");

    // Prepare application data
    const applicationData = {
      member_id: memberId,
      category: category,
      purpose: item_name,
      item_price: amount_requested,
      down_payment: down_payment,
      amount_requested: principal_amount,
      cooperation_months: parseInt(tenure),
      monthly_installment: monthly_installment,
      status: 'PENDING',
      approval_flow_id: flow.approval_flow_id,
      current_step_id: firstStep.approval_step_id,
      akad_type: 'Murabahah',
      metode_pencairan: metode_pencairan,
      nama_nasabah: nama_nasabah.trim()
    };

    // Tambahkan field berdasarkan metode pencairan
    if (metode_pencairan === 'Non Tunai') {
      applicationData.no_rekening = no_rekening;
      applicationData.bank_tujuan = bank_tujuan;
    } else if (metode_pencairan === 'Tunai') {
      applicationData.lokasi_pencairan = lokasi_pencairan.trim();
      applicationData.tanggal_pencairan = tanggal_pencairan;
      applicationData.jam_pencairan = jam_pencairan;
    }

    const newApplication = await db.FinancingApplication.create(applicationData, { transaction: t });

    await t.commit();

    // Kirim notifikasi dengan detail metode pencairan
    setImmediate(async () => {
      try {
        const disbursementInfo = metode_pencairan === 'Non Tunai' 
          ? `Transfer ke ${bank_tujuan} (${no_rekening.slice(-4)})`
          : `Pencairan tunai di ${lokasi_pencairan} pada ${new Date(tanggal_pencairan).toLocaleDateString('id-ID')} ${jam_pencairan}`;

        await sendGlobalNotification({
          memberId: memberId,
          title: "Pengajuan Pembiayaan",
          content: `Pengajuan ${category} (${item_name}) senilai Rp ${Number(principal_amount).toLocaleString('id-ID')} dengan metode ${metode_pencairan}. ${disbursementInfo}`,
          type: "FINANCING",
          url: "/transaksi"
        });
      } catch (err) {
        console.error("Notification Error:", err.message);
      }
    });

    return res.status(201).json({
      status: true,
      message: "Pengajuan pembiayaan berhasil diproses.",
      data: { 
        financing_id: newApplication.financing_id,
        metode_pencairan: metode_pencairan
      }
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export default createFinancingApplication;