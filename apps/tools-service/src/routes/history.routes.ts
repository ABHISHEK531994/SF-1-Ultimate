import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { calculatorService } from '../services/calculator.service';
import { Calculation } from '../models/Calculation.model';

const router = Router();

router.get('/history',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { type, limit, skip } = req.query;
      
      const result = await calculatorService.getHistory(req.user!.id, {
        type: type as string,
        limit: parseInt(limit as string) || 50,
        skip: parseInt(skip as string) || 0
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/history/stats',
  authMiddleware,
  async (req, res, next) => {
    try {
      const mostUsed = await calculatorService.getMostUsed(req.user!.id);
      res.json({ mostUsed });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/favorites',
  authMiddleware,
  async (req, res, next) => {
    try {
      const favorites = await calculatorService.getFavorites(req.user!.id);
      res.json({ favorites });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/calculations/:id/favorite',
  authMiddleware,
  async (req, res, next) => {
    try {
      await calculatorService.toggleFavorite(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/history',
  authMiddleware,
  async (req, res, next) => {
    try {
      await Calculation.deleteMany({ 
        userId: req.user!.id,
        isFavorite: false 
      });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
