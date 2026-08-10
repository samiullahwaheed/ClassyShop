import { Router } from 'express';
import { HomeSlide } from '../models/HomeSlide.js';
import { createSimpleCrudController } from '../controllers/simpleCrud.factory.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();
const controller = createSimpleCrudController(HomeSlide, 'Home slide not found');

router.get('/', controller.list);
router.post('/', verifyToken, requireRole('admin'), controller.create);
router.patch('/:id', verifyToken, requireRole('admin'), controller.update);
router.delete('/:id', verifyToken, requireRole('admin'), controller.remove);

export default router;
