/* eslint-disable no-unused-vars */
// Socket.IO Event Handlers
import toast from "react-hot-toast";
import { SERVER_EVENTS } from "./socket-events";

/**
 * Setup socket event handlers for real-time notifications
 * @param {Object} socket - Socket.IO instance
 * @param {Function} dispatch - Redux dispatch function
 */
export const setupSocketHandlers = (socket, dispatch) => {
  if (!socket) {
    console.warn("❌ [Socket Handlers] No socket provided");
    return;
  }

  console.log("🔧 [Socket Handlers] Setting up event handlers...");

  // Stock added event
  socket.on(SERVER_EVENTS.STOCK_ADDED, (data) => {
    console.log("📥 [Socket Handlers] Received STOCK_ADDED event:", data);
    const { productName, quantity, currentStock, userName } = data;

    toast.success(`Stock Added: ${quantity} units of ${productName}`, {
      duration: 3000,
      icon: "📥",
    });

    // Dispatch action for Redux if needed
    // dispatch(addNotification({ ... }));

    // Always dispatch custom event for any listening components
    window.dispatchEvent(
      new CustomEvent("stock:updated", { detail: { ...data, type: "added" } }),
    );
    // Also dispatch product update event since stock affects product data
    window.dispatchEvent(
      new CustomEvent("product:updated", {
        detail: { productId: data.productId, stock: data.currentStock },
      }),
    );
  });

  // Stock deducted event
  socket.on(SERVER_EVENTS.STOCK_DEDUCTED, (data) => {
    const { productName, quantity, currentStock, userName, isLowStock } = data;

    if (isLowStock) {
      toast.error(`Low Stock: ${productName} (${currentStock} units left)`, {
        duration: 5000,
        icon: "⚠️",
      });
    } else {
      toast(`Stock Deducted: ${quantity} units of ${productName}`, {
        duration: 3000,
        icon: "📤",
      });
    }

    // Dispatch action for Redux if needed
    // dispatch(addNotification({ ... }));

    // Always dispatch custom event for any listening components
    window.dispatchEvent(
      new CustomEvent("stock:updated", {
        detail: { ...data, type: "deducted" },
      }),
    );
    // Also dispatch product update event since stock affects product data
    window.dispatchEvent(
      new CustomEvent("product:updated", {
        detail: { productId: data.productId, stock: data.currentStock },
      }),
    );
  });

  // Manual stock entry event
  socket.on(SERVER_EVENTS.STOCK_MANUAL_ENTRY, (data) => {
    const { productName, quantity, action, userName } = data;

    toast.success(
      `Manual Stock ${action === "added" ? "In" : "Out"}: ${productName}`,
      {
        duration: 4000,
        icon: action === "added" ? "📥" : "📤",
      },
    );

    // Always dispatch custom event for any listening components
    window.dispatchEvent(
      new CustomEvent("stock:updated", {
        detail: { ...data, type: action === "added" ? "added" : "deducted" },
      }),
    );
    // Also dispatch product update event since stock affects product data
    window.dispatchEvent(
      new CustomEvent("product:updated", {
        detail: { productId: data.productId },
      }),
    );
  });

  // Low stock alert event
  socket.on(SERVER_EVENTS.STOCK_LOW, (data) => {
    const { productName, currentStock, lowStockThreshold } = data;

    toast.error(
      `Low Stock Alert: ${productName} (${currentStock} / ${lowStockThreshold})`,
      {
        duration: 5000,
        icon: "⚠️",
      },
    );

    // Dispatch critical notification
    // dispatch(addCriticalNotification({ ... }));
  });

  // Invoice created event
  socket.on(SERVER_EVENTS.INVOICE_CREATED, (data) => {
    const { invoiceNumber, customerName, totalAmount, userName } = data;

    toast.success(
      `New Invoice: ${invoiceNumber} - ${customerName} - ৳${totalAmount}`,
      {
        duration: 4000,
        icon: "🧾",
      },
    );

    // Always dispatch custom event for any listening components
    window.dispatchEvent(new CustomEvent("invoice:created", { detail: data }));
  });

  // Invoice stock deducted event
  socket.on(SERVER_EVENTS.INVOICE_STOCK_DEDUCTED, (data) => {
    const {
      invoiceNumber,
      customerName,
      totalProducts,
      totalQuantity,
      userName,
    } = data;

    toast.success(
      `Stock Deducted: Invoice ${invoiceNumber} - ${totalProducts} products (${totalQuantity} units)`,
      {
        duration: 4000,
        icon: "📦",
      },
    );

    // Always dispatch custom event for any listening components
    window.dispatchEvent(
      new CustomEvent("invoice:stock_deducted", { detail: data }),
    );
  });

  // Collection received event
  socket.on(SERVER_EVENTS.COLLECTION_CREATED, (data) => {
    const { customerName, amount, userName, customerId } = data;

    toast.success(`Collection Received: ৳${amount} from ${customerName}`, {
      duration: 4000,
      icon: "💰",
    });

    // Always dispatch custom event for any listening components
    window.dispatchEvent(
      new CustomEvent("collection:created", { detail: data }),
    );
    // Also dispatch customer updated event since customer amounts change
    window.dispatchEvent(
      new CustomEvent("customer:updated", {
        detail: { customerId, customerName, amount, type: "collection" },
      }),
    );
  });

  // High expense alert event
  socket.on(SERVER_EVENTS.EXPENSE_HIGH, (data) => {
    const { category, amount, description, userName } = data;

    toast.error(`High Expense: ${category} - ৳${amount}`, {
      duration: 5000,
      icon: "💸",
    });

    // Refresh expense list if on expense page
    if (window.location.pathname.includes("/expense")) {
      window.dispatchEvent(
        new CustomEvent("expense:created", { detail: data }),
      );
    }
  });

  // User created event
  socket.on(SERVER_EVENTS.USER_CREATED, (data) => {
    const { name, role, createdBy, userName } = data;

    toast.success(`New User Created: ${name} (${role})`, {
      duration: 4000,
      icon: "👤",
    });

    // Refresh user list if on user management page
    if (window.location.pathname.includes("/user")) {
      window.dispatchEvent(new CustomEvent("user:created", { detail: data }));
    }
  });

  // User activity event
  socket.on(SERVER_EVENTS.USER_ACTIVITY, (data) => {
    const { action, userName } = data;

    // Show login/logout notification for admin
    toast(`${userName} ${action}`, {
      duration: 3000,
      icon: action === "logged in" ? "🟢" : "🔴",
    });
  });

  // Customer updated event
  socket.on(SERVER_EVENTS.CUSTOMER_UPDATED, (data) => {
    const { customerName, action } = data;

    toast(`Customer Updated: ${customerName}`, {
      duration: 3000,
      icon: "👥",
    });

    // Always dispatch custom event for any listening components
    window.dispatchEvent(new CustomEvent("customer:updated", { detail: data }));
  });

  // Presence viewer event (who's viewing the page)
  socket.on(SERVER_EVENTS.PRESENCE_VIEWER, (data) => {
    // Handle presence updates
    window.dispatchEvent(new CustomEvent("presence:update", { detail: data }));
  });

  // Generic notification handler (for admin notification panel)
  socket.on(SERVER_EVENTS.NOTIFICATION, (data) => {
    // This will be handled by Redux notification slice
    // dispatch(addNotification(data));

    // Also show toast for immediate feedback
    const { type, priority, title, message } = data;

    const toastOptions = {
      duration: priority === "critical" ? 5000 : 3000,
      icon: getNotificationIcon(type),
    };

    if (priority === "critical") {
      toast.error(`${title}: ${message}`, toastOptions);
    } else if (priority === "high") {
      toast.warning(`${title}: ${message}`, toastOptions);
    } else {
      toast.success(`${title}: ${message}`, toastOptions);
    }
  });

  // Connection status from server
  socket.on(SERVER_EVENTS.CONNECTION_STATUS, (data) => {
    console.log("Server connection status:", data);
  });

  // Error from server
  socket.on(SERVER_EVENTS.ERROR, (error) => {
    console.error("Socket error from server:", error);
    toast.error(`Socket Error: ${error.message}`, {
      duration: 5000,
      icon: "❌",
    });
  });
};

/**
 * Remove all socket event handlers
 * @param {Object} socket - Socket.IO instance
 */
export const removeSocketHandlers = (socket) => {
  if (!socket) return;

  Object.values(SERVER_EVENTS).forEach((event) => {
    socket.off(event);
  });
};

/**
 * Get notification icon based on type
 */
const getNotificationIcon = (type) => {
  const icons = {
    stock_in: "📥",
    stock_out: "📤",
    stock_low: "⚠️",
    invoice: "🧾",
    collection: "💰",
    expense: "💸",
    user: "👤",
    system: "🔧",
  };
  return icons[type] || "📢";
};
