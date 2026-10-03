// models/associations.js
import defineMemberAssociations from "./associations/memberAssociations.js";
import defineBillingAssociations from "./associations/billingAssociations.js";
import defineSavingsAssociations from "./associations/savingsAssociations.js";
import defineFinancingAssociations from "./associations/financingAssociations.js";
import defineApprovalAssociations from "./associations/approvalAssociations.js";
import defineProgramAssociations from "./associations/programAssociations.js";

/**
 * Main association loader.
 * Modularized by domain for readability and maintainability (< 200 lines).
 */
export default function defineAssociations(db) {
  defineMemberAssociations(db);
  defineBillingAssociations(db);
  defineSavingsAssociations(db);
  defineFinancingAssociations(db);
  defineApprovalAssociations(db);
  defineProgramAssociations(db);
}
