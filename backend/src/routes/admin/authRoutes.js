import { Router } from 'express';
import { adminLogin, getDashboardData } from '../../controllers/admin/authController.js';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.js';

const router = Router();

// Admin login
router.post('/login', adminLogin);

// Admin dashboard (protected)
router.get('/dashboard', authenticate, authorizeAdmin, getDashboardData);

export default router;