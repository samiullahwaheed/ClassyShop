import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema, addressSchema } from '../validators/user.validator.js';

const router = Router();

router.patch('/me', verifyToken, validate(updateProfileSchema), userController.updateMe);
router.patch('/me/change-password', verifyToken, validate(changePasswordSchema), userController.changePassword);

router.get('/me/addresses', verifyToken, userController.listAddresses);
router.post('/me/addresses', verifyToken, validate(addressSchema), userController.addAddress);
router.patch('/me/addresses/:addressId', verifyToken, userController.updateAddress);
router.delete('/me/addresses/:addressId', verifyToken, userController.deleteAddress);

router.get('/me/wishlist', verifyToken, userController.getWishlist);
router.post('/me/wishlist/:productId', verifyToken, userController.addToWishlist);
router.delete('/me/wishlist/:productId', verifyToken, userController.removeFromWishlist);

router.get('/', verifyToken, requireRole('admin'), userController.listUsers);
router.patch('/:id', verifyToken, requireRole('admin'), userController.updateUser);
router.delete('/:id', verifyToken, requireRole('admin'), userController.deleteUser);

export default router;
