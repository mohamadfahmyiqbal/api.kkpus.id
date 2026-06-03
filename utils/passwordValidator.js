// utils/passwordValidator.js
import { AUTH_CONSTANTS } from '../constants/authConstants.js';

/**
 * Validate password strength and complexity
 */
export const validatePassword = (password) => {
  const errors = [];
  
  // Length validation
  if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
    errors.push(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }
  
  if (password.length > AUTH_CONSTANTS.PASSWORD_MAX_LENGTH) {
    errors.push(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_LONG);
  }
  
  // Complexity validation
  if (AUTH_CONSTANTS.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_MISSING_UPPERCASE);
  }
  
  if (AUTH_CONSTANTS.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_MISSING_LOWERCASE);
  }
  
  if (AUTH_CONSTANTS.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_MISSING_NUMBERS);
  }
  
  if (AUTH_CONSTANTS.PASSWORD_REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_MISSING_SPECIAL);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength score (0-100)
 */
export const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  // Length contribution (40%)
  if (password.length >= AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
    strength += Math.min(40, (password.length / AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) * 20);
  }
  
  // Character variety contribution (60%)
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
  
  return Math.min(100, strength);
};

/**
 * Check if password meets minimum requirements
 */
export const isPasswordValid = (password) => {
  const validation = validatePassword(password);
  return validation.isValid;
};
