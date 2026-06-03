/**
 * Notification System Constants
 * Standardizes all notification-related values across the application
 */

export const NOTIFICATION_STATUS = {
  UNREAD: 'unread',
  SENT: 'sent',
  READ: 'read',
  ARCHIVED: 'archived'
};

export const NOTIFICATION_TYPE = {
  GENERAL: 'GENERAL',
  TRANSACTION: 'TRANSACTION',
  PAYMENT: 'PAYMENT',
  SYSTEM: 'SYSTEM',
  ANNOUNCEMENT: 'ANNOUNCEMENT'
};

export const SOCKET_EVENTS = {
  NOTIFICATION_UPDATE: 'notifications:update',
  NEW_NOTIFICATION: 'notifications:new',
  NOTIFICATION_READ: 'notifications:read'
};

export const NOTIFICATION_LIMITS = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
  DEFAULT_OFFSET: 0
};

// Frontend status mapping (1 = unread, 2 = read)
export const STATUS_MAPPING = {
  [NOTIFICATION_STATUS.UNREAD]: 1,
  [NOTIFICATION_STATUS.SENT]: 1,
  [NOTIFICATION_STATUS.READ]: 2,
  [NOTIFICATION_STATUS.ARCHIVED]: 3
};

// Reverse mapping for backend
export const REVERSE_STATUS_MAPPING = {
  1: NOTIFICATION_STATUS.UNREAD,
  2: NOTIFICATION_STATUS.READ,
  3: NOTIFICATION_STATUS.ARCHIVED
};

export default {
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  SOCKET_EVENTS,
  NOTIFICATION_LIMITS,
  STATUS_MAPPING,
  REVERSE_STATUS_MAPPING
};
