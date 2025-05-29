import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../controllers/admin/productController.js';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.js';

const router = Router();

// Apply admin authentication to all routes
router.use(authenticate, authorizeAdmin);

// Product management routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;