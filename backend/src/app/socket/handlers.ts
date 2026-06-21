// Socket.IO Event Handlers
import { Socket } from 'socket.io';
import { Server as SocketIOServer } from 'socket.io';
import { SERVER_EVENTS, CLIENT_EVENTS, ROOMS } from './events';
import logger from '../config/logger';

// Extended Socket interface with user properties
export interface AuthenticatedSocket extends Socket {
  userId: string;
  userRole: string;
  email: string;
}

/**
 * Handle new socket connection
 * - Join user to their personal room
 * - Join user to role-based room
 * - Notify others about presence
 */
export const handleConnection = (io: SocketIOServer, socket: AuthenticatedSocket) => {
  const { userId, userRole, email } = socket;

  logger.info('Socket connected', {
    socketId: socket.id,
    email,
    userRole,
    userId,
  });

  // Join user-specific room (for personal notifications)
  socket.join(`${ROOMS.USER_PREFIX}${userId}`);

  // Join role-based room (for broadcasts to roles)
  const roleRoom = getRoleRoom(userRole);
  if (roleRoom) {
    socket.join(roleRoom);
    logger.debug('Socket joined role room', { socketId: socket.id, roleRoom, userRole });
  }

  // Notify others about presence
  socket.broadcast.emit(SERVER_EVENTS.PRESENCE_VIEWER, {
    userId,
    email,
    action: 'online',
    timestamp: new Date(),
  });

  // Send connection success to client
  socket.emit(SERVER_EVENTS.CONNECTION_STATUS, {
    status: 'connected',
    userId,
    userRole,
  });

  // Setup client event handlers
  setupClientEventHandlers(io, socket);

  // Setup disconnect handler
  socket.on('disconnect', () => handleDisconnect(io, socket));
};

/**
 * Handle socket disconnection
 * - Notify others about user going offline
 */
export const handleDisconnect = (_io: SocketIOServer, socket: AuthenticatedSocket) => {
  logger.info('Socket disconnected', {
    socketId: socket.id,
    email: socket.email,
    userRole: socket.userRole,
  });

  // Notify others about disconnect
  socket.broadcast.emit(SERVER_EVENTS.PRESENCE_VIEWER, {
    userId: socket.userId,
    email: socket.email,
    action: 'offline',
    timestamp: new Date(),
  });
};

/**
 * Setup handlers for client-side events
 */
const setupClientEventHandlers = (io: SocketIOServer, socket: AuthenticatedSocket) => {
  // Join presence room (for collaborative features like "who's viewing this page")
  socket.on(CLIENT_EVENTS.JOIN_ROOM, (data: { room: string }) => {
    const { room } = data;

    if (!room || typeof room !== 'string') {
      socket.emit(SERVER_EVENTS.ERROR, {
        message: 'Invalid room name',
      });
      return;
    }

    const roomName = `${ROOMS.PRESENCE_PREFIX}${room}`;
    socket.join(roomName);

    // Notify others in room
    socket.to(roomName).emit(SERVER_EVENTS.PRESENCE_VIEWER, {
      userId: socket.userId,
      email: socket.email,
      userRole: socket.userRole,
      action: 'joined',
      room,
      timestamp: new Date(),
    });

    logger.debug('Socket joined room', { socketId: socket.id, email, room });
  });

  // Leave presence room
  socket.on(CLIENT_EVENTS.LEAVE_ROOM, (data: { room: string }) => {
    const { room } = data;

    if (!room || typeof room !== 'string') {
      return;
    }

    const roomName = `${ROOMS.PRESENCE_PREFIX}${room}`;
    socket.leave(roomName);

    // Notify others in room
    socket.to(roomName).emit(SERVER_EVENTS.PRESENCE_VIEWER, {
      userId: socket.userId,
      email: socket.email,
      userRole: socket.userRole,
      action: 'left',
      room,
      timestamp: new Date(),
    });

    logger.debug('Socket left room', { socketId: socket.id, email, room });
  });

  // Typing indicator (for future comments/notes feature)
  socket.on(CLIENT_EVENTS.PRESENCE_UPDATE, (data: { room: string; isTyping: boolean }) => {
    const { room, isTyping } = data;

    if (!room) {
      return;
    }

    const roomName = `${ROOMS.PRESENCE_PREFIX}${room}`;
    socket.to(roomName).emit(CLIENT_EVENTS.PRESENCE_UPDATE, {
      userId: socket.userId,
      email: socket.email,
      isTyping,
      timestamp: new Date(),
    });
  });

  // Mark single notification as read
  socket.on(CLIENT_EVENTS.NOTIFICATION_READ, (data: { notificationId: string }) => {
    // This will be implemented when we add notification persistence
    // For now, just acknowledge
    socket.emit('notification:read_ack', { notificationId: data.notificationId });
  });

  // Mark all notifications as read
  socket.on(CLIENT_EVENTS.NOTIFICATION_READ_ALL, () => {
    // This will be implemented when we add notification persistence
    socket.emit('notification:read_all_ack', { success: true });
  });
};

/**
 * Get the role-based room name for a user role
 */
const getRoleRoom = (role: string): string | null => {
  const roleMap: Record<string, string> = {
    admin: ROOMS.ADMIN,
    'stock-manager': ROOMS.STOCK_MANAGER,
    accountant: ROOMS.ACCOUNTANT,
  };

  return roleMap[role] || null;
};

/**
 * Get room name for a specific user
 */
export const getUserRoom = (userId: string): string => {
  return `${ROOMS.USER_PREFIX}${userId}`;
};

/**
 * Get room name for presence tracking
 */
export const getPresenceRoom = (page: string): string => {
  return `${ROOMS.PRESENCE_PREFIX}${page}`;
};
