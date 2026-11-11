// 📁 services/auditLogger.js (EVENT-DRIVEN AUDIT LOGGER)

import db from "../models/index.js";
import crypto from "crypto";
import { sanitizeData } from "../utils/logSanitizer.js";

const generateIntegrityHash = (data) => {
  const str = JSON.stringify({
    ...data,
    created_at: new Date().toISOString(),
  });
  return crypto.createHash("sha256").update(str).digest("hex");
};

export const logAuditEvent = async (auditData) => {
  // Sanitasi detail untuk menghapus PII dan secret
  const sanitizedDetails = sanitizeData(auditData.details || {});

  const auditId = await db.AuditLog.create({
    user_id: auditData.userId,
    actor_role: auditData.actorRole,
    action_type: auditData.actionType,
    entity_type: auditData.entityType,
    entity_id: auditData.entityId,
    details: sanitizedDetails,
    ip_address: auditData.ipAddress,
    user_agent: auditData.userAgent,
    session_id: auditData.sessionId,
    success: auditData.success !== false,
    created_at: new Date(),
  }).then((log) => log.audit_id);

  // Generate integrity hash for tamper detection
  const integrityData = {
    ...auditData,
    details: sanitizedDetails,
    audit_id: auditId,
    created_at: new Date().toISOString(),
  };
  const integrityHash = generateIntegrityHash(integrityData);

  return {
    audit_id: auditId,
    ...integrityData,
    integrity_hash: integrityHash,
  };
};

export const getAuditContext = (req) => {
  const userId = req.userId || null;
  const actorRole = req.userRoles?.join(",") || null;
  const ipAddress = req.ip || req.connection?.remoteAddress || null;
  const userAgent = req.headers["user-agent"] || null;
  const sessionId = req.sessionID || req.cookies?.sessionId || null;

  return { userId, actorRole, ipAddress, userAgent, sessionId };
};
