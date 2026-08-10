import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.post('/', verifyToken, orderController.createOrder);
router.get('/mine', verifyToken, orderController.getMyOrders);
router.get('/', verifyToken, requireRole('admin'), orderController.listOrders);
router.get('/:id', verifyToken, orderController.getOrder);
router.patch('/:id/status', verifyToken, requireRole('admin'), orderController.updateOrderStatus);

export default router;
