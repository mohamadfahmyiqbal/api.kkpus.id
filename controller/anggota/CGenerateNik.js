import MAnggota from "../../models/anggota/MAnggota.js";
import { Op } from "sequelize";

export const generateNIKBaru = async () => {
  const now = new Date();
  const tahunSekarang = now.getFullYear().toString().slice(-2);
  const kodeAnggota = "01";
  const prefix = `${tahunSekarang}${kodeAnggota}`;

  // Cari NIK terbesar yang sesuai prefix
  const nikTerbesarRow = await MAnggota.findOne({
    where: {
      nik: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["nik", "DESC"]],
    attributes: ["nik"],
    raw: true,
  });

  let urutan = 1;
  if (nikTerbesarRow && nikTerbesarRow.nik) {
    const nikTerbesarStr = nikTerbesarRow.nik.toString();
    const urutanStr = nikTerbesarStr.slice(-3);
    const urutanNum = parseInt(urutanStr, 10);
    if (!isNaN(urutanNum)) {
      urutan = urutanNum + 1;
    }
  }

  const urutanStrBaru = urutan.toString().padStart(3, "0");
  return `${prefix}${urutanStrBaru}`;
};
