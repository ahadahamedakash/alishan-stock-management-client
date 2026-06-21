import { Router } from 'express';
import { AuditControllers } from './audit.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// All audit routes require authentication and admin role
router.use(authMiddleware('admin'));

/**
 * @route   GET /api/v1/audit
 * @desc    Get all audit logs with optional filters
 * @access  Admin only
 */
router.get('/', AuditControllers.getAuditLogs);

/**
 * @route   GET /api/v1/audit/stats
 * @desc    Get audit log statistics
 * @access  Admin only
 */
router.get('/stats', AuditControllers.getAuditLogStats);

/**
 * @route   GET /api/v1/audit/user/:userId
 * @desc    Get audit logs for a specific user
 * @access  Admin only
 */
router.get('/user/:userId', AuditControllers.getUserAuditLogs);

/**
 * @route   GET /api/v1/audit/entity/:entityType/:entityId
 * @desc    Get audit logs for a specific entity
 * @access  Admin only
 */
router.get('/entity/:entityType/:entityId', AuditControllers.getEntityAuditLogs);

export const auditRoutes = router;
