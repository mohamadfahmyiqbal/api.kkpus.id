import { MApprovalFlow } from "../../models/";

export const reqPencairanSimpanan = async (req, res) => {
  const { title, selected, jenis, type, back } = req.body;
  const { nik, nama, email, roles } = req.anggota;
  try {
    const getApproval = await MApprovalFlow.findAll({
      where: { type: back },
    });
    const requestSave = {
      token: selected[0].id,
      nik,
      tipe_request: type,
      tipe_anggota: roles,
    };

    const transaksi = {
      type,
      jenis: back,
      name: selected[0].name,
      nik,
      token: selected[0].id,
      jumlah: selected[0].jumlah,
      payment_status: "Menunggu Pembayaran",
    };

    const approval = {
      token: selected[0].id,
      requester_id: nik,
      type: selected[0].name,
    };
    console.log({ req: requestSave, trans: transaksi });
  } catch (error) {
    console.log(error);
  }
};
