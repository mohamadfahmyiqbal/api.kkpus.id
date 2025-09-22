// models/index.js

import pus from "../config/pus.js";
import MAnggota from "./anggota/MAnggota.js";
import MAnggotaDetail from "./anggota/MAnggotaDetail.js";
import MApproval from "./approval/MApproval.js";
import MApprovalFlow from "./approval/MApprovalFlow.js";
import MApprovalRequest from "./approval/MApprovalRequest.js";
import MAnggotaBank from "./anggota/MAnggotaBank.js"; // import model bank
import MAnggotaJob from "./anggota/MAnggotaJob.js";
import MRequest from "./transaksi/MRequest.js";
import MAnggotaCategory from "./anggota/MAnggotaCategory.js";
import MPaymentRules from "./payment/MPaymentRules.js";
import MInvoices from "./payment/MInvoices.js";
import MInvoices_detail from "./payment/MInvoices_detail.js";

// Relasi: Satu MRequest berelasi dengan satu MAnggota (requester)
MRequest.belongsTo(MAnggota, {
  foreignKey: "nik",
  targetKey: "nik",
  as: "anggota",
});
MAnggota.hasMany(MRequest, {
  foreignKey: "nik",
  sourceKey: "nik",
  as: "requests",
});

// Relasi: Satu MRequest berelasi dengan satu MAnggotaCategory
MRequest.belongsTo(MAnggotaCategory, {
  foreignKey: "tipe_anggota",
  targetKey: "id",
  as: "categoryAnggota",
});
MAnggotaCategory.hasMany(MRequest, {
  foreignKey: "tipe_anggota",
  sourceKey: "id",
  as: "requests",
});

MRequest.hasMany(MPaymentRules, {
  foreignKey: "type", // kolom di MPaymentRules
  sourceKey: "tipe_request", // kolom di MRequest
  as: "paymentRules",
  scope: {
    tipe_anggota: {
      [pus.Sequelize.Op.ne]: null,
    },
  },
});

MPaymentRules.belongsTo(MRequest, {
  foreignKey: "type", // kolom di MPaymentRules
  targetKey: "tipe_request", // kolom di MRequest
  as: "request",
  scope: {
    tipe_anggota: {
      [pus.Sequelize.Op.ne]: null,
    },
  },
});

// Relasi: Satu MRequest bisa punya banyak MApprovalRequest
MRequest.hasMany(MApprovalRequest, {
  foreignKey: "token",
  sourceKey: "token",
  as: "RequestApproval",
});
MApprovalRequest.belongsTo(MRequest, {
  foreignKey: "token",
  sourceKey: "token",
  as: "ApprovalRequest",
});
// Relasi: MApprovalRequest dengan MAnggota sebagai requester
MApprovalRequest.belongsTo(MAnggota, {
  foreignKey: "requester_id",
  as: "requesterAnggota",
});
MAnggota.hasMany(MApprovalRequest, {
  foreignKey: "requester_id",
  as: "requestsApproval",
});

// Relasi: MApprovalRequest dengan MAnggota sebagai approver
MApprovalRequest.belongsTo(MAnggota, {
  foreignKey: "approver",
  as: "approverAnggota",
});
MAnggota.hasMany(MApprovalRequest, {
  foreignKey: "approver",
  as: "approvalsToReview",
});

// Relasi: Satu MAnggota punya satu MAnggotaDetail
MAnggota.hasOne(MAnggotaDetail, {
  foreignKey: "token",
  sourceKey: "nik",
  as: "detail",
});
MAnggotaDetail.belongsTo(MAnggota, {
  foreignKey: "token",
  sourceKey: "nik",
  as: "anggota",
});

// Relasi: Satu MAnggota punya banyak MAnggotaBank
MAnggota.hasMany(MAnggotaBank, {
  foreignKey: "token",
  sourceKey: "nik",
  as: "bank",
});
MAnggotaBank.belongsTo(MAnggota, {
  foreignKey: "token",
  targetKey: "nik",
  as: "anggota",
});

// Relasi: Satu MAnggota punya banyak MAnggotaJob
MAnggota.hasMany(MAnggotaJob, {
  foreignKey: "token",
  sourceKey: "nik",
  as: "job",
});
MAnggotaJob.belongsTo(MAnggota, {
  foreignKey: "token",
  targetKey: "nik",
  as: "anggota",
});

// Relasi: Satu MAnggota punya satu MAnggotaCategory
MAnggota.belongsTo(MAnggotaCategory, {
  foreignKey: "roles",
  sourceKey: "id",
  as: "categoryAnggota",
});
MAnggotaCategory.hasMany(MAnggota, {
  foreignKey: "roles",
  sourceKey: "id",
  as: "anggota",
});

MInvoices.hasMany(MInvoices_detail, {
  foreignKey: "invoice_id",
  sourceKey: "invoice_id",
  as: "detailsInvoice",
});
MInvoices_detail.belongsTo(MInvoices, {
  foreignKey: "invoice_id",
  targetKey: "invoice_id",
  as: "invoiceDetails",
});

//
// Export semua model
//
export {
  pus,
  MAnggota,
  MAnggotaDetail,
  MApproval,
  MApprovalFlow,
  MApprovalRequest,
  MAnggotaBank,
  MAnggotaJob,
  MRequest,
};

export default {
  pus,
  MAnggota,
  MAnggotaDetail,
  MApproval,
  MApprovalFlow,
  MApprovalRequest,
  MAnggotaBank,
  MAnggotaJob,
  MRequest,
};
