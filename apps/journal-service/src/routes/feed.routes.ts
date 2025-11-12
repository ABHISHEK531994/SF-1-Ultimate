import { Router } from 'express';
import { feedService } from '../services/feed.service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/',
  async (req, res, next) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;
      const sortBy = (req.query.sortBy as string) || 'recent';
      
      const result = await feedService.getPublicFeed({
        limit,
        skip,
        sortBy,
        userId: req.user?.id
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/following',
  authMiddleware,
  async (req, res, next) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;
      
      const result = await feedService.getFollowingFeed({
        userId: req.user!.id,
        limit,
        skip
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/strain/:strainId',
  async (req, res, next) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;
      
      const result = await feedService.getStrainFeed({
        strainId: req.params.strainId,
        limit,
        skip,
        userId: req.user?.id
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/harvests',
  async (req, res, next) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;
      
      const result = await feedService.getHarvestFeed({
        limit,
        skip,
        userId: req.user?.id
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
