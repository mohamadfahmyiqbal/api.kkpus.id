import {
  handleMemberFinalAction,
  handleFinancingFinalAction,
  handleSavingsWithdrawalFinalAction,
  handleSavingTargetFinalAction,
  handleExitRequestFinalAction,
} from "./handlers/index.js";

/**
 * Registry of final action handlers mapped by entityRef
 */
const ACTION_HANDLERS = {
  members: handleMemberFinalAction,
  financing_applications: handleFinancingFinalAction,
  savings_withdrawal: handleSavingsWithdrawalFinalAction,
  tabungan_withdrawals: handleSavingsWithdrawalFinalAction,
  member_saving_targets: handleSavingTargetFinalAction,
  exit_requests: handleExitRequestFinalAction,
};

/**
 * Execute final action when an entity reaches approved status.
 *
 * @param {Object} params
 * @param {string} params.entityRef - Type of entity ('members', 'financing_applications', etc.)
 * @param {Object} params.entity - The entity model instance
 * @param {Object} params.transaction - Sequelize transaction
 * @param {string|number} params.approverId - ID of user approving the request
 */
export const performFinalAction = async ({ entityRef, entity, transaction: t, approverId }) => {
  console.log("[performFinalAction] CALLED with entityRef:", entityRef);

  const handler = ACTION_HANDLERS[entityRef];
  if (!handler) {
    console.log(`⚠️ Info: No action for entity: ${entityRef}`);
    return;
  }

  await handler({ entity, transaction: t, approverId, entityRef });
};