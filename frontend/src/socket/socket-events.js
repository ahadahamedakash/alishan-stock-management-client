// Socket.IO Event Constants

// Server → Client events
export const SERVER_EVENTS = {
  STOCK_ADDED: 'stock:added',
  STOCK_DEDUCTED: 'stock:deducted',
  STOCK_MANUAL_ENTRY: 'stock:manual_entry',
  STOCK_LOW: 'stock:low',
  INVOICE_CREATED: 'invoice:created',
  INVOICE_STOCK_DEDUCTED: 'invoice:stock_deducted',
  COLLECTION_CREATED: 'collection:created',
  EXPENSE_HIGH: 'expense:high',
  USER_CREATED: 'user:created',
  USER_ACTIVITY: 'user:activity',
  CUSTOMER_UPDATED: 'customer:updated',
  PRESENCE_VIEWER: 'presence:viewer',
  NOTIFICATION: 'notification',
  CONNECTION_STATUS: 'connection:status',
  ERROR: 'error',
};

// Client → Server events
export const CLIENT_EVENTS = {
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
  PRESENCE_UPDATE: 'presence:update',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_READ_ALL: 'notification:read_all',
};

// Connection statuses
export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
};

// Notification types (matching backend)
export const NOTIFICATION_TYPES = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  STOCK_LOW: 'stock_low',
  INVOICE: 'invoice',
  COLLECTION: 'collection',
  EXPENSE: 'expense',
  USER: 'user',
  SYSTEM: 'system',
};

// Notification priorities
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};
