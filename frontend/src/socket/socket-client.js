// Socket.IO Client Management
import { io } from 'socket.io-client';
import { CONNECTION_STATUS } from './socket-events';

let socket = null;
let connectionStatus = CONNECTION_STATUS.DISCONNECTED;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Event listeners for status changes
const statusListeners = new Set();

const notifyStatusChange = (status) => {
  connectionStatus = status;
  statusListeners.forEach((listener) => listener(status));
};

/**
 * Initialize Socket.IO client with authentication
 * @param {string} token - JWT access token
 */
export const initializeSocket = (token) => {
  if (socket) {
    console.log('♻️ Socket already initialized, returning existing instance');
    return socket;
  }

  if (!token) {
    console.warn('❌ No auth token provided - socket not initialized');
    return null;
  }

  // Get API base URL and remove /api/v1 suffix for socket connection
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const socketUrl = apiBaseUrl.replace(/\/api\/v1$/, '');

  console.log('🔌 [Socket Client] Initializing socket connection to:', socketUrl);

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    timeout: 10000,
  });

  // Connection event
  socket.on('connect', () => {
    console.log('✅ [Socket Client] Socket connected successfully');
    reconnectAttempts = 0;
    notifyStatusChange(CONNECTION_STATUS.CONNECTED);
  });

  // Disconnection event
  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
    notifyStatusChange(CONNECTION_STATUS.DISCONNECTED);
  });

  // Reconnection attempt
  socket.io.on('reconnect_attempt', (attempt) => {
    console.log(`🔄 Reconnecting... attempt ${attempt}`);
    reconnectAttempts = attempt;
    notifyStatusChange(CONNECTION_STATUS.RECONNECTING);
  });

  // Reconnection successful
  socket.io.on('reconnect', (attemptNumber) => {
    console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
    notifyStatusChange(CONNECTION_STATUS.CONNECTED);
  });

  // Reconnection failed
  socket.io.on('reconnect_failed', () => {
    console.error('❌ Failed to reconnect after', MAX_RECONNECT_ATTEMPTS, 'attempts');
    notifyStatusChange(CONNECTION_STATUS.DISCONNECTED);
  });

  // Connection error
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      notifyStatusChange(CONNECTION_STATUS.DISCONNECTED);
    }
  });

  // Server status messages
  socket.on('connection:status', (data) => {
    console.log('Server connection status:', data);
  });

  // Error from server
  socket.on('error', (error) => {
    console.error('Socket error from server:', error);
  });

  return socket;
};

/**
 * Get existing socket instance or initialize new one
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Disconnect socket and cleanup
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectionStatus = CONNECTION_STATUS.DISCONNECTED;
  }
};

/**
 * Get current connection status
 */
export const getConnectionStatus = () => connectionStatus;

/**
 * Subscribe to status changes
 * @param {Function} callback - Function to call when status changes
 * @returns {Function} - Unsubscribe function
 */
export const onStatusChange = (callback) => {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
};

/**
 * Join a room (for presence tracking)
 */
export const joinRoom = (room) => {
  const socketInstance = getSocket();
  if (socketInstance?.connected) {
    socketInstance.emit('join:room', { room });
  }
};

/**
 * Leave a room
 */
export const leaveRoom = (room) => {
  const socketInstance = getSocket();
  if (socketInstance?.connected) {
    socketInstance.emit('leave:room', { room });
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationRead = (notificationId) => {
  const socketInstance = getSocket();
  if (socketInstance?.connected) {
    socketInstance.emit('notification:read', { notificationId });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = () => {
  const socketInstance = getSocket();
  if (socketInstance?.connected) {
    socketInstance.emit('notification:read_all');
  }
};
