import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { categorySchema } from '../validators/product.validator.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.get('/:slug', categoryController.getCategory);
router.post('/', verifyToken, requireRole('admin'), validate(categorySchema), categoryController.createCategory);
router.patch('/:id', verifyToken, requireRole('admin'), categoryController.updateCategory);
router.delete('/:id', verifyToken, requireRole('admin'), categoryController.deleteCategory);

export default router;
