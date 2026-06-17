// Socket.IO Event Constants and Types

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
} as const;

// Client → Server events
export const CLIENT_EVENTS = {
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
  PRESENCE_UPDATE: 'presence:update',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_READ_ALL: 'notification:read_all',
} as const;

// Room names for broadcasting
export const ROOMS = {
  ADMIN: 'role:admin',
  STOCK_MANAGER: 'role:stock-manager',
  ACCOUNTANT: 'role:accountant',
  USER_PREFIX: 'user:',
  PRESENCE_PREFIX: 'presence:',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  STOCK_LOW: 'stock_low',
  INVOICE: 'invoice',
  COLLECTION: 'collection',
  EXPENSE: 'expense',
  USER: 'user',
  SYSTEM: 'system',
} as const;

// Notification priorities
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Event payload interfaces
export interface StockAddedData {
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  action: 'added';
  source: 'manual' | 'invoice' | 'other';
  currentStock: number;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface StockDeductedData {
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  action: 'deducted';
  source: 'invoice' | 'manual';
  invoiceNumber?: string;
  currentStock: number;
  lowStockThreshold?: number;
  isLowStock: boolean;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface InvoiceCreatedData {
  id?: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  total: number;
  paid: number;
  due: number;
  createdBy: string;
  userName: string;
  timestamp: Date;
}

export interface InvoiceStockDeductedData {
  id?: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  totalProducts: number;
  totalQuantity: number;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface CollectionCreatedData {
  id?: string;
  collectionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  createdBy: string;
  userName: string;
  timestamp: Date;
}

export interface ExpenseHighData {
  id?: string;
  expenseId: string;
  category: string;
  amount: number;
  description: string;
  employeeId?: string;
  createdBy: string;
  userName: string;
  timestamp: Date;
}

export interface UserCreatedData {
  id?: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  createdBy: string;
  timestamp: Date;
}

export interface NotificationPayload {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date | string;
  read: boolean;
  readAt?: string;
}

// Helper function to create notification payload
export const createNotificationPayload = (
  type: string,
  priority: string,
  data: any
): NotificationPayload => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  priority,
  title: data.title || getDefaultTitle(type),
  message: data.message || '',
  details: data.details || data,
  timestamp: data.timestamp || new Date(),
  read: false,
});

// Helper to get default title based on notification type
const getDefaultTitle = (type: string): string => {
  const titles: Record<string, string> = {
    stock_in: 'Stock Added',
    stock_out: 'Stock Deducted',
    stock_low: 'Low Stock Alert',
    invoice: 'New Invoice',
    collection: 'Payment Received',
    expense: 'New Expense',
    user: 'New User',
    system: 'System Notification',
  };
  return titles[type] || 'Notification';
};
