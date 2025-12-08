// Mengimpor objek DB yang sudah terinisiasi (mengandung semua model Sequelize)
import db from "../../../models/index.js";

/**
 * Controller untuk mengambil data profil anggota yang sedang login.
 * Endpoint: GET /api/anggota/profil
 * Memerlukan MidAnggota agar req.userId terisi dari token.
 */
export const getAnggotaProfile = async (req, res) => {
  // 1. Ambil ID Anggota dari objek request (disuntikkan oleh MidAnggota)
  const memberId = req.userId;

  // Ambil Model dari objek db yang sudah diinisiasi
  // Pastikan nama properti ini (Member, MemberRoleAssignment) sama persis dengan di models/index.js
  const { Member, MemberRoleAssignment } = db;

  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "ID Anggota tidak ditemukan di token. Akses ditolak.",
    });
  }

  try {
    // 2. Lakukan kueri menggunakan Sequelize findOne + Eager Loading
    const memberData = await Member.findOne({
      where: { member_id: memberId },

      // Mengambil data Role dengan JOIN
      include: [
        {
          model: MemberRoleAssignment, // Model yang di-include
          as: "roleAssignments", // Alias relasi dari models/index.js
          attributes: ["role_id"],
          // Ambil 1 role yang paling baru (DESC)
          limit: 1,
          order: [["start_date", "DESC"]],
          required: false, // LEFT JOIN
        },
      ],

      raw: false, // Penting agar data relasi (roleAssignments) disertakan
    });

    // 3. Cek apakah anggota ditemukan
    if (!memberData) {
      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan.",
      });
    }

    // 4. Transformasi dan Mapping Data
    const result = {
      id: memberData.member_id,
      full_name: memberData.full_name, // Mapping ke 'nama'
      nik: memberData.nik_ktp,
      email: memberData.email,
      phone_number: memberData.phone_number,
      member_no: memberData.member_no,
      status_registrasi: memberData.status_id,

      // Mendapatkan role_id, default 0 jika tidak ada role assignment
      role:
        memberData.roleAssignments && memberData.roleAssignments.length > 0
          ? memberData.roleAssignments[0].role_id
          : 0,
    };

    // 5. Kirim respons sukses
    return res.status(200).json({
      success: true,
      message: "Data profil anggota berhasil diambil.",
      data: result,
    });
  } catch (error) {
    console.error(`[GET_PROFILE] Error: ${error.message}`, error);
    // 6. Kirim respons error server
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memuat profil anggota.",
      error: error.message,
    });
  }
};
