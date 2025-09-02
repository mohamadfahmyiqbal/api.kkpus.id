import moment from "moment";
import MAnggotaReq from "../../models/anggota/MAnggotaReq.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import MPaymentRules from "../../models/payment/MPaymentRules.js";

export const generateInvoice = async (req, res) => {
  const { nik, nama, type, token, bank, category, tipe_anggota } = req.body;

  try {
    const cekApproval = await MApprovalRequest.findAll({
      where: {
        requester_id: nik,
        type,
      },
    });

    // Cek apakah semua data di cekApproval sudah approved
    const semuaApproved = cekApproval.every(
      (item) => item.status === "approved"
    );
    if (!semuaApproved) {
      return res
        .status(400)
        .json({ message: "Semua approval harus berstatus approved." });
    }

    if (type === "pendaftaran_anggota") {
      const cekPay = await MPaymentRules.findAll({
        where: {
          category,
          tipe_anggota,
        },
      });
      console.log(cekPay);

      console.log({
        invoice_id: moment().format("YYYYMMDDHHmmss"),
        recipient_id: nik,
        recipient_name: nama,
        invoice_date: null,
        expiration_date: null,
        bank_name: null,
        virtual_account: null,
        payment_status: null,
        total_amount: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
