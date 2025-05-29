import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} from '../../controllers/user/authController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;