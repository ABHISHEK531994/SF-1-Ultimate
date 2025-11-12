import { Router } from 'express';
import { z } from 'zod';
import { Preference } from '../models/Preference.model';
import { pushService } from '../services/push.service';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const updatePreferencesSchema = z.object({
  enabled: z.boolean().optional(),
  preferences: z.object({
    comment: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    reply: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    reaction: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    follow: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    mention: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    price_alert: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    milestone: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    badge: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional(),
    system: z.object({
      in_app: z.boolean(),
      email: z.boolean(),
      push: z.boolean()
    }).optional()
  }).optional(),
  emailDigest: z.enum(['instant', 'hourly', 'daily', 'never']).optional(),
  emailDigestTime: z.string().optional(),
  quietHours: z.object({
    enabled: z.boolean(),
    start: z.string().optional(),
    end: z.string().optional()
  }).optional()
});

const registerDeviceSchema = z.object({
  token: z.string(),
  platform: z.enum(['ios', 'android', 'web']),
  deviceName: z.string().optional(),
  appVersion: z.string().optional(),
  osVersion: z.string().optional()
});

/**
 * GET /api/preferences
 * Get preferences
 */
router.get('/',
  authMiddleware,
  async (req, res, next) => {
    try {
      let pref = await Preference.findOne({ userId: req.user!.id });
      
      if (!pref) {
        pref = new Preference({ userId: req.user!.id });
        await pref.save();
      }
      
      res.json({ preferences: pref });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/preferences
 * Update preferences
 */
router.patch('/',
  authMiddleware,
  validate(updatePreferencesSchema),
  async (req, res, next) => {
    try {
      const pref = await Preference.findOneAndUpdate(
        { userId: req.user!.id },
        { $set: req.body },
        { new: true, upsert: true }
      );
      
      res.json({ preferences: pref });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/preferences/devices
 * Register push device
 */
router.post('/devices',
  authMiddleware,
  validate(registerDeviceSchema),
  async (req, res, next) => {
    try {
      await pushService.registerDevice(req.user!.id, req.body);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/preferences/devices/:token
 * Unregister push device
 */
router.delete('/devices/:token',
  authMiddleware,
  async (req, res, next) => {
    try {
      await pushService.unregisterDevice(req.params.token);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;