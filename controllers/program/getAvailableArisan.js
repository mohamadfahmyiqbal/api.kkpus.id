// controllers/program/getAvailableArisan.js

import db from "../../models/index.js";

const { ArisanBatch, ArisanProgram, ArisanParticipant } = db;

const getAvailableArisan = async (req, res) => {
  try {
    // Ambil semua batch arisan yang statusnya ACTIVE atau OPEN
    const batches = await ArisanBatch.findAll({
      where: {
        status: ['ACTIVE', 'OPEN']
      },
      include: [
        {
          model: ArisanProgram,
          as: 'program',
          attributes: ['arisan_program_id', 'program_name', 'category', 'target_amount', 'term_months', 'monthly_contribution']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Hitung jumlah peserta untuk tiap batch
    const availableArisan = await Promise.all(
      batches.map(async (batch) => {
        const participantCount = await ArisanParticipant.count({
          where: { arisan_batch_id: batch.arisan_batch_id }
        });

        return {
          arisan_id: batch.arisan_batch_id,
          program_name: batch.program?.program_name || 'Program Arisan',
          batch_name: batch.batch_name,
          category: batch.program?.category || '-',
          target_amount: batch.program?.target_amount || 0,
          monthly_contribution: batch.program?.monthly_contribution || batch.monthly_installment || 0,
          participant_count: participantCount,
          max_participants: batch.participants_quota || 0,
          cooperation_months: batch.program?.term_months || 0,
          start_date: batch.period_start_year && batch.period_start_month 
            ? `${batch.period_start_year}-${String(batch.period_start_month).padStart(2, '0')}-01`
            : null,
          status: batch.status
        };
      })
    );

    // Filter hanya yang masih ada quota
    const filtered = availableArisan.filter(
      arisan => arisan.participant_count < arisan.max_participants
    );

    res.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Error in getAvailableArisan:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default getAvailableArisan;
