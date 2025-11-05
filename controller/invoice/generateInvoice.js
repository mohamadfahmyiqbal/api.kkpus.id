import moment from "moment";
import MInvoices from "../../models/payment/MInvoices.js";
import MInvoices_detail from "../../models/payment/MInvoices_detail.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { cekInvoiceByToken } from "./cekInvoiceByToken.js";
import { getRequestByToken } from "../request/getRequestByToken.js";
import { getPaymentRules } from "../payment/getPaymentRules.js";
import { generateMonthIndo } from "../utils/generateMonthIndo.js";

export const generateInvoice = async (req, res) => {
  try {
    const { ret, type, token } = req.body;

    if (!token || !type) {
      const result = { message: "Token dan type wajib diisi" };
      return ret === "ret" ? result : res.status(400).json(result);
    }

    // Cek apakah invoice sudah ada
    const cekInv = await cekInvoiceByToken({ body: { ret, token } });
    if (cekInv) {
      const result = { message: "Invoice sudah ada", data: cekInv };
      return ret === "ret" ? result : res.status(200).json(result);
    }

    // Ambil request terkait token
    const getRequest = await getRequestByToken({ body: { ret, token } });
    if (!getRequest) {
      const result = { message: "Request tidak ditemukan" };
      return ret === "ret" ? result : res.status(404).json(result);
    }

    // Ambil aturan pembayaran utama
    const payRules = await getPaymentRules({
      body: {
        ret,
        tipe_anggota: getRequest.categoryAnggota?.nama,
        type: getRequest.tipe_request,
      },
    });

    if (!payRules) {
      const result = { message: "Aturan pembayaran tidak ditemukan" };
      return ret === "ret" ? result : res.status(404).json(result);
    }

    let setTransArray = [];
    let setInvDetail = [];
    let payment_desc = "";

    // Jika request adalah pendaftaran anggota tipe 3
    if (
      getRequest.tipe_request === "pendaftaran_anggota" &&
      getRequest.tipe_anggota === 3
    ) {
      const payRulesMonthly = await getPaymentRules({
        body: {
          ret,
          tipe_anggota: getRequest.categoryAnggota?.nama,
          type: "payment_anggota",
        },
      });

      if (!payRulesMonthly) {
        const result = { message: "Aturan pembayaran bulanan tidak ditemukan" };
        return ret === "ret" ? result : res.status(404).json(result);
      }

      const currentMonth = moment().month() + 1;

      for (let month = currentMonth; month <= 12; month++) {
        const isCurrentMonth = month === currentMonth;

        // Transaksi MTrans
        setTransArray.push({
          type: "Setor",
          jenis: `Simpanan Wajib`,
          name: `Pembayaran Simpanan Wajib Bulan ${generateMonthIndo(month)}`,
          nik: getRequest.nik,
          token: isCurrentMonth ? token : null,
          orderId: null,
          jumlah: payRulesMonthly.ammount,
          batch: null,
          payment_status: "Menunggu Pembayaran",
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

        // Detail invoice untuk bulan pertama saja
        if (isCurrentMonth) {
          setInvDetail.push({
            ret,
            invoice_id: getRequest.token,
            name: `Pembayaran Simpanan Wajib Bulan ${generateMonthIndo(month)}`,
            ammount: payRulesMonthly.ammount,
          });
        }
      }

      payment_desc = `Pembayaran Pendaftaran ${getRequest.categoryAnggota?.nama}`;
    }

    // Tambahkan transaksi dari payRules utama
    const rulesArray = Array.isArray(payRules) ? payRules : [payRules];
    for (const rule of rulesArray) {
      // Detail invoice
      setInvDetail.push({
        ret,
        invoice_id: getRequest.token,
        name: rule.name || `Pembayaran ${getRequest.tipe_request}`,
        ammount: rule.ammount,
      });

      // Transaksi MTrans
      setTransArray.push({
        type: "Setor",
        jenis: rule.name,
        name: `Pembayaran ${getRequest.tipe_request}`,
        nik: getRequest.nik,
        token: token,
        orderId: null,
        jumlah: rule.ammount,
        batch: null,
        payment_status: "Menunggu Pembayaran",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
    }

    const total_amount = setInvDetail.reduce(
      (sum, item) => sum + item.ammount,
      0
    );

    // Data invoice
    const invoiceData = {
      invoice_id: getRequest.token,
      recipient_id: getRequest.anggota?.nik,
      recipient_name: getRequest.anggota?.nama,
      invoice_date: moment().format("YYYY-MM-DD"),
      jenis_trans: type,
      expiration_date: moment().add(1, "month").format("YYYY-MM-DD"),
      total_amount,
      payment_status: "Menunggu Pembayaran",
      type_trans: "Setor",
      payment_desc,
    };

    // Buat invoice
    const newInvoice = await MInvoices.create(invoiceData);

    // Buat detail invoice
    if (setInvDetail.length > 0) {
      await MInvoices_detail.bulkCreate(
        setInvDetail.map((detail) => ({
          ...detail,
          invoice_id: newInvoice.invoice_id,
        }))
      );
    }

    // Buat transaksi MTrans
    if (setTransArray.length > 0) {
      await MTrans.bulkCreate(setTransArray);
    }

    const result = {
      message: "Invoice berhasil dibuat",
      invoice: newInvoice,
      transaksi: setTransArray,
      details: setInvDetail,
    };

    return ret === "ret" ? result : res.status(201).json(result);
  } catch (error) {
    console.error("Error generateInvoice:", error);
    const result = { message: "Terjadi kesalahan server" };
    return req.body.ret === "ret" ? result : res.status(500).json(result);
  }
};
