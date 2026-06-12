import db from "../../models/index.js";
import { sendToUser } from "../../utils/socket.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";

/**
 * PUT /api/approvals/sukuk/approve/:entityId
 * Body: { action: 'approve' | 'reject', notes?: string }
 */
const approveSukukOrder = async (req, res) => {
  try {
    const { entityId } = req.params;
    const { action, notes } = req.body;

    if (!req.roles || req.roles.length === 0) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    // Ambil role yang relevan untuk approval (bisa ada lebih dari 1 role, kita ambil salah satu)
    const validRoles = ["PENGAWAS", "KETUA", "BENDAHARA"];
    const role = req.roles.find(r => validRoles.includes(r));

    if (!role) {
      return res.status(403).json({ success: false, message: "Akses ditolak. Bukan role yang berwenang." });
    }

    if (action !== "approve" && action !== "reject") {
      return res.status(400).json({ success: false, message: "action harus 'approve' atau 'reject'" });
    }

    const order = await db.SukukOrder.findOne({ where: { order_id: entityId } });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    }

    if (action === "reject") {
      await order.update({
        status: "REJECTED",
        rejected_reason: notes || null,
      });
      
      // Kirim Notifikasi Penolakan
      sendToUser(order.member_id, "TRANSACTION_UPDATED", {
        entityId: order.order_id,
        entityRef: "sukuk_orders",
        status: "REJECTED",
        trigger: true
      });
      
      await sendGlobalNotification({
        memberId: order.member_id,
        title: "Pemesanan Sukuk Ditolak",
        content: `Pemesanan sukuk Anda ditolak. Alasan: ${notes || "Tidak memenuhi syarat."}`,
        type: "APPROVAL",
        url: "/"
      });
      
      return res.json({ success: true, message: "Order ditolak" });
    }

    // Approval
    const colMap = {
      PENGAWAS: "is_approved_pengawas",
      KETUA: "is_approved_ketua",
      BENDAHARA: "is_approved_bendahara",
    };
    await order.update({ [colMap[role]]: true });

    // Reload to check if all 3 approved
    await order.reload();
    let isFullyApproved = false;
    let createdBill = null;
    
    if (order.is_approved_pengawas && order.is_approved_ketua && order.is_approved_bendahara) {
      await order.update({ status: "READY_TO_PAY" }); // Ganti status ke READY_TO_PAY agar user bayar
      isFullyApproved = true;

      // Buat jenis tagihan Sukuk jika belum ada
      const [sukukBillType] = await db.BillType.findOrCreate({
        where: { type_code: 'SUKUK_INVESTMENT' },
        defaults: {
          tx_type: 'SETORAN',
          category_map: 'INVESTMENT',
          type_name: 'Pembelian Sukuk',
          period_type: 'ONE_TIME',
          default_amount: 0
        }
      });

      // Buat tagihan untuk order sukuk ini
      createdBill = await db.BillItem.create({
        bill_type_id: sukukBillType.bill_type_id,
        category_code: 'SUKUK_INVESTMENT',
        bill_id: null,
        member_id: order.member_id,
        description: `Pembelian Sukuk (Order #${order.order_id})`,
        amount: order.amount,
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 Hari
        status: 'UNPAID'
      });
    }

    // Kirim Notifikasi Socket (Biar UI Frontend Refresh Otomatis)
    sendToUser(order.member_id, "TRANSACTION_UPDATED", {
      entityId: order.order_id,
      entityRef: "sukuk_orders",
      status: order.status,
      trigger: true,
      newBillId: createdBill?.bill_item_id
    });

    // Kirim Push Notification
    const title = isFullyApproved ? "Pemesanan Sukuk Disetujui" : "Update Persetujuan Sukuk";
    const content = isFullyApproved 
      ? "Pemesanan sukuk Anda telah disetujui sepenuhnya oleh seluruh pengurus."
      : `Langkah persetujuan oleh ${role} telah berhasil. Menunggu verifikasi lainnya.`;

    await sendGlobalNotification({
      memberId: order.member_id,
      title,
      content,
      type: "APPROVAL",
      url: "/"
    });

    return res.json({ success: true, message: `Disetujui oleh ${role}`, data: order });
  } catch (error) {
    console.error("approveSukukOrder error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default approveSukukOrder;
