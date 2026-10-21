/**
 * Backward compatibility wrapper
 * Semua fungsi telah di-refactor ke sub-modul di folder ./manual/ dan ../../middleware/
 */
export { uploadPaymentProofMiddleware } from "../../middleware/uploadPaymentProof.js";
export {
  getCooperativeBankAccounts,
  submitManualPayment,
  verifyManualPayment,
  getPendingVerificationPayments,
} from "./manual/index.js";
