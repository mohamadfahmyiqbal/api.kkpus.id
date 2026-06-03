// jobs/cleanupJob.js
import forgotPasswordService from '../services/forgotPasswordService.js';
import { logger } from '../utils/logger.js';

/**
 * Cleanup expired sessions and tokens
 * This should be run periodically (e.g., every hour)
 */
export const cleanupExpiredData = async () => {
  try {
    logger.info('Starting cleanup job for expired sessions and tokens');
    
    // Clean expired sessions
    const deletedSessions = await forgotPasswordService.cleanupExpiredSessions();
    logger.info(`Cleaned up ${deletedSessions} expired sessions`);
    
    // Clean expired tokens
    const deletedTokens = await forgotPasswordService.cleanupExpiredTokens();
    logger.info(`Cleaned up ${deletedTokens} expired tokens`);
    
    logger.info('Cleanup job completed successfully');
    
    return {
      deletedSessions,
      deletedTokens,
      success: true
    };
  } catch (error) {
    logger.error('Cleanup job failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Setup periodic cleanup job
 * Run every hour
 */
export const setupCleanupJob = () => {
  // Run immediately on startup
  cleanupExpiredData();
  
  // Then run every hour
  setInterval(cleanupExpiredData, 60 * 60 * 1000); // 1 hour
  
  logger.info('Cleanup job scheduled to run every hour');
};

export default {
  cleanupExpiredData,
  setupCleanupJob
};
