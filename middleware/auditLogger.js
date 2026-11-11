// 📁 middleware/auditLogger.js (EVENT-DRIVEN AUDIT LOGGING MIDDLEWARE)

import { logAuditEvent, getAuditContext } from "../services/auditLogger.js";
import { sanitizeData } from "../utils/logSanitizer.js";

export const auditLoggingMiddleware = (req, res, next) => {
  const context = getAuditContext(req);

  // Sanitasi request data
  const sanitizedReqData = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
    body: sanitizeData(req.body),
    query: sanitizeData(req.query),
    params: sanitizeData(req.params),
    headers: sanitizeData(req.headers),
  };

  const originalJson = res.json.bind(res);
  const originalStatus = res.status.bind(res);

  res.status = (code) => {
    if (code >= 400) {
      logAuditEvent({
        ...context,
        actionType: `FAILED_${sanitizedReqData.method}_${sanitizedReqData.url}`,
        entityType: "AUTH",
        success: false,
        details: { error: "Authentication/authorization failed" },
        requestData: sanitizedReqData,
      }).catch(() => {});
    }
    return originalStatus(code);
  };

  res.json = (data) => {
    const statusCode = res.statusCode;
    if (statusCode >= 400) {
      logAuditEvent({
        ...context,
        actionType: `${sanitizedReqData.method}_${sanitizedReqData.url}`,
        entityType: sanitizedReqData.url.split("/").pop()?.toUpperCase() || "UNKNOWN",
        success: false,
        details: { error: data?.message || "Failed" },
        requestData: sanitizedReqData,
      }).catch(() => {});
    }
    return originalJson(data);
  };

  next();
};

// Helper function to apply audit logging to Express app
export const applyAuditLoggingMiddleware = (app) => {
  app.use((req, res, next) => {
    auditLoggingMiddleware(req, res, next);
  });
};