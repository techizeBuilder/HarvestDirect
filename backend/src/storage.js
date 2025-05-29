import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { 
  products, farmers, carts, cartItems, testimonials, newsletterSubscriptions, productReviews,
  users, payments, subscriptions, subscriptionStatusEnum, contactMessages, orders, orderItems
} from "../../shared/schema.js";
import { productData } from './productData.js';
import { farmerData } from './farmerData.js';
import { db } from './config/db.js';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

// Storage interface with CRUD methods
export class IStorage {
  // Products
  async getAllProducts() { throw new Error('Not implemented'); }
  async getProductById(id) { throw new Error('Not implemented'); }
  async getProductsByCategory(category) { throw new Error('Not implemented'); }
  async getFeaturedProducts() { throw new Error('Not implemented'); }

  // Farmers
  async getAllFarmers() { throw new Error('Not implemented'); }
  async getFarmerById(id) { throw new Error('Not implemented'); }
  async getFeaturedFarmers() { throw new Error('Not implemented'); }

  // Cart
  async getCart(sessionId) { throw new Error('Not implemented'); }
  async addToCart(sessionId, productId, quantity) { throw new Error('Not implemented'); }
  async updateCartItem(sessionId, productId, quantity) { throw new Error('Not implemented'); }
  async removeFromCart(sessionId, productId) { throw new Error('Not implemented'); }

  // Testimonials
  async getAllTestimonials() { throw new Error('Not implemented'); }

  // Newsletter
  async addNewsletterSubscription(subscription) { throw new Error('Not implemented'); }
  
  // Product Reviews
  async getProductReviews(productId) { throw new Error('Not implemented'); }
  async addProductReview(review) { throw new Error('Not implemented'); }
  async canUserReviewProduct(userId, productId) { throw new Error('Not implemented'); }
  async getUserProductReviews(userId) { throw new Error('Not implemented'); }
  
  // Contact Messages
  async addContactMessage(message) { throw new Error('Not implemented'); }
  async getAllContactMessages() { throw new Error('Not implemented'); }
  async getContactMessageById(id) { throw new Error('Not implemented'); }
  async updateContactMessageStatus(id, status) { throw new Error('Not implemented'); }

  // User Authentication
  async createUser(user) { throw new Error('Not implemented'); }
  async getUserByEmail(email) { throw new Error('Not implemented'); }
  async getUserById(id) { throw new Error('Not implemented'); }
  async updateUser(id, userData) { throw new Error('Not implemented'); }
  async verifyUserEmail(token) { throw new Error('Not implemented'); }
  async resetPasswordRequest(email) { throw new Error('Not implemented'); }
  async resetPassword(token, newPassword) { throw new Error('Not implemented'); }

  // Payments
  async createPayment(payment) { throw new Error('Not implemented'); }
  async getPaymentsByUserId(userId) { throw new Error('Not implemented'); }
  async getPaymentById(id) { throw new Error('Not implemented'); }

  // Subscriptions
  async createSubscription(subscription) { throw new Error('Not implemented'); }
  async getSubscriptionsByUserId(userId) { throw new Error('Not implemented'); }
  async getSubscriptionById(id) { throw new Error('Not implemented'); }
  async updateSubscriptionStatus(id, status) { throw new Error('Not implemented'); }
}

export class DatabaseStorage extends IStorage {
  async getAllProducts() {
    const result = await db.select().from(products);
    return result;
  }

