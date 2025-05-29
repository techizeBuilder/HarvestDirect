const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../../controllers/user/authController');
const { authenticate, authorizeUser } = require('../../middlewares/auth');
const { handleValidationErrors } = require('../../middlewares/validation');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

// Public routes
router.post('/register', 
  authLimiter,
  registerValidation,
  handleValidationErrors,
  register
);

router.post('/login', 
  authLimiter,
  loginValidation,
  handleValidationErrors,
  login
);

// Protected routes
router.get('/profile', 
  authenticate, 
  authorizeUser, 
  getProfile
);

router.put('/profile', 
  authenticate, 
  authorizeUser,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

module.exports = router;