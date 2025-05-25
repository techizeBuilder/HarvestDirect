import { Request, Response } from 'express';
import { db } from '../db';
import { products, insertProductSchema, Product } from '@shared/schema';
import { eq, like, desc, asc } from 'drizzle-orm';
import { z } from 'zod';

// GET all products with pagination, sorting and filtering
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      sort = 'id', 
      order = 'asc',
      search = '',
      category = ''
    } = req.query as Record<string, string>;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    let query = db.select().from(products);

    // Apply search filter if provided
    if (search) {
      query = query.where(like(products.name, `%${search}%`));
    }

    // Apply category filter if provided
    if (category) {
      query = query.where(eq(products.category, category));
    }

    // Count total records for pagination
    const totalQuery = db.select({ count: db.fn.count() }).from(products);
    if (search) {
      totalQuery.where(like(products.name, `%${search}%`));
    }
    if (category) {
      totalQuery.where(eq(products.category, category));
    }
    const [{ count }] = await totalQuery as [{ count: number }];

    // Apply sorting
    if (order === 'asc') {
      query = query.orderBy(asc(products[sort as keyof typeof products]));
    } else {
      query = query.orderBy(desc(products[sort as keyof typeof products]));
    }

    // Apply pagination
    query = query.limit(limitNumber).offset(offset);

    // Execute query
    const productsList = await query;

    // Return products with pagination metadata
    res.json({
      products: productsList,
      pagination: {
        total: Number(count),
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(Number(count) / limitNumber)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: String(error) });
  }
};

// GET a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [product] = await db.select().from(products).where(eq(products.id, parseInt(id)));

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: String(error) });
  }
};

// POST create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const validatedData = insertProductSchema.parse(req.body);

    // Insert product into database
    const [newProduct] = await db.insert(products).values(validatedData).returning();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid product data', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Failed to create product', error: String(error) });
  }
};

// PUT update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate request body against schema
    const validatedData = insertProductSchema.parse(req.body);

    // Update product in database
    const [updatedProduct] = await db
      .update(products)
      .set(validatedData)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid product data', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Failed to update product', error: String(error) });
  }
};

// PATCH toggle product featured status
export const toggleProductFeatured = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get current product
    const [product] = await db.select().from(products).where(eq(products.id, parseInt(id)));
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Toggle featured status
    const [updatedProduct] = await db
      .update(products)
      .set({ featured: !product.featured })
      .where(eq(products.id, parseInt(id)))
      .returning();

    res.json({
      message: `Product ${updatedProduct.featured ? 'featured' : 'unfeatured'} successfully`,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error toggling product featured status:', error);
    res.status(500).json({ message: 'Failed to update product', error: String(error) });
  }
};

// DELETE a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Delete product from database
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: String(error) });
  }
};

// GET product categories
export const getProductCategories = async (req: Request, res: Response) => {
  try {
    // Get unique categories from products table
    const categoriesResult = await db
      .selectDistinct({ category: products.category })
      .from(products);
    
    const categories = categoriesResult.map(row => row.category);
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: String(error) });
  }
};

// Get product stock count
export const getProductStock = async (req: Request, res: Response) => {
  try {
    // Count products by stock level
    const lowStockThreshold = 20;
    
    // Get all products
    const allProducts = await db.select().from(products);
    
    // Count products by stock status
    const inStock = allProducts.filter(p => p.stockQuantity > lowStockThreshold).length;
    const lowStock = allProducts.filter(p => p.stockQuantity <= lowStockThreshold && p.stockQuantity > 0).length;
    const outOfStock = allProducts.filter(p => p.stockQuantity === 0).length;
    
    res.json({
      total: allProducts.length,
      inStock,
      lowStock,
      outOfStock
    });
  } catch (error) {
    console.error('Error fetching product stock counts:', error);
    res.status(500).json({ message: 'Failed to fetch stock counts', error: String(error) });
  }
};

// Update product stock
export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;
    
    if (typeof stockQuantity !== 'number' || stockQuantity < 0) {
      return res.status(400).json({ message: 'Invalid stock quantity' });
    }
    
    // Update product stock in database
    const [updatedProduct] = await db
      .update(products)
      .set({ stockQuantity })
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product stock updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({ message: 'Failed to update product stock', error: String(error) });
  }
};