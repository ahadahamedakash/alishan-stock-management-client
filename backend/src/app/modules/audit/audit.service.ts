import { AuditLog } from './audit.model';
import { IAuditLog, IAuditLogFilters } from './audit.interface';
import logger from '../../config/logger';

const createAuditLog = async (auditData: IAuditLog) => {
  try {
    const log = await AuditLog.create(auditData);
    logger.debug('Audit log created', {
      auditLogId: log._id.toString(),
      action: log.action,
      entityType: log.entityType,
      userId: log.userId,
    });
    return log;
  } catch (error) {
    // Don't throw - logging failure shouldn't break the app
    logger.error('Failed to create audit log', { error, auditData });
  }
};

const getAuditLogs = async (filters: IAuditLogFilters) => {
  try {
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.entityType) query.entityType = filters.entityType;
    if (filters.entityId) query.entityId = filters.entityId;

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const limit = filters.limit || 100;
    const skip = filters.skip || 0;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await AuditLog.countDocuments(query);

    logger.debug('Audit logs retrieved', { count: logs.length, total });

    return { logs, total };
  } catch (error) {
    logger.error('Failed to retrieve audit logs', { error });
    throw error;
  }
};

const getAuditLogStats = async () => {
  try {
    const stats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    logger.debug('Audit log stats retrieved', { stats });

    return stats;
  } catch (error) {
    logger.error('Failed to retrieve audit log stats', { error });
    throw error;
  }
};

const getAuditLogsByUser = async (userId: string, limit: number = 50) => {
  try {
    const logs = await AuditLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return logs;
  } catch (error) {
    logger.error('Failed to retrieve user audit logs', { error, userId });
    throw error;
  }
};

const getAuditLogsByEntity = async (entityType: string, entityId: string, limit: number = 50) => {
  try {
    const logs = await AuditLog.find({ entityType, entityId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return logs;
  } catch (error) {
    logger.error('Failed to retrieve entity audit logs', { error, entityType, entityId });
    throw error;
  }
};

export const AuditServices = {
  createAuditLog,
  getAuditLogs,
  getAuditLogStats,
  getAuditLogsByUser,
  getAuditLogsByEntity,
};
