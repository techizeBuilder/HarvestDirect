import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  getFeaturedProducts, 
  getProductsByCategory,
  getAllFarmers,
  getFeaturedFarmers,
  getFarmerById
} from '../../controllers/user/productController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// Protected product routes - require authentication
router.get('/', authenticate, getAllProducts);
router.get('/featured', authenticate, getFeaturedProducts);
router.get('/category/:category', authenticate, getProductsByCategory);
router.get('/:id', authenticate, getProductById);

export default router;