import db from "../../models/index.js";

const { ArisanBatch, ArisanProgram, ArisanParticipant } = db;

export const getBatches = async (req, res) => {
  try {
    const batches = await ArisanBatch.findAll({
      include: [
        {
          model: ArisanProgram,
          as: 'program',
          attributes: ['program_name', 'category', 'target_amount', 'monthly_contribution', 'term_months']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const mappedBatches = await Promise.all(
      batches.map(async (batch) => {
        const participantCount = await ArisanParticipant.count({
          where: { arisan_batch_id: batch.arisan_batch_id }
        });

        return {
          arisan_batch_id: batch.arisan_batch_id,
          program_name: batch.program?.program_name || 'Program Arisan',
          batch_name: batch.batch_name,
          category: batch.program?.category || '-',
          target_amount: batch.program?.target_amount || 0,
          monthly_installment: batch.program?.monthly_contribution || batch.monthly_installment || 0,
          jumlah_keberangkatan: batch.jumlah_keberangkatan || 0,
          participant_count: participantCount,
          participants_quota: batch.participants_quota || 0,
          cooperation_months: batch.program?.term_months || 0,
          period_start_month: batch.period_start_month,
          period_start_year: batch.period_start_year,
          status: batch.status
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data arisan batches",
      data: mappedBatches
    });
  } catch (error) {
    console.error("Error getBatches:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { batch_name, participants_quota, monthly_installment, jumlah_keberangkatan, status, program_id, program_name, category, target_amount, term_months, period_start_month, period_start_year } = req.body;

    let targetProgramId = program_id;
    if (!targetProgramId) {
      if (program_name) {
        const newProgram = await ArisanProgram.create({
          program_name,
          category: category || 'Arisan',
          target_amount: parseFloat(target_amount) || 0,
          monthly_contribution: parseFloat(monthly_installment) || 0,
          term_months: parseInt(term_months) || 0
        });
        targetProgramId = newProgram.arisan_program_id;
      } else {
        const firstProgram = await ArisanProgram.findOne();
        if (!firstProgram) {
          return res.status(400).json({ success: false, message: "Belum ada program arisan dan nama program tidak diberikan. Buat program terlebih dahulu." });
        }
        targetProgramId = firstProgram.arisan_program_id;
      }
    }

    const newBatch = await ArisanBatch.create({
      arisan_program_id: targetProgramId,
      batch_name,
      participants_quota: parseInt(participants_quota) || 0,
      monthly_installment: parseFloat(monthly_installment) || 0,
      jumlah_keberangkatan: parseInt(jumlah_keberangkatan) || 0,
      status: status || 'DRAFT',
      period_start_month: parseInt(period_start_month) || (new Date().getMonth() + 1),
      period_start_year: parseInt(period_start_year) || new Date().getFullYear()
    });

    return res.status(201).json({
      success: true,
      message: "Berhasil membuat arisan batch baru",
      data: newBatch
    });
  } catch (error) {
    console.error("Error createBatch:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat menyimpan batch." });
  }
};

export const updateBatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const batch = await ArisanBatch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch tidak ditemukan" });
    }

    batch.status = status;
    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Status batch berhasil diupdate",
      data: batch
    });
  } catch (error) {
    console.error("Error updateBatchStatus:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { batch_name, participants_quota, monthly_installment, jumlah_keberangkatan, status, period_start_month, period_start_year, program_name, category, target_amount, term_months } = req.body;

    const batch = await ArisanBatch.findByPk(id, { include: [{ model: ArisanProgram, as: 'program' }] });
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch tidak ditemukan" });
    }

    if (batch.program) {
      batch.program.program_name = program_name || batch.program.program_name;
      batch.program.category = category || batch.program.category;
      batch.program.target_amount = parseFloat(target_amount) || batch.program.target_amount;
      batch.program.monthly_contribution = parseFloat(monthly_installment) || batch.program.monthly_contribution;
      batch.program.term_months = parseInt(term_months) || batch.program.term_months;
      await batch.program.save();
    }

    batch.batch_name = batch_name || batch.batch_name;
    batch.participants_quota = parseInt(participants_quota) || batch.participants_quota;
    batch.monthly_installment = parseFloat(monthly_installment) || batch.monthly_installment;
    batch.jumlah_keberangkatan = parseInt(jumlah_keberangkatan) || batch.jumlah_keberangkatan;
    batch.status = status || batch.status;
    batch.period_start_month = parseInt(period_start_month) || batch.period_start_month;
    batch.period_start_year = parseInt(period_start_year) || batch.period_start_year;

    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Batch berhasil diupdate",
      data: batch
    });
  } catch (error) {
    console.error("Error updateBatch:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat update batch." });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await ArisanBatch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch tidak ditemukan" });
    }

    await batch.destroy();

    return res.status(200).json({
      success: true,
      message: "Batch berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleteBatch:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat menghapus batch." });
  }
};
