// /apps/media-service/src/routes/quota.routes.ts
import { Router } from 'express';
import { quotaService } from '../services/quota.service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/media/quota
 * Eigene Quota abrufen
 */
router.get('/',
  authMiddleware,
  async (req, res, next) => {
    try {
      const stats = await quotaService.getStats(req.user!.id);
      
      if (!stats) {
        // Quota erstellen wenn nicht vorhanden
        await quotaService.getOrCreate(req.user!.id, req.user!.premium);
        const newStats = await quotaService.getStats(req.user!.id);
        return res.json(newStats);
      }
      
      res.json(stats);
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/media/quota/upgrade
 * Zu Premium upgraden
 */
router.post('/upgrade',
  authMiddleware,
  async (req, res, next) => {
    try {
      // Normalerweise würde Premium-Status von Payment-Service kommen
      // Für jetzt: Direkt upgraden
      
      await quotaService.upgradeToPremium(req.user!.id);
      
      const stats = await quotaService.getStats(req.user!.id);
      
      res.json({ 
        success: true,
        message: 'Upgraded to Premium',
        quota: stats
      });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/media/quota/downgrade
 * Zu Free downgraden
 */
router.post('/downgrade',
  authMiddleware,
  async (req, res, next) => {
    try {
      await quotaService.downgradeToFree(req.user!.id);
      
      const stats = await quotaService.getStats(req.user!.id);
      
      res.json({ 
        success: true,
        message: 'Downgraded to Free',
        quota: stats
      });
      
    } catch (error) {
      next(error);
    }
  }
);

export default router;
