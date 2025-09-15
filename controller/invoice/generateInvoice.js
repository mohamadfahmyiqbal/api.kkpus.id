import moment from "moment";
import pus from "../../config/pus.js";
import MInvoices from "../../models/payment/MInvoices.js";
import MRequest from "../../models/transaksi/MRequest.js";
import MInvoices_detail from "../../models/payment/MInvoices_detail.js";
import { cekTransByToken } from "../transactions/cekTransByToken.js";
import { getRequestByToken } from "../request/getRequestByToken.js";
import { getPaymentRules } from "../payment/getPaymentRules.js";
import { cekInvoiceByToken } from "./cekInvoiceByToken.js";

export const generateInvoice = async (req, res) => {
  const { type, token } = req.body;

  if (type !== "pendaftaran_anggota") {
    return res.status(400).json({
      success: false,
      message: "Jenis invoice tidak dikenali",
    });
  }

  const t = await pus.transaction();

  try {
    const cekTrans = await cekTransByToken({
      body: { ret: "ret", token },
    });
    if (cekTrans) {
      return res.status(400).json({
        success: false,
        message: "Transaksi sudah ada",
      });
    }
    const cekInv = await cekInvoiceByToken({
      body: { ret: "ret", token },
    });

    if (!cekInv) {
      const getRequest = await getRequestByToken({
        body: { ret: "ret", token },
      });
      if (!getRequest) {
        return res.status(404).json({
          success: false,
          message: "Data request tidak ditemukan",
        });
      }

      const getRules = await getPaymentRules({
        body: {
          ret: "ret",
          tipe_anggota: getRequest.categoryAnggota.nama,
          type: getRequest.tipe_request,
        },
      });

      if (!getRules || getRules.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aturan pembayaran tidak ditemukan",
        });
      }

      const totalAmount = getRules.reduce(
        (acc, curr) => acc + (parseFloat(curr.ammount) || 0),
        0
      );

      const detailData = getRules.map((rule) => ({
        invoice_id: getRequest.token,
        name: `Pembayaran ${rule.name}`,
        ammount: rule.ammount,
      }));

      const invoiceData = {
        invoice_id: getRequest.token,
        recipient_id: getRequest.anggota.nik,
        recipient_name: getRequest.anggota.nama,
        invoice_date: moment().format("YYYY-MM-DD"),
        expiration_date: moment().add(1, "month").format("YYYY-MM-DD"),
        paymentDetails: detailData,
        total_amount: totalAmount,
        payment_status: "Menunggu Pembayaran",
        type_trans: "Setor",
        payment_desc: `Pembayaran Pendaftaran ${getRequest.categoryAnggota.nama}`,
      };
      console.log(invoiceData);

      // const saveInv = await MInvoices.create(invoiceData, { transaction: t });
      // if (!saveInv) {
      //   await t.rollback();
      //   return res.status(500).json({
      //     success: false,
      //     message: "Gagal menyimpan invoice",
      //   });
      // }

      // const saveInvDetail = await MInvoices_detail.bulkCreate(detailData, {
      //   transaction: t,
      // });
      // if (!saveInvDetail) {
      //   await t.rollback();
      //   return res.status(500).json({
      //     success: false,
      //     message: "Gagal menyimpan detail invoice",
      //   });
      // }

      // await t.commit();

      // return res.status(200).json({
      //   success: true,
      //   message: "Invoice berhasil dibuat",
      //   data: invoiceData,
      // });
    } else {
      console.log(cekInv);
    }
  } catch (error) {
    await t.rollback();
    console.error("Error generate invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat invoice",
      error: error.message,
    });
  }
};