  async getProductById(id) {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategory(category) {
    const result = await db.select().from(products).where(eq(products.category, category));
    return result;
  }

  async getFeaturedProducts() {
    const result = await db.select().from(products).where(eq(products.featured, true));
    return result;
  }

  async getAllFarmers() {
    const result = await db.select().from(farmers);
    return result;
  }

  async getFarmerById(id) {
    const result = await db.select().from(farmers).where(eq(farmers.id, id));
    return result[0];
  }

  async getFeaturedFarmers() {
    const result = await db.select().from(farmers).where(eq(farmers.featured, true));
    return result;
  }

  async getCart(sessionId) {
    // Find or create cart
    let [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    
    if (!cart) {
      const [newCart] = await db.insert(carts).values({ sessionId }).returning();
      cart = newCart;
    }

    return this.buildCartWithItems(cart);
  }

  async addToCart(sessionId, productId, quantity) {
    // Get cart or create if not exists
    let [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    
    if (!cart) {
      [cart] = await db.insert(carts).values({ sessionId }).returning();
    }

    // Check if item already exists in cart
    const [existingItem] = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, productId)
      ));

    if (existingItem) {
      // Update existing item
      await db.update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        quantity
      });
    }

    // Update cart's updatedAt timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    return this.buildCartWithItems(cart);
  }

  async updateCartItem(sessionId, productId, quantity) {
    // Get cart
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Find cart item
    const [cartItem] = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, productId)
      ));

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db.delete(cartItems).where(eq(cartItems.id, cartItem.id));
    } else {
      // Update quantity
      await db.update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, cartItem.id));
    }

    // Update cart's updatedAt timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    return this.buildCartWithItems(cart);
  }

  async removeFromCart(sessionId, productId) {
    // Get cart
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Delete cart item
    await db.delete(cartItems)
      .where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, productId)
      ));

    // Update cart's updatedAt timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    return this.buildCartWithItems(cart);
  }

  async buildCartWithItems(cart) {
    // Get cart items with product details
    const items = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 4.99; // Free shipping over $50
    const total = subtotal + shipping;

    return {
      ...cart,
      items,
      totalItems,
      subtotal,
      shipping,
      total
    };
  }

  async getAllTestimonials() {
    const result = await db.select().from(testimonials);
    return result;
  }

  async addNewsletterSubscription(subscription) {
    const [result] = await db.insert(newsletterSubscriptions).values(subscription).returning();
    return result;
  }

  async getProductReviews(productId) {
    const result = await db.select().from(productReviews)
      .where(eq(productReviews.productId, productId));
    return result;
  }

  async addProductReview(review) {
    const [result] = await db.insert(productReviews).values(review).returning();
    return result;
  }

  async canUserReviewProduct(userId, productId) {
    // Check if user has purchased this product
    // For now, return true (implement order checking later)
    return true;
  }

  async getUserProductReviews(userId) {
    const result = await db.select().from(productReviews)
      .where(eq(productReviews.userId, userId));
    return result;
  }

  async addContactMessage(message) {
    const [result] = await db.insert(contactMessages).values(message).returning();
    return result;
  }

  async getAllContactMessages() {
    const result = await db.select().from(contactMessages);
    return result;
  }

  async getContactMessageById(id) {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return result[0];
  }

  async updateContactMessageStatus(id, status) {
    const [result] = await db.update(contactMessages)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    return result;
  }

  async createUser(user) {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserById(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async updateUser(id, userData) {
    const [result] = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result;
  }

  async verifyUserEmail(token) {
    // Implementation for email verification
    return true;
  }

  async resetPasswordRequest(email) {
    // Implementation for password reset request
    return true;
  }

  async resetPassword(token, newPassword) {
    // Implementation for password reset
    return true;
  }

  async createPayment(payment) {
    const [result] = await db.insert(payments).values(payment).returning();
    return result;
  }

  async getPaymentsByUserId(userId) {
    const result = await db.select().from(payments).where(eq(payments.userId, userId));
    return result;
  }

  async getPaymentById(id) {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async createSubscription(subscription) {
    const [result] = await db.insert(subscriptions).values(subscription).returning();
    return result;
  }

  async getSubscriptionsByUserId(userId) {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return result;
  }

  async getSubscriptionById(id) {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return result[0];
  }

  async updateSubscriptionStatus(id, status) {
    const [result] = await db.update(subscriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();