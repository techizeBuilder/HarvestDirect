import { Router } from 'express';
import { adminLogin, getAdminProfile } from '../../controllers/admin/authController.js';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.js';

const router = Router();

// Admin login
router.post('/login', adminLogin);

// Admin profile (protected)
router.get('/profile', authenticate, authorizeAdmin, getAdminProfile);

export default router;