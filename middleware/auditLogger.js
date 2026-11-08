// 📁 middleware/auditLogger.js (EVENT-DRIVEN AUDIT LOGGING MIDDLEWARE)

import { logAuditEvent, getAuditContext } from "../services/auditLogger.js";

export const auditLoggingMiddleware = (req, res, next) => {
  const context = getAuditContext(req);
  req.auditContext = context;

  const originalJson = res.json.bind(res);
  const originalStatus = res.status.bind(res);

  res.status = (code) => {
    if (code >= 400) {
      logAuditEvent({
        ...context,
        actionType: `FAILED_${req.method}_${req.path}`,
        entityType: "AUTH",
        success: false,
        details: { error: "Authentication/authorization failed" },
      }).catch(() => {});
    }
    return originalStatus(code);
  };

  res.json = (data) => {
    const statusCode = res.statusCode;
    if (statusCode >= 400) {
      logAuditEvent({
        ...context,
        actionType: `${req.method}_${req.path}`,
        entityType: req.path.split("/").pop()?.toUpperCase() || "UNKNOWN",
        success: false,
        details: { error: data?.message || "Failed" },
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