// Simple logger utility for the application
const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  info: (message, meta = {}) => {
    if (isDevelopment) {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
    }
  },
  
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta);
  },
  
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, meta);
  },
  
  debug: (message, meta = {}) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta);
    }
  }
};

export { logger };
