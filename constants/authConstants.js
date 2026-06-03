// constants/authConstants.js

// Password Validation
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// Password Complexity Requirements
const PASSWORD_REQUIRE_UPPERCASE = true;
const PASSWORD_REQUIRE_LOWERCASE = true;
const PASSWORD_REQUIRE_NUMBERS = true;
const PASSWORD_REQUIRE_SPECIAL_CHARS = false;

// Token Expiry (minutes)
const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 30;

// Rate Limiting
const MAX_OTP_ATTEMPTS = 3;
const MAX_RESET_ATTEMPTS = 5;

export const AUTH_CONSTANTS = {
  // Password Validation
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  
  // Password Complexity Requirements
  PASSWORD_REQUIRE_UPPERCASE,
  PASSWORD_REQUIRE_LOWERCASE,
  PASSWORD_REQUIRE_NUMBERS,
  PASSWORD_REQUIRE_SPECIAL_CHARS,
  
  // Token Expiry (minutes)
  OTP_EXPIRY_MINUTES,
  RESET_TOKEN_EXPIRY_MINUTES,
  
  // Rate Limiting
  MAX_OTP_ATTEMPTS,
  MAX_RESET_ATTEMPTS,
  
  // Messages
  ERROR_MESSAGES: {
    PASSWORD_TOO_SHORT: `Password minimal ${PASSWORD_MIN_LENGTH} karakter`,
    PASSWORD_TOO_LONG: `Password maksimal ${PASSWORD_MAX_LENGTH} karakter`,
    PASSWORD_MISSING_UPPERCASE: "Password harus mengandung huruf besar",
    PASSWORD_MISSING_LOWERCASE: "Password harus mengandung huruf kecil", 
    PASSWORD_MISSING_NUMBERS: "Password harus mengandung angka",
    PASSWORD_MISSING_SPECIAL: "Password harus mengandung karakter spesial",
    PASSWORD_INVALID: "Password tidak memenuhi syarat keamanan",
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    PASSWORD_RESET: "Password berhasil direset",
    OTP_SENT: "OTP berhasil dikirim",
    OTP_VERIFIED: "OTP berhasil diverifikasi",
  }
};
