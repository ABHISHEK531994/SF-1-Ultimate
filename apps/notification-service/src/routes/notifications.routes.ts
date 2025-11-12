import { Router } from 'express';
import { notificationService } from '../services/notification.service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/notifications
 * Get all notifications
 */
router.get('/',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { limit, skip, unreadOnly } = req.query;
      
      const result = await notificationService.getForUser(req.user!.id, {
        limit: parseInt(limit as string) || 50,
        skip: parseInt(skip as string) || 0,
        unreadOnly: unreadOnly === 'true'
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/notifications/unread-count
 * Get unread count
 */
router.get('/unread-count',
  authMiddleware,
  async (req, res, next) => {
    try {
      const count = await notificationService.getUnreadCount(req.user!.id);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/notifications/:id/read
 * Mark as read
 */
router.patch('/:id/read',
  authMiddleware,
  async (req, res, next) => {
    try {
      await notificationService.markAsRead(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/notifications/read-all
 * Mark all as read
 */
router.post('/read-all',
  authMiddleware,
  async (req, res, next) => {
    try {
      await notificationService.markAllAsRead(req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/notifications/:id
 * Delete notification
 */
router.delete('/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      await notificationService.deleteNotification(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;