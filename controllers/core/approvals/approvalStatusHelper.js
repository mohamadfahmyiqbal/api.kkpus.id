// PATH: controllers/core/approvals/approvalStatusHelper.js

import db from "../../../models/index.js";

const { ApprovalStatus } = db;

export const resolveStatusValue = async (finalStatusValue, statusField, transaction) => {
  if (!finalStatusValue) return null;

  const statusNameMap = {
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
    IN_PROGRESS: "Sedang Diproses",
  };

  const statusName = statusNameMap[finalStatusValue];
  if (statusName) {
    const statusRecord = await ApprovalStatus.findOne({
      where: { status_name: statusName },
      transaction,
    });
    return statusRecord ? statusRecord.status_code : finalStatusValue;
  }
  return finalStatusValue;
};
