import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { productSchema, productUpdateSchema, lookupSchema } from '../validators/product.validator.js';

const router = Router();

router.get('/lookups/:type', productController.listLookup);
router.post('/lookups/:type', verifyToken, requireRole('admin'), validate(lookupSchema), productController.createLookup);
router.delete('/lookups/:type/:id', verifyToken, requireRole('admin'), productController.deleteLookup);

router.get('/related/:id', productController.getRelatedProducts);
router.get('/', productController.listProducts);
router.get('/:slug', productController.getProduct);
router.post('/', verifyToken, requireRole('admin'), validate(productSchema), productController.createProduct);
router.patch('/:id', verifyToken, requireRole('admin'), validate(productUpdateSchema), productController.updateProduct);
router.delete('/:id', verifyToken, requireRole('admin'), productController.deleteProduct);

export default router;
