// /apps/media-service/src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { uploadService } from '../services/upload.service';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Multer-Config (Memory-Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 20 // Max 20 Dateien gleichzeitig
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf'
    ];
    
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

// Validation-Schema
const uploadOptionsSchema = z.object({
  category: z.enum(['avatar', 'journal', 'community', 'strain']).optional(),
  generateThumbnails: z.boolean().optional(),
  linkToType: z.string().optional(),
  linkToId: z.string().optional()
});

/**
 * POST /api/media/upload
 * Single-Upload
 */
router.post('/upload',
  authMiddleware,
  upload.single('file'),
  validate(uploadOptionsSchema),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      
      const options: any = {
        category: req.body.category,
        generateThumbnails: req.body.generateThumbnails !== 'false'
      };
      
      if (req.body.linkToType && req.body.linkToId) {
        options.linkTo = {
          type: req.body.linkToType,
          id: req.body.linkToId
        };
      }
      
      const file = await uploadService.upload({
        userId: req.user!.id,
        file: req.file,
        isPremium: req.user!.premium,
        options
      });
      
      res.status(201).json({ file });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/media/upload/multi
 * Multi-Upload
 */
router.post('/upload/multi',
  authMiddleware,
  upload.array('files', 20),
  validate(uploadOptionsSchema),
  async (req, res, next) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }
      
      const options: any = {
        category: req.body.category,
        generateThumbnails: req.body.generateThumbnails !== 'false'
      };
      
      if (req.body.linkToType && req.body.linkToId) {
        options.linkTo = {
          type: req.body.linkToType,
          id: req.body.linkToId
        };
      }
      
      const files = await uploadService.uploadBatch({
        userId: req.user!.id,
        files: req.files,
        isPremium: req.user!.premium,
        options
      });
      
      res.status(201).json({ files, count: files.length });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/media/upload/avatar
 * Avatar-Upload (Shortcut)
 */
router.post('/upload/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      
      // Nur Bilder erlaubt
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Only images allowed for avatars' });
      }
      
      const file = await uploadService.upload({
        userId: req.user!.id,
        file: req.file,
        isPremium: req.user!.premium,
        options: {
          category: 'avatar',
          generateThumbnails: true
        }
      });
      
      // TODO: User-Avatar in User-Service updaten
      // await fetch(`${USER_SERVICE_URL}/api/users/me/avatar`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ avatarUrl: file.url })
      // });
      
      res.status(201).json({ file });
      
    } catch (error) {
      next(error);
    }
  }
);

export default router;
