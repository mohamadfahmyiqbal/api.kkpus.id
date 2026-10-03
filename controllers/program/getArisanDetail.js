// controllers/program/getArisanDetail.js

import db from "../../models/index.js";

const { ArisanBatch, ArisanProgram, ArisanParticipant } = db;

const getArisanDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await ArisanBatch.findByPk(id, {
      include: [
        {
          model: ArisanProgram,
          as: 'program'
        }
      ]
    });

    if (!batch) {
      return res.status(404).json({ success: false, message: "Grup arisan tidak ditemukan" });
    }

    const participantCount = await ArisanParticipant.count({
      where: { arisan_batch_id: batch.arisan_batch_id }
    });

    // Formatting dates
    const start_date = batch.period_start_year && batch.period_start_month 
      ? `${batch.period_start_year}-${String(batch.period_start_month).padStart(2, '0')}-01`
      : null;
      
    // Calculate end date based on term_months
    let end_date = null;
    if (start_date && batch.program?.term_months) {
      const date = new Date(start_date);
      date.setMonth(date.getMonth() + batch.program.term_months);
      end_date = date.toISOString().split('T')[0];
    }

    const data = {
      arisan_id: batch.arisan_batch_id,
      program_name: batch.program?.program_name || 'Program Arisan',
      batch_name: batch.batch_name,
      category: batch.program?.category || '-',
      target_amount: batch.program?.target_amount || 0,
      monthly_contribution: batch.program?.monthly_contribution || batch.monthly_installment || 0,
      participant_count: participantCount,
      max_participants: batch.participants_quota || 0,
      cooperation_months: batch.program?.term_months || 0,
      start_date,
      end_date,
      status: batch.status
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in getArisanDetail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default getArisanDetail;
