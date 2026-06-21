import { model, Schema } from 'mongoose';
import { IAuditLog } from './audit.interface';

const auditLogSchema = new Schema<IAuditLog>(
  {
    // User who performed the action
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // User role at time of action
    userRole: {
      type: String,
      required: true,
    },

    // User email for quick reference
    userEmail: {
      type: String,
      required: true,
    },

    // Action performed (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.)
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'LOGIN_FAILED',
        'CREATE',
        'READ',
        'UPDATE',
        'DELETE',
        'STOCK_ADD',
        'STOCK_DEDUCT',
        'INVOICE_CREATE',
        'INVOICE_DELETE',
        'INVOICE_STOCK_DEDUCTED',
        'COLLECTION_CREATE',
        'CUSTOMER_CREATE',
        'CUSTOMER_UPDATE',
        'CUSTOMER_DELETE',
        'PRODUCT_CREATE',
        'PRODUCT_UPDATE',
        'PRODUCT_DELETE',
        'EXPENSE_CREATE',
        'EXPENSE_UPDATE',
        'EXPENSE_DELETE',
        'USER_CREATE',
        'USER_UPDATE',
        'USER_DELETE',
      ],
      index: true,
    },

    // Entity type (Invoice, Customer, Product, etc.)
    entityType: {
      type: String,
      required: true,
    },

    // ID of affected entity
    entityId: {
      type: String,
      index: true,
    },

    // Description of what happened
    description: {
      type: String,
      required: true,
    },

    // IP address of request
    ipAddress: {
      type: String,
    },

    // User agent
    userAgent: {
      type: String,
    },

    // Request ID for tracing
    requestId: {
      type: String,
      index: true,
    },

    // Previous state (for updates)
    previousValues: {
      type: Schema.Types.Mixed,
    },

    // New state (for updates)
    newValues: {
      type: Schema.Types.Mixed,
    },

    // Success/failure status
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      default: 'SUCCESS',
    },

    // Error message if failed
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying by date range
auditLogSchema.index({ createdAt: -1 });

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AuditLog = model('AuditLog', auditLogSchema);
