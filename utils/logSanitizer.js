// 📁 utils/logSanitizer.js
// Utility untuk mensanitasi data sensitif sebelum di-log

const SENSITIVE_KEYS = [
  'password',
  'password_hash',
  'token',
  'auth_token',
  'jwt',
  'secret',
  'nik_ktp',
  'ktp',
  'bank_account_no',
  'credit_card',
  'cvv',
  'pin',
  'api_key',
  'private_key',
  'access_token',
  'refresh_token',
];

/**
 * Sanitasi string atau objek untuk menghapus data sensitif
 * @param {any} data - Data yang akan disanitasi
 * @returns {any} Data yang sudah disanitasi
 */
export const sanitizeData = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle string
  if (typeof data === 'string') {
    // Mask email jika mengandung @
    if (data.includes('@') && data.includes('.')) {
      const parts = data.split('@');
      const name = parts[0];
      const domain = parts[1];
      const maskedName = name.length > 2 
        ? name.substring(0, 2) + '*'.repeat(name.length - 2)
        : '*'.repeat(name.length);
      return `${maskedName}@${domain}`;
    }
    
    // Mask phone number (pertahankan 4 digit terakhir)
    if (/^\+?[0-9]{10,15}$/.test(data.replace(/[-\s]/g, ''))) {
      const cleaned = data.replace(/[-\s]/g, '');
      const visible = cleaned.slice(-4);
      return '*'.repeat(cleaned.length - 4) + visible;
    }

    return data;
  }

  // Handle array
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  // Handle object
  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // Cek apakah key mengandung kata sensitif
      const isSensitive = SENSITIVE_KEYS.some(sensitiveKey => 
        lowerKey.includes(sensitiveKey)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else if (typeof value === 'string') {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return data;
};

/**
 * Sanitasi objek request untuk logging
 * @param {object} req - Express request object
 * @returns {object} Sanitized request info
 */
export const sanitizeRequest = (req) => {
  if (!req) return {};

  return {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
    body: sanitizeData(req.body),
    query: sanitizeData(req.query),
    params: sanitizeData(req.params),
  };
};
