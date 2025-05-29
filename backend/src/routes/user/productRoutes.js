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

const router = Router();

// Product routes (public)
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;