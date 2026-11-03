// Simple in-memory JWT token blacklist for logout invalidation.
// In production, replace with Redis for distributed deployments.
const blacklistedTokens = new Map();

/**
 * Add a token to the blacklist with TTL based on its expiry
 * @param {string} token - JWT token to blacklist
 * @param {number} expiryTimestamp - Token expiry timestamp in ms
 */
export function blacklistToken(token, expiryTimestamp) {
  const ttl = Math.max(0, expiryTimestamp - Date.now());
  blacklistedTokens.set(token, expiryTimestamp);
  // Auto-cleanup after expiry
  setTimeout(() => {
    blacklistedTokens.delete(token);
  }, ttl);
}

/**
 * Check if a token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {boolean}
 */
export function isTokenBlacklisted(token) {
  return blacklistedTokens.has(token);
}

/**
 * Get blacklist size (for monitoring)
 * @returns {number}
 */
export function blacklistSize() {
  return blacklistedTokens.size;
}
