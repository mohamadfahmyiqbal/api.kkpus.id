// models/index.js

import pus from "../config/pus.js";
import MAnggota from "./anggota/MAnggota.js";
import MAnggotaDetail from "./anggota/MAnggotaDetail.js";
import MApproval from "./approval/MApproval.js";
import MApprovalFlow from "./approval/MApprovalFlow.js";
import MApprovalRequest from "./approval/MApprovalRequest.js";
import MAnggotaBank from "./anggota/MAnggotaBank.js"; // import model bank
import MAnggotaJob from "./anggota/MAnggotaJob.js";
import MAnggotaReq from "./anggota/MAnggotaReq.js";
import MAnggotaCategory from "./anggota/MAnggotaCategory.js";

//
// 1) Anggota ↔ ApprovalRequest
//
MApprovalRequest.belongsTo(MAnggota, {
  foreignKey: "requester_id",
  targetKey: "nik",
  as: "requester",
});
MAnggota.hasMany(MApprovalRequest, {
  foreignKey: "requester_id",
  sourceKey: "nik",
  as: "requests",
});

//
// 2) Anggota ↔ ApprovalFlow (approver)
//
MApprovalFlow.belongsTo(MAnggota, {
  foreignKey: "approver_id",
  targetKey: "nik",
  as: "approver",
});
MAnggota.hasMany(MApprovalFlow, {
  foreignKey: "approver_id",
  sourceKey: "nik",
  as: "approvalFlows",
});

//
// 3) ApprovalRequest ↔ ApprovalFlow (One-to-One berdasarkan type)
//
MApprovalRequest.hasOne(MApprovalFlow, {
  foreignKey: "level",
  sourceKey: "flow",
  as: "flows",
});
MApprovalFlow.belongsTo(MApprovalRequest, {
  foreignKey: "level",
  targetKey: "flow",
  as: "requestType",
});

// Relasi One-to-One antara MApprovalRequest dan MApproval
MApprovalRequest.hasOne(MApproval, {
  foreignKey: "level",
  sourceKey: "flow",
  as: "approval",
});
MApproval.belongsTo(MApprovalRequest, {
  foreignKey: "level",
  targetKey: "flow",
  as: "request",
});

// Relasi One-to-One antara MApprovalFlow dan MAnggota (setiap flow punya satu anggota sebagai approver detail)
MApprovalFlow.hasOne(MAnggota, {
  foreignKey: "nik",
  sourceKey: "approver_id",
  as: "approverDetail",
  constraints: false,
});
MAnggota.belongsTo(MApprovalFlow, {
  foreignKey: "nik",
  targetKey: "approver_id",
  as: "approvalFlowDetail",
  constraints: false,
});

//
// 4) Approval ↔ Anggota (approver)
//
MApproval.belongsTo(MAnggota, {
  foreignKey: "nik", // MApproval.nik mengacu ke MAnggota.nik
  targetKey: "nik",
  as: "approver",
});
MAnggota.hasMany(MApproval, {
  foreignKey: "nik", // MApproval.nik mengacu ke MAnggota.nik
  sourceKey: "nik",
  as: "approvals",
});

//
// 5) Approval ↔ ApprovalFlow (berdasarkan approver_id)
//
MApprovalFlow.hasMany(MApproval, {
  foreignKey: "approver_id",
  sourceKey: "approver_id",
  as: "approvals",
  constraints: false,
});
MApproval.belongsTo(MApprovalFlow, {
  foreignKey: "approver_id",
  targetKey: "approver_id",
  as: "flow",
  constraints: false,
});

//
// 6) Anggota ↔ AnggotaDetail (One-to-One)
//
MAnggota.hasOne(MAnggotaDetail, {
  foreignKey: "token", // field di MAnggotaDetail
  sourceKey: "nik", // field di MAnggota
  as: "detail",
  constraints: false, // set ke true kalau FK di DB
});
MAnggotaDetail.belongsTo(MAnggota, {
  foreignKey: "token",
  targetKey: "nik",
  as: "anggota",
  constraints: false,
});

//
// 7) Anggota ↔ AnggotaBank (One-to-One)
//
MAnggota.hasOne(MAnggotaBank, {
  foreignKey: "token", // field di MAnggotaBank
  sourceKey: "nik", // field di MAnggota
  as: "bank",
  constraints: false,
});
MAnggotaBank.belongsTo(MAnggota, {
  foreignKey: "token",
  targetKey: "nik",
  as: "anggota",
  constraints: false,
});

//
// 8) Anggota ↔ AnggotaJob (One-to-One)
//
MAnggota.hasOne(MAnggotaJob, {
  foreignKey: "token", // field di MAnggotaJob
  sourceKey: "nik", // field di MAnggota
  as: "job",
  constraints: false,
});
MAnggotaJob.belongsTo(MAnggota, {
  foreignKey: "token",
  targetKey: "nik",
  as: "anggota",
  constraints: false,
});

//
// 9) Anggota ↔ AnggotaReq (One-to-One)
//   Perbaikan: relasi harus menggunakan foreignKey "token" di MAnggotaReq ke "nik" di MAnggota
//
MAnggota.hasOne(MAnggotaReq, {
  foreignKey: "nik", // field di MAnggotaReq yang mengacu ke nik di MAnggota
  sourceKey: "nik",
  as: "req",
  constraints: false,
});
MAnggotaReq.belongsTo(MAnggota, {
  foreignKey: "nik",
  targetKey: "nik",
  as: "anggota",
  constraints: false,
});

//
// 10) Anggota ↔ AnggotaCategory (One-to-One)
//
MAnggota.hasOne(MAnggotaCategory, {
  foreignKey: "id", // field di MAnggotaCategory yang mengacu ke id kategori
  sourceKey: "roles", // field di MAnggota (pastikan field ini ada)
  as: "AnggotaRoles",
  constraints: false,
});
MAnggotaCategory.belongsTo(MAnggota, {
  foreignKey: "id",
  targetKey: "roles",
  as: "anggota",
  constraints: false,
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
  MAnggotaReq,
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
  MAnggotaReq,
};
