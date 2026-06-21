// Socket.IO Server Initialization and Configuration
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { handleConnection } from "./handlers";
import {
  SERVER_EVENTS,
  ROOMS,
  NotificationPayload,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  createNotificationPayload,
} from "./events";
import { User } from "../modules/user/user.model";
import logger from "../config/logger";

// Re-export constants for easier importing
export {
  SERVER_EVENTS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  ROOMS,
  NotificationPayload,
} from "./events";

// Socket.IO instance (singleton)
let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO server with authentication and configuration
 */
export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  if (io) {
    logger.warn('Socket.IO already initialized');
    return io;
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: frontendUrl,
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    transports: ["websocket", "polling"], // Fallback to polling if WebSocket fails
    maxHttpBufferSize: 1e6, // 1MB
  });

  // Authentication middleware - verifies JWT token on connection
  io.use(async (socket: any, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify the JWT token
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

      // Verify user exists and is not deleted
      const user = await User.findOne({ email: decoded.email });
      if (!user || user.isDeleted) {
        return next(new Error("Authentication error: User not found or deleted"));
      }

      // Attach user info to socket for use in handlers
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.email = decoded.email;

      logger.debug('Socket authenticated', {
        socketId: socket.id,
        userId: socket.userId,
        userRole: socket.userRole,
      });

      next();
    } catch (error) {
      logger.error('Socket authentication error', { error });
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Handle new connections
  io.on("connection", (socket: any) => {
    handleConnection(io as SocketIOServer, socket);
  });

  // Global error handler
  io.on("error", (error) => {
    logger.error('Socket.IO error', { error });
  });

  logger.info('Socket.IO server initialized', {
    frontendUrl,
    transports: ['websocket', 'polling'],
  });
  return io;
};

/**
 * Get the Socket.IO instance (must be initialized first)
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized! Call initializeSocket first.");
  }
  return io as SocketIOServer;
};

/**
 * Emit an event to a specific user
 */
export const emitToUser = (userId: string, event: string, data: any): void => {
  try {
    const io = getIO();
    io.to(`${ROOMS.USER_PREFIX}${userId}`).emit(event, data);
    logger.debug('Socket emitting to user', { userId, event });
  } catch (error) {
    logger.error('Failed to emit to user', { error, userId, event });
  }
};

/**
 * Emit an event to all users with a specific role
 */
export const emitToRole = (role: string, event: string, data: any): void => {
  try {
    const io = getIO();
    const roleRoom = getRoleRoom(role);
    if (roleRoom) {
      io.to(roleRoom).emit(event, data);
      logger.debug('Socket emitting to role', { role, roleRoom, event });
    } else {
      logger.warn('No room found for role', { role });
    }
  } catch (error) {
    logger.error('Failed to emit to role', { error, role, event });
  }
};

/**
 * Emit an event to multiple roles
 */
export const emitToRoles = (
  roles: string[],
  event: string,
  data: any,
): void => {
  logger.debug('Socket emitting to roles', { roles, event });
  roles.forEach((role) => emitToRole(role, event, data));
};

/**
 * Emit a notification to specific roles
 * Creates a properly formatted notification payload
 */
export const emitNotification = (
  targetRoles: string[],
  type: string,
  priority: string,
  data: any,
): void => {
  try {
    const notification = createNotificationPayload(type, priority, data);
    logger.debug('Socket emitting notification', { targetRoles, type, priority });
    emitToRoles(targetRoles, SERVER_EVENTS.NOTIFICATION, notification);
  } catch (error) {
    logger.error('Failed to emit notification', { error, targetRoles, type });
  }
};

/**
 * Get the room name for a specific role
 */
const getRoleRoom = (role: string): string | null => {
  const roleMap: Record<string, string> = {
    admin: ROOMS.ADMIN,
    "stock-manager": ROOMS.STOCK_MANAGER,
    accountant: ROOMS.ACCOUNTANT,
  };

  return roleMap[role] || null;
};

// Export for type usage
export type { SocketIOServer };
