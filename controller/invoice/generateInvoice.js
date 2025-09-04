import moment from "moment";
import MAnggotaReq from "../../models/transaksi/MRequest.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import MPaymentRules from "../../models/payment/MPaymentRules.js";

export const generateInvoice = async (req, res) => {
  const { type, token } = req.body;

  try {
    if (type === "pendaftaran_anggota") {
      const cekReq = await MAnggotaReq.findOne({
        where: {
          token,
        },
        include: [
          {
            association: "anggota",
            attributes: [
              "nik",
              "nama",
              "email",
              "no_tlp",
              "status_anggota",
              "roles",
            ],
            include: [
              {
                association: "bank",
              },
            ],
          },
        ],
        nest: true,
        raw: true,
      });
      console.log(cekReq);
      const data = {
        invoice_id: cekReq.token,
        recipient_id: cekReq.anggota.nik,
        recipient_name: cekReq.anggota.nama,
        invoice_date: moment().format("YYYY-MM-DD"),
        expiration_date: moment().add(1, "month").format("YYYY-MM-DD"),
        bank_name: cekReq.anggota.bank.bank,
        virtual_account: cekReq.anggota.nik,
        payment_status: "pending",
        total_amount: 0,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      console.log(data);
    }
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
};
