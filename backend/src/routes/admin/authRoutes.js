import express from 'express';
import { adminLogin, verifyAdminToken } from '../../controllers/admin/authController.js';

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

// Admin token verification route
router.get('/verify', verifyAdminToken);

export default router;