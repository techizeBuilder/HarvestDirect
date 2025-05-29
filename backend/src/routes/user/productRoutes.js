const express = require('express');
const { param, query } = require('express-validator');
const { 
  getAllProducts, 
  getProductById, 
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
} = require('../../controllers/user/productController');
const { handleValidationErrors } = require('../../middlewares/validation');
const { apiLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

// Validation rules
const productIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
];

const categoryValidation = [
  param('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
];

const getProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
];

const searchValidation = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
];

const featuredProductsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
];

// Apply rate limiting to all routes
router.use(apiLimiter);

// Routes
router.get('/', 
  getProductsValidation,
  handleValidationErrors,
  getAllProducts
);

router.get('/featured', 
  featuredProductsValidation,
  handleValidationErrors,
  getFeaturedProducts
);

router.get('/search', 
  searchValidation,
  handleValidationErrors,
  searchProducts
);

router.get('/category/:category', 
  categoryValidation,
  getProductsValidation,
  handleValidationErrors,
  getProductsByCategory
);

router.get('/:id', 
  productIdValidation,
  handleValidationErrors,
  getProductById
);

module.exports = router;