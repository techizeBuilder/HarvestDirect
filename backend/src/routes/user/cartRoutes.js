import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart 
} from '../../controllers/user/cartController.js';
import { getSessionId } from '../../middlewares/rateLimiter.js';

const router = Router();

// Apply session middleware to all cart routes
router.use(getSessionId);

// Cart routes
router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeFromCart);

export default router;