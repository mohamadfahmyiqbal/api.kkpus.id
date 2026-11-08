// PATH: utils/dataMasking.js
/**
 * Utility functions for Data Masking according to HIPAA Security Rule 
 * (45 CFR § 164.312 - Technical Safeguards: Access Control & Integrity)
 * and ISO/IEC 27001:2022 Control 8.11 (Data Masking)
 */

/**
 * Mask National ID (NIK / KTP)
 * Example: 3201234567890001 -> 3201********0001
 * Shows first 4 and last 4 characters, masks the rest
 */
export const maskNIK = (nik) => {
  if (!nik) return null;
  const str = String(nik).trim();
  if (str.length < 8) return "********";
  const start = str.slice(0, 4);
  const end = str.slice(-4);
  const maskedLength = Math.max(0, str.length - 8);
  return `${start}${"*".repeat(maskedLength)}${end}`;
};

/**
 * Mask Bank Account Number
 * Example: 1234567890 -> ******7890 or 8830192831 -> ******2831
 * Shows only the last 4 digits
 */
export const maskBankAccount = (accountNo) => {
  if (!accountNo) return null;
  const str = String(accountNo).trim();
  if (str.length <= 4) return "****";
  const end = str.slice(-4);
  const maskedLength = Math.max(0, str.length - 4);
  return `${"*".repeat(maskedLength)}${end}`;
};

/**
 * Mask Phone Number
 * Example: 081234567890 -> 0812****7890
 */
export const maskPhone = (phone) => {
  if (!phone) return null;
  const str = String(phone).trim();
  if (str.length < 8) return "********";
  const start = str.slice(0, 4);
  const end = str.slice(-4);
  const maskedLength = Math.max(0, str.length - 8);
  return `${start}${"*".repeat(maskedLength)}${end}`;
};

/**
 * Mask Email Address
 * Example: johndoe@example.com -> j***e@example.com
 */
export const maskEmail = (email) => {
  if (!email) return null;
  const str = String(email).trim();
  const atIndex = str.indexOf("@");
  if (atIndex <= 1) return str;
  const username = str.slice(0, atIndex);
  const domain = str.slice(atIndex);
  if (username.length <= 2) {
    return `${username[0]}*${domain}`;
  }
  const maskedUsername = `${username[0]}${"*".repeat(username.length - 2)}${username.slice(-1)}`;
  return `${maskedUsername}${domain}`;
};

/**
 * Dynamic Masking for Member Object
 * @param {Object} member - Raw member record or JSON
 * @param {Boolean} shouldMask - Whether dynamic masking is applied based on role privileges
 */
export const maskMemberData = (member, shouldMask = true) => {
  if (!member) return member;
  const obj = typeof member.toJSON === "function" ? member.toJSON() : { ...member };

  // Always strip sensitive authentication details
  delete obj.password_hash;

  if (!shouldMask) {
    return obj;
  }

  // Apply field-level masking
  if (obj.nik_ktp) obj.nik_ktp = maskNIK(obj.nik_ktp);
  if (obj.phone_number) obj.phone_number = maskPhone(obj.phone_number);
  if (obj.email) obj.email = maskEmail(obj.email);

  // Mask details in relations
  if (Array.isArray(obj.bankAccounts)) {
    obj.bankAccounts = obj.bankAccounts.map((b) => ({
      ...b,
      bank_account_no: maskBankAccount(b.bank_account_no),
    }));
  }

  if (Array.isArray(obj.emergencyContacts)) {
    obj.emergencyContacts = obj.emergencyContacts.map((c) => ({
      ...c,
      phone_number: maskPhone(c.phone_number),
    }));
  }

  return obj;
};

export default {
  maskNIK,
  maskBankAccount,
  maskPhone,
  maskEmail,
  maskMemberData,
};
