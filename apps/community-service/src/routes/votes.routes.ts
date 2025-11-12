// /apps/community-service/src/routes/votes.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import { voteService } from '../services/vote.service';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const voteSchema = z.object({
  targetId: z.string().min(1),
  targetType: z.enum(['thread', 'reply']),
  type: z.enum(['upvote', 'downvote'])
});

/**
 * POST /api/community/vote
 * Vote erstellen/ändern/entfernen
 */
router.post('/',
  authMiddleware,
  validate(voteSchema),
  async (req, res, next) => {
    try {
      const result = await voteService.vote(req.user!.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/community/votes/batch
 * User's Votes für mehrere Items abrufen
 */
router.post('/batch',
  authMiddleware,
  validate(z.object({
    targetIds: z.array(z.string()).max(100)
  })),
  async (req, res, next) => {
    try {
      const votes = await voteService.getUserVotes(
        req.user!.id,
        req.body.targetIds
      );
      
      // Map zu Object konvertieren
      const votesObj: Record<string, string> = {};
      votes.forEach((type, id) => {
        votesObj[id] = type;
      });
      
      res.json({ votes: votesObj });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/community/votes/top
 * Top-Voted Content
 */
router.get('/top',
  optionalAuthMiddleware,
  async (req, res, next) => {
    try {
      const { type, period, limit } = req.query;
      
      const results = await voteService.getTopVoted({
        type: (type as any) || 'thread',
        period: (period as any) || 'week',
        limit: parseInt(limit as string) || 10
      });
      
      res.json({ results });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
