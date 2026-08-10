import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Authenticated (not admin-only): customers use this for avatar uploads, admins for every other image field.
router.post('/image', verifyToken, upload.single('image'), uploadController.uploadImage);
router.delete('/image/:publicId', verifyToken, requireRole('admin'), uploadController.deleteImage);

export default router;
