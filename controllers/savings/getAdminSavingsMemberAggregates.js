import db from "../../models/index.js";
import { Op } from "sequelize";

export const getAdminSavingsMemberAggregates = async (req, res) => {
  try {
    const {
      type = "POKOK",
      search = "",
      page = 1,
      limit = 10,
      sortBy = "name",
      sortDir = "asc",
    } = req.query;

    const savType = (type || "POKOK").toUpperCase();
    const biCategory = savType === "POKOK" ? "SW_POKOK" : "SW_WAJIB";

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    // 1. Ambil transaksi dari tabel db.Savings
    const savings = await db.Savings.findAll({
      where: { savings_type: savType },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["member_id", "member_no", "full_name"],
          required: true,
        },
      ],
      order: [["transaction_date", "DESC"], ["created_at", "DESC"]],
    });

    // 2. Ambil tagihan simpanan dari db.BillItem
    const billItems = await db.BillItem.findAll({
      where: {
        [Op.or]: [
          { category_code: biCategory },
          { description: { [Op.like]: `%${savType}%` } },
        ],
      },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["member_id", "member_no", "full_name"],
          required: true,
        },
      ],
      order: [["due_date", "DESC"], ["created_at", "DESC"]],
    });

    // 3. Ambil transaksi dari db.Transaction (Billing / Midtrans / Manual)
    const transactions = await db.Transaction.findAll({
      where: {
        tx_category: { [Op.like]: `%${savType}%` },
      },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["member_id", "member_no", "full_name"],
          required: true,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Map untuk agregasi per anggota
    const memberMap = new Map();

    const getOrCreate = (mem) => {
      if (!memberMap.has(mem.member_id)) {
        memberMap.set(mem.member_id, {
          member_id: mem.member_id,
          member_no: mem.member_no || "-",
          full_name: mem.full_name || "Anggota",
          total_count: 0,
          total_amount: 0,
          paid_count: 0,
          paid_amount: 0,
          unpaid_count: 0,
          unpaid_amount: 0,
          transactions: [],
        });
      }
      return memberMap.get(mem.member_id);
    };

    // Hindari duplikasi antara Savings, Transaction, dan BillItem
    const processedBillIds = new Set();
    const recordedTxKeys = new Set();

    // 1. Prioritaskan data Transaction (transaksi pembayaran nyata / hasil import)
    for (const t of transactions) {
      if (!t.member) continue;
      if (t.bill_id) processedBillIds.add(t.bill_id);
      const m = getOrCreate(t.member);
      const amt = parseFloat(t.amount) || 0;
      const isPaid = ["PAID", "COMPLETED", "SETTLED", "APPROVED"].includes(
        (t.status || "").toUpperCase()
      );

      // Record key untuk deduplikasi terhadap tabel Savings
      const tDate = t.created_at ? new Date(t.created_at).toISOString().split("T")[0] : "";
      recordedTxKeys.add(`${t.member_id}_${amt}_${tDate}`);
      recordedTxKeys.add(`${t.member_id}_${amt}`);

      m.total_count += 1;
      m.total_amount += amt;
      if (isPaid) {
        m.paid_count += 1;
        m.paid_amount += amt;
      } else {
        m.unpaid_count += 1;
        m.unpaid_amount += amt;
      }

      m.transactions.push({
        id: t.transaction_id,
        source: "transaction",
        date: t.created_at,
        type: "Setoran",
        product_name: `Simpanan ${savType === "POKOK" ? "Pokok" : "Wajib"}`,
        description: t.admin_note || "Pembayaran Tagihan Simpanan",
        amount: amt,
        status: isPaid ? "Selesai" : t.status || "Menunggu Pembayaran",
        raw_status: t.status,
        proof_of_transfer: t.proof_of_transfer,
        sender_name: t.sender_name,
        sender_bank: t.sender_bank,
        is_paid: isPaid,
      });
    }

    // 2. Proses data Savings (hanya yang belum tercatat di Transaction)
    for (const s of savings) {
      if (!s.member) continue;
      const amt = parseFloat(s.amount) || 0;
      const sDate = s.transaction_date || (s.created_at ? new Date(s.created_at).toISOString().split("T")[0] : "");
      
      // Jika transaksi ini sudah tercatat via Transaction (misal auto-repair / billing), lewati agar tidak dobel
      if (recordedTxKeys.has(`${s.member_id}_${amt}_${sDate}`) || recordedTxKeys.has(`${s.member_id}_${amt}`)) {
        continue;
      }

      const m = getOrCreate(s.member);
      const isPaid = ["COMPLETED", "APPROVED", "PAID", "SELESAI"].includes(
        (s.status || "").toUpperCase()
      );

      m.total_count += 1;
      m.total_amount += amt;
      if (isPaid) {
        m.paid_count += 1;
        m.paid_amount += amt;
      } else {
        m.unpaid_count += 1;
        m.unpaid_amount += amt;
      }

      m.transactions.push({
        id: s.savings_id,
        source: "savings",
        date: s.transaction_date || s.created_at,
        type: "Setoran",
        product_name: `Simpanan ${savType === "POKOK" ? "Pokok" : "Wajib"}`,
        description: s.description || "Setoran Simpanan",
        amount: amt,
        status: isPaid ? "Selesai" : s.status || "Pending",
        raw_status: s.status,
        is_paid: isPaid,
      });
    }

    // 3. Proses data BillItem (hanya tagihan yang belum dibayar / belum masuk transaksi)
    for (const b of billItems) {
      if (!b.member) continue;
      if (b.bill_id && processedBillIds.has(b.bill_id)) continue;

      const m = getOrCreate(b.member);
      const amt = parseFloat(b.amount) || 0;
      const isPaid = (b.status || "").toUpperCase() === "PAID";

      m.total_count += 1;
      m.total_amount += amt;
      if (isPaid) {
        m.paid_count += 1;
        m.paid_amount += amt;
      } else {
        m.unpaid_count += 1;
        m.unpaid_amount += amt;
      }

      m.transactions.push({
        id: b.bill_item_id,
        source: "bill_item",
        date: b.due_date || b.created_at,
        type: "Tagihan",
        product_name: `Simpanan ${savType === "POKOK" ? "Pokok" : "Wajib"}`,
        description: b.description || "Tagihan Simpanan",
        amount: amt,
        status: isPaid ? "Selesai" : "Belum Terbayar",
        raw_status: b.status,
        is_paid: isPaid,
      });
    }

    // Convert map ke array
    let allMembers = Array.from(memberMap.values());

    // Filter pencarian
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allMembers = allMembers.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.member_no.toLowerCase().includes(q)
      );
    }

    // Ringkasan global untuk semua anggota hasil filter
    const summary = allMembers.reduce(
      (acc, m) => {
        acc.total_members += 1;
        acc.total_transactions += m.total_count;
        acc.total_nominal += m.total_amount;
        acc.total_paid_count += m.paid_count;
        acc.total_paid_nominal += m.paid_amount;
        acc.total_unpaid_count += m.unpaid_count;
        acc.total_unpaid_nominal += m.unpaid_amount;
        return acc;
      },
      {
        total_members: 0,
        total_transactions: 0,
        total_nominal: 0,
        total_paid_count: 0,
        total_paid_nominal: 0,
        total_unpaid_count: 0,
        total_unpaid_nominal: 0,
      }
    );

    // Sorting
    allMembers.sort((a, b) => {
      let valA = a.full_name;
      let valB = b.full_name;

      if (sortBy === "member_no") {
        valA = a.member_no;
        valB = b.member_no;
      } else if (sortBy === "total_count") {
        valA = a.total_count;
        valB = b.total_count;
      } else if (sortBy === "total_amount") {
        valA = a.total_amount;
        valB = b.total_amount;
      } else if (sortBy === "paid_amount") {
        valA = a.paid_amount;
        valB = b.paid_amount;
      } else if (sortBy === "unpaid_amount") {
        valA = a.unpaid_amount;
        valB = b.unpaid_amount;
      }

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = (valB || "").toLowerCase();
        return sortDir === "desc"
          ? valB.localeCompare(valA)
          : valA.localeCompare(valB);
      }

      return sortDir === "desc" ? valB - valA : valA - valB;
    });

    const totalRecords = allMembers.length;
    const paginatedMembers = allMembers.slice(offset, offset + limitNum);

    // Urutkan transaksi internal tiap anggota descending berdasarkan tanggal
    paginatedMembers.forEach((m) => {
      m.transactions.sort(
        (t1, t2) => new Date(t2.date || 0) - new Date(t1.date || 0)
      );
    });

    return res.status(200).json({
      status: true,
      message: "Data agregat simpanan anggota berhasil diambil",
      data: {
        members: paginatedMembers,
        summary,
        pagination: {
          current_page: pageNum,
          total_pages: Math.ceil(totalRecords / limitNum),
          total_records: totalRecords,
          per_page: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Error getAdminSavingsMemberAggregates:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem.",
    });
  }
};
