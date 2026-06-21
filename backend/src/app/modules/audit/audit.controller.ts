import { Request, Response } from "express";
import { AuditServices } from "./audit.service";
import { IAuditLogFilters } from "./audit.interface";

import logger from "../../config/logger";

const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      limit,
      skip,
    } = req.query;

    const filters: IAuditLogFilters = {
      ...(userId && typeof userId === "string" && { userId }),
      ...(action && { action: action as any }),
      ...(entityType && typeof entityType === "string" && { entityType }),
      ...(entityId && typeof entityId === "string" && { entityId }),
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      skip: skip ? parseInt(skip as string) : undefined,
    };

    const result = await AuditServices.getAuditLogs(filters);

    res.status(200).json({
      success: true,
      message: "Audit logs retrieved successfully",
      data: result.logs,
      meta: {
        total: result.total,
        limit: filters.limit,
        skip: filters.skip,
      },
    });
  } catch (error) {
    logger.error("Failed to retrieve audit logs", { error });
    res.status(500).json({
      success: false,
      message: "Failed to retrieve audit logs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAuditLogStats = async (req: Request, res: Response) => {
  try {
    const stats = await AuditServices.getAuditLogStats();

    res.status(200).json({
      success: true,
      message: "Audit log stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    logger.error("Failed to retrieve audit log stats", { error });
    res.status(500).json({
      success: false,
      message: "Failed to retrieve audit log stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUserAuditLogs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    const logs = await AuditServices.getAuditLogsByUser(
      userId as string,
      limit ? parseInt(limit as string) : 50,
    );

    res.status(200).json({
      success: true,
      message: "User audit logs retrieved successfully",
      data: logs,
    });
  } catch (error) {
    logger.error("Failed to retrieve user audit logs", { error });
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user audit logs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getEntityAuditLogs = async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit } = req.query;

    const logs = await AuditServices.getAuditLogsByEntity(
      entityType as string,
      entityId as string,
      limit ? parseInt(limit as string) : 50,
    );

    res.status(200).json({
      success: true,
      message: "Entity audit logs retrieved successfully",
      data: logs,
    });
  } catch (error) {
    logger.error("Failed to retrieve entity audit logs", { error });
    res.status(500).json({
      success: false,
      message: "Failed to retrieve entity audit logs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const AuditControllers = {
  getAuditLogs,
  getAuditLogStats,
  getUserAuditLogs,
  getEntityAuditLogs,
};
