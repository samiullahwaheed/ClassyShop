import { Router } from 'express';
import { SiteSettings } from '../models/SiteSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const settings = await SiteSettings.getSingleton();
    res.json({ success: true, data: { settings } });
  })
);

router.patch(
  '/logo',
  verifyToken,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const settings = await SiteSettings.getSingleton();
    settings.logo = req.body.logo;
    await settings.save();
    res.json({ success: true, data: { settings } });
  })
);

export default router;
