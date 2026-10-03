import db from "../../../models/index.js";

const confirmTermination = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;

    const termination = await db.MembershipTermination.findOne({
      where: {
        member_id: memberId,
        status: "WAITING_CONFIRMATION"
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!termination) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Pengajuan pengunduran diri dengan status menunggu konfirmasi tidak ditemukan."
      });
    }

    // Ubah status pengajuan menjadi COMPLETED
    await db.MembershipTermination.update(
      { 
        status: "COMPLETED",
        completed_at: new Date()
      },
      { 
        where: { termination_id: termination.termination_id },
        transaction: t 
      }
    );

    // Cari ID status untuk 'NON-AKTIF' atau serupa
    const inactiveStatus = await db.MemberStatus.findOne({
      where: { status_name: "NON-AKTIF" },
      transaction: t
    });

    const targetStatusId = inactiveStatus ? inactiveStatus.status_id : 2; // Default fallback to 2

    // Ubah status member
    await db.Member.update(
      { status_id: targetStatusId },
      { 
        where: { member_id: memberId },
        transaction: t
      }
    );

    // Catat log
    await db.ActivityLog.create({
      member_id: memberId,
      activity_type: 'TERMINATION_CONFIRMED',
      activity_datetime: new Date(),
      detail: `Anggota mengonfirmasi penerimaan dana berhenti keanggotaan. Akun dinonaktifkan.`
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Konfirmasi berhasil. Keanggotaan Anda telah dinonaktifkan."
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("[confirmTermination] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memproses konfirmasi."
    });
  }
};

export { confirmTermination };
