import NodeCache from 'node-cache';
// Simple logger inline untuk menghindari circular dependency
const logger = {
  info: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
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
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta);
    }
  }
};

// Create cache instances with different TTLs
export const cache = {
  // Short-term cache (5 minutes) - for frequently changing data
  short: new NodeCache({ 
    stdTTL: 300, 
    checkperiod: 60,
    useClones: false
  }),
  
  // Medium-term cache (1 hour) - for semi-static data
  medium: new NodeCache({ 
    stdTTL: 3600, 
    checkperiod: 300,
    useClones: false
  }),
  
  // Long-term cache (24 hours) - for static data
  long: new NodeCache({ 
    stdTTL: 86400, 
    checkperiod: 3600,
    useClones: false
  })
};

// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  // Add cache headers
  res.set('Cache-Control', 'no-cache');
  res.set('X-Powered-By', 'Koperasi-API');
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      logger.warn('Slow Request Detected', logData);
    } else {
      logger.info('Request Completed', logData);
    }
    
    // Store performance metrics
    storeMetrics(logData);
  });
  
  next();
};

// Store performance metrics for monitoring
const metrics = {
  requests: [],
  errors: [],
  slowQueries: []
};

export const storeMetrics = (data) => {
  // Keep only last 1000 entries
  if (metrics.requests.length >= 1000) {
    metrics.requests.shift();
  }
  
  metrics.requests.push(data);
  
  // Track errors
  if (data.statusCode >= 400) {
    if (metrics.errors.length >= 100) {
      metrics.errors.shift();
    }
    metrics.errors.push(data);
  }
  
  // Track slow queries
  if (parseInt(data.duration) > 1000) {
    if (metrics.slowQueries.length >= 50) {
      metrics.slowQueries.shift();
    }
    metrics.slowQueries.push(data);
  }
};

// Get performance statistics
export const getPerformanceStats = () => {
  const now = Date.now();
  const last5Minutes = metrics.requests.filter(r => 
    new Date(r.timestamp).getTime() > now - 300000
  );
  
  const lastHour = metrics.requests.filter(r => 
    new Date(r.timestamp).getTime() > now - 3600000
  );
  
  return {
    current: {
      totalRequests: last5Minutes.length,
      averageResponseTime: last5Minutes.length > 0 
        ? Math.round(last5Minutes.reduce((sum, r) => sum + parseInt(r.duration), 0) / last5Minutes.length)
        : 0,
      errorRate: last5Minutes.length > 0
        ? Math.round((last5Minutes.filter(r => r.statusCode >= 400).length / last5Minutes.length) * 100)
        : 0
    },
    hourly: {
      totalRequests: lastHour.length,
      averageResponseTime: lastHour.length > 0
        ? Math.round(lastHour.reduce((sum, r) => sum + parseInt(r.duration), 0) / lastHour.length)
        : 0,
      errorRate: lastHour.length > 0
        ? Math.round((lastHour.filter(r => r.statusCode >= 400).length / lastHour.length) * 100)
        : 0
    },
    recentErrors: metrics.errors.slice(0, 10),
    slowQueries: metrics.slowQueries.slice(0, 10)
  };
};

// Cache helper functions
export const cacheHelper = {
  // Get from cache
  get: (key, cacheType = 'medium') => {
    return cache[cacheType].get(key);
  },
  
  // Set cache
  set: (key, value, ttl, cacheType = 'medium') => {
    if (ttl) {
      return cache[cacheType].set(key, value, ttl);
    }
    return cache[cacheType].set(key, value);
  },
  
  // Delete from cache
  del: (key, cacheType = 'medium') => {
    return cache[cacheType].del(key);
  },
  
  // Clear all cache
  flush: (cacheType = 'all') => {
    if (cacheType === 'all') {
      Object.keys(cache).forEach(type => cache[type].flushAll());
    } else {
      cache[cacheType].flushAll();
    }
  },
  
  // Get cache statistics
  stats: (cacheType = 'medium') => {
    return cache[cacheType].getStats();
  }
};

// Database query optimization helper
export const queryOptimizer = {
  // Add pagination to any query
  paginate: (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return { limit: parseInt(limit), offset };
  },
  
  // Add common optimizations for large datasets
  optimizeForLargeDataset: () => {
    return {
      // Only select needed fields
      attributes: { exclude: ['password_hash', 'created_at', 'updated_at'] },
      // Add reasonable limits
      limit: 100,
      // Order by indexed columns
      order: [['id', 'DESC']]
    };
  },
  
  // Cache query results
  cachedQuery: async (key, queryFunction, ttl = 3600, cacheType = 'medium') => {
    // Try to get from cache first
    const cached = cacheHelper.get(key, cacheType);
    if (cached) {
      logger.debug(`Cache hit for key: ${key}`);
      return cached;
    }
    
    // Execute query and cache result
    logger.debug(`Cache miss for key: ${key}`);
    const result = await queryFunction();
    cacheHelper.set(key, result, ttl, cacheType);
    
    return result;
  }
};

// Memory usage monitoring
export const memoryMonitor = () => {
  const usage = process.memoryUsage();
  
  return {
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB', // Resident Set Size
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB', // Total heap
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB', // Used heap
    external: Math.round(usage.external / 1024 / 1024) + ' MB', // External memory
    cacheStats: {
      short: cacheHelper.stats('short'),
      medium: cacheHelper.stats('medium'),
      long: cacheHelper.stats('long')
    }
  };
};

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: memoryMonitor(),
      performance: getPerformanceStats(),
      cache: {
        short: cacheHelper.stats('short'),
        medium: cacheHelper.stats('medium'),
        long: cacheHelper.stats('long')
      }
    };
    
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
};
