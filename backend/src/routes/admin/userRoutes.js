const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../../controllers/admin/userController');
const { authenticate, authorizeAdmin } = require('../../middlewares/auth');
const { handleValidationErrors } = require('../../middlewares/validation');

const router = express.Router();

// Validation rules
const createUserValidation = [
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
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

const updateUserValidation = [
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

const userIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
];

const getUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

// Apply authentication and admin authorization to all routes
router.use(authenticate, authorizeAdmin);

// Routes
router.get('/', 
  getUsersValidation,
  handleValidationErrors,
  getAllUsers
);

router.get('/:id', 
  userIdValidation,
  handleValidationErrors,
  getUserById
);

router.post('/', 
  createUserValidation,
  handleValidationErrors,
  createUser
);

router.put('/:id', 
  userIdValidation,
  updateUserValidation,
  handleValidationErrors,
  updateUser
);

router.delete('/:id', 
  userIdValidation,
  handleValidationErrors,
  deleteUser
);

module.exports = router;