import express from 'express';
import { userRegister, userLogin } from '../../controllers/user/authController.js';

const router = express.Router();

// User registration route
router.post('/register', userRegister);

// User login route
router.post('/login', userLogin);

export default router;