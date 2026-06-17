// React Hook for Socket.IO
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
  getConnectionStatus,
  onStatusChange,
} from "./socket-client";
import { setupSocketHandlers, removeSocketHandlers } from "./socket-handlers";
import { CONNECTION_STATUS } from "./socket-events";

/**
 * Custom React Hook for Socket.IO
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoConnect - Auto-connect on mount (default: true)
 * @param {boolean} options.setupHandlers - Setup event handlers (default: true)
 * @returns {Object} - Socket utilities and state
 */
export const useSocket = (options = {}) => {
  const { autoConnect = true, setupHandlers = true } = options;

  // Get token from Redux
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(getConnectionStatus());
  const handlersSetupRef = useRef(false);

  // Check if user has permission to use socket (authenticated users only)
  const canUseSocket = !!(token && user);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect || !canUseSocket) {
      return;
    }

    const socket = initializeSocket(token);
    console.log("🔌 [useSocket] Socket initialized:", socket?.connected);

    return () => {
      // Cleanup on unmount
      if (!autoConnect) {
        disconnectSocket();
      }
    };
  }, [autoConnect, canUseSocket, token]);

  // Setup status listener
  useEffect(() => {
    const unsubscribe = onStatusChange((newStatus) => {
      setStatus(newStatus);
      setIsConnected(newStatus === CONNECTION_STATUS.CONNECTED);
    });

    return unsubscribe;
  }, []);

  // Setup event handlers
  useEffect(() => {
    if (
      !isConnected ||
      !setupHandlers ||
      handlersSetupRef.current ||
      !canUseSocket
    ) {
      return;
    }

    const socket = getSocket();
    if (!socket) return;

    // Setup handlers with dispatch function (to be implemented with Redux)
    setupSocketHandlers(socket, () => {});
    handlersSetupRef.current = true;

    return () => {
      if (socket) {
        removeSocketHandlers(socket);
        handlersSetupRef.current = false;
      }
    };
  }, [isConnected, setupHandlers, canUseSocket]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    if (canUseSocket) {
      disconnectSocket();
      setTimeout(() => {
        if (canUseSocket && token) {
          initializeSocket(token);
        }
      }, 1000);
    }
  }, [canUseSocket, token]);

  // Manual disconnect
  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  // Emit event helper
  const emit = useCallback((event, data) => {
    const socketInstance = getSocket();
    if (socketInstance?.connected) {
      socketInstance.emit(event, data);
    } else {
      console.warn("Cannot emit event - socket not connected");
    }
  }, []);

  // Join room helper
  const joinRoom = useCallback((room) => {
    const socketInstance = getSocket();
    if (socketInstance?.connected) {
      socketInstance.emit("join:room", { room });
    }
  }, []);

  // Leave room helper
  const leaveRoom = useCallback((room) => {
    const socketInstance = getSocket();
    if (socketInstance?.connected) {
      socketInstance.emit("leave:room", { room });
    }
  }, []);

  return {
    isConnected,
    status,
    socket: getSocket(),
    reconnect,
    disconnect,
    emit,
    joinRoom,
    leaveRoom,
    canUseSocket,
  };
};

export default useSocket;
