import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.use(verifyToken, requireRole('admin'));
router.get('/stats', dashboardController.getStats);
router.get('/sales-chart', dashboardController.getSalesChart);

export default router;
