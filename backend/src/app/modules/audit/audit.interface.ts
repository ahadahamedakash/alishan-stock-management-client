export interface IAuditLog {
  userId: string;
  userRole: string;
  userEmail: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  status?: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
}

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'STOCK_ADD'
  | 'STOCK_DEDUCT'
  | 'INVOICE_CREATE'
  | 'INVOICE_DELETE'
  | 'INVOICE_STOCK_DEDUCTED'
  | 'COLLECTION_CREATE'
  | 'CUSTOMER_CREATE'
  | 'CUSTOMER_UPDATE'
  | 'CUSTOMER_DELETE'
  | 'PRODUCT_CREATE'
  | 'PRODUCT_UPDATE'
  | 'PRODUCT_DELETE'
  | 'EXPENSE_CREATE'
  | 'EXPENSE_UPDATE'
  | 'EXPENSE_DELETE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE';

export interface IAuditLogFilters {
  userId?: string;
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}
