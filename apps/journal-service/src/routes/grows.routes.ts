import { Router } from 'express';
import { z } from 'zod';
import { growService } from '../services/grow.service';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const createGrowSchema = z.object({
  strainName: z.string().min(1).max(100),
  strainId: z.string().optional(),
  breeder: z.string().max(100).optional(),
  type: z.enum(['feminized', 'autoflower', 'regular', 'clone']),
  environment: z.enum(['indoor', 'outdoor', 'greenhouse']),
  startDate: z.string().datetime(),
  lightWattage: z.number().min(0).max(10000).optional(),
  lightType: z.string().max(50).optional(),
  tentSize: z.string().max(50).optional(),
  medium: z.string().max(100).optional(),
  potSize: z.string().max(50).optional(),
  nutrients: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional()
});

const updateGrowSchema = createGrowSchema.partial();

const harvestSchema = z.object({
  harvestDate: z.string().datetime(),
  yieldWet: z.number().min(0).optional(),
  yieldDry: z.number().min(0).optional(),
  quality: z.number().min(1).max(5).optional()
});

router.post('/',
  authMiddleware,
  validate(createGrowSchema),
  async (req, res, next) => {
    try {
      const grow = await growService.create(req.user!.id, req.body);
      res.status(201).json({ grow });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { status, limit, skip } = req.query;
      
      const result = await growService.getUserGrows(req.user!.id, {
        status: status as string,
        limit: parseInt(limit as string) || 20,
        skip: parseInt(skip as string) || 0
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      const grow = await growService.getById(req.params.id, req.user?.id);
      
      if (!grow) {
        return res.status(404).json({ error: 'Grow not found' });
      }
      
      res.json({ grow });
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  authMiddleware,
  validate(updateGrowSchema),
  async (req, res, next) => {
    try {
      const grow = await growService.update(req.params.id, req.user!.id, req.body);
      res.json({ grow });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      await growService.delete(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/:id/harvest',
  authMiddleware,
  validate(harvestSchema),
  async (req, res, next) => {
    try {
      const grow = await growService.markHarvested(
        req.params.id,
        req.user!.id,
        req.body
      );
      res.json({ grow });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
