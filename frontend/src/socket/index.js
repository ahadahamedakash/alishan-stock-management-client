// Socket.IO Module Exports
export {
  initializeSocket,
  getSocket,
  disconnectSocket,
  getConnectionStatus,
  onStatusChange,
  joinRoom,
  leaveRoom,
  markNotificationRead,
  markAllNotificationsRead,
} from './socket-client';

export {
  setupSocketHandlers,
  removeSocketHandlers,
} from './socket-handlers';

export {
  SERVER_EVENTS,
  CLIENT_EVENTS,
  CONNECTION_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} from './socket-events';

export { default as useSocket } from './useSocket';
