const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateProductStock
} = require('../../controllers/admin/productController');
const { authenticate, authorizeAdmin } = require('../../middlewares/auth');
const { handleValidationErrors } = require('../../middlewares/validation');

const router = express.Router();

// Validation rules
const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('imageUrl')
    .isURL()
    .withMessage('Please provide a valid image URL'),
  body('farmerId')
    .isInt({ min: 1 })
    .withMessage('Farmer ID must be a positive integer'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid image URL'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
];

const updateStockValidation = [
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
];

const productIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
];

const getProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  query('farmerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Farmer ID must be a positive integer'),
];

// Apply authentication and admin authorization to all routes
router.use(authenticate, authorizeAdmin);

// Routes
router.get('/', 
  getProductsValidation,
  handleValidationErrors,
  getAllProducts
);

router.post('/', 
  createProductValidation,
  handleValidationErrors,
  createProduct
);

router.put('/:id', 
  productIdValidation,
  updateProductValidation,
  handleValidationErrors,
  updateProduct
);

router.delete('/:id', 
  productIdValidation,
  handleValidationErrors,
  deleteProduct
);

router.patch('/:id/stock', 
  productIdValidation,
  updateStockValidation,
  handleValidationErrors,
  updateProductStock
);

module.exports = router;