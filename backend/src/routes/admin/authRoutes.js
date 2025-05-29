const express = require('express');
const { body } = require('express-validator');
const { adminLogin, getAdminProfile } = require('../../controllers/admin/authController');
const { authenticate, authorizeAdmin } = require('../../middlewares/auth');
const { handleValidationErrors } = require('../../middlewares/validation');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

// Admin login validation rules
const adminLoginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Routes
router.post('/login', 
  authLimiter,
  adminLoginValidation,
  handleValidationErrors,
  adminLogin
);

router.get('/profile', 
  authenticate, 
  authorizeAdmin, 
  getAdminProfile
);

module.exports = router;