import { Request, Response, NextFunction } from "express";
import { AuditServices } from "../modules/audit/audit.service";
import { IAuditLog, AuditAction } from "../modules/audit/audit.interface";

/**
 * Factory function to create audit logging middleware
 * Logs successful CRUD operations to MongoDB audit log collection
 *
 * @param action - The action being performed (CREATE, UPDATE, DELETE, etc.)
 * @param entityType - The type of entity being affected (Product, Invoice, etc.)
 */
export const auditLogger = (action: AuditAction, entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;

    let capturedData: any;
    let statusCode: number;

    // Capture response data
    res.json = function (data: any) {
      capturedData = data;
      statusCode = res.statusCode;
      return originalSend.call(this, data);
    };

    // Log after response is sent
    res.on("finish", async () => {
      // Only log successful requests (2xx status codes)
      if (statusCode >= 200 && statusCode < 300 && req.user) {
        const entityId =
          req.params.id ||
          capturedData?.data?._id ||
          capturedData?.data?.id ||
          req.body?.id ||
          capturedData?.data?.invoiceId ||
          capturedData?.data?.customerId ||
          capturedData?.data?.productId;

        const auditData: IAuditLog = {
          userId: req.user.userId,
          userRole: req.user.role,
          userEmail: req.user.email,
          action,
          entityType,
          entityId,
          description: `${action} ${entityType}${entityId ? `: ${entityId}` : ""}`,
          ipAddress:
            req.ip ||
            (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim(),
          userAgent: req.headers["user-agent"],
          requestId: req.id,
          previousValues: req.body.previousValues,
          newValues: req.body.newValues || capturedData?.data,
          status: statusCode < 400 ? "SUCCESS" : "FAILURE",
        };

        await AuditServices.createAuditLog(auditData);
      }
    });

    next();
  };
};

/**
 * Special audit logger for login/logout events
 * These are called directly in controllers, not as middleware
 */
export const createAuthAuditLog = async (
  req: Request,
  action: "LOGIN" | "LOGOUT" | "LOGIN_FAILED",
  userEmail: string,
  userId?: string,
  userRole?: string,
  errorMessage?: string,
) => {
  const auditData: IAuditLog = {
    userId: userId || "unknown",
    userRole: userRole || "unknown",
    userEmail,
    action,
    entityType: "User",
    entityId: userId,
    description:
      action === "LOGIN"
        ? "User logged in successfully"
        : action === "LOGOUT"
          ? "User logged out"
          : `Failed login attempt: ${errorMessage || "Invalid credentials"}`,
    ipAddress:
      req.ip ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim(),
    userAgent: req.headers["user-agent"],
    requestId: req.id,
    status: action === "LOGIN_FAILED" ? "FAILURE" : "SUCCESS",
    errorMessage: action === "LOGIN_FAILED" ? errorMessage : undefined,
  };

  await AuditServices.createAuditLog(auditData);
};
