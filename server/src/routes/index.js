import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import reviewRoutes from './review.routes.js';
import orderRoutes from './order.routes.js';
import bannerRoutes from './banner.routes.js';
import homeSlideRoutes from './homeSlide.routes.js';
import blogRoutes from './blog.routes.js';
import settingsRoutes from './settings.routes.js';
import uploadRoutes from './upload.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);
router.use('/banners', bannerRoutes);
router.use('/home-slides', homeSlideRoutes);
router.use('/blogs', blogRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
