// /apps/media-service/src/routes/files.routes.ts
import { Router } from 'express';
import { uploadService } from '../services/upload.service';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/media/files
 * Eigene Files abrufen
 */
router.get('/',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { fileType, category, limit, skip } = req.query;
      
      const result = await uploadService.getUserFiles(req.user!.id, {
        fileType: fileType as string,
        category: category as string,
        limit: parseInt(limit as string) || 50,
        skip: parseInt(skip as string) || 0
      });
      
      res.json(result);
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/media/files/:id
 * File-Details abrufen
 */
router.get('/:id',
  optionalAuthMiddleware,
  async (req, res, next) => {
    try {
      const file = await uploadService.getFile(
        req.params.id,
        req.user?.id // Optional: Nur eigene Files
      );
      
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      res.json({ file });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/media/files/:id
 * File löschen
 */
router.delete('/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      await uploadService.delete(req.params.id, req.user!.id);
      res.json({ success: true });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/media/files/:id/link
 * File mit Entity verknüpfen
 */
router.post('/:id/link',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { type, id } = req.body;
      
      if (!type || !id) {
        return res.status(400).json({ error: 'type and id required' });
      }
      
      await uploadService.linkToEntity(req.params.id, { type, id });
      
      res.json({ success: true });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/media/files/:id/link
 * Verknüpfung entfernen
 */
router.delete('/:id/link',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { type, id } = req.body;
      
      if (!type || !id) {
        return res.status(400).json({ error: 'type and id required' });
      }
      
      await uploadService.unlinkFromEntity(req.params.id, { type, id });
      
      res.json({ success: true });
      
    } catch (error) {
      next(error);
    }
  }
);

export default router;
