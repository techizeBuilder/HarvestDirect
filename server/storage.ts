import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { 
  Product, InsertProduct, 
  Farmer, InsertFarmer, 
  Cart, InsertCart, 
  CartItem, InsertCartItem,
  CartWithItems, 
  Testimonial, InsertTestimonial,
  NewsletterSubscription, InsertNewsletterSubscription,
  ProductReview, InsertProductReview,
  User, InsertUser,
  Payment, InsertPayment,
  Subscription, InsertSubscription,
  ContactMessage, InsertContactMessage,
  products, farmers, carts, cartItems, testimonials, newsletterSubscriptions, productReviews,
  users, payments, subscriptions, subscriptionStatusEnum, contactMessages, orders, orderItems
} from '@shared/schema';
import { productData } from './productData';
import { farmerData } from './farmerData';
import { db } from './db';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;

  // Farmers
  getAllFarmers(): Promise<Farmer[]>;
  getFarmerById(id: number): Promise<Farmer | undefined>;
  getFeaturedFarmers(): Promise<Farmer[]>;

  // Cart
  getCart(sessionId: string): Promise<CartWithItems>;
  addToCart(sessionId: string, productId: number, quantity: number): Promise<CartWithItems>;
  updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartWithItems>;
  removeFromCart(sessionId: string, productId: number): Promise<CartWithItems>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;

  // Newsletter
  addNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  
  // Product Reviews
  getProductReviews(productId: number): Promise<ProductReview[]>;
  addProductReview(review: InsertProductReview): Promise<ProductReview>;
  canUserReviewProduct(userId: number, productId: number): Promise<boolean>;
  getUserProductReviews(userId: number): Promise<ProductReview[]>;
  
  // Contact Messages
  addContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  updateContactMessageStatus(id: number, status: string): Promise<ContactMessage>;

  // User Authentication
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User>;
  verifyUserEmail(token: string): Promise<boolean>;
  resetPasswordRequest(email: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  getPaymentById(id: number): Promise<Payment | undefined>;

  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionsByUserId(userId: number): Promise<Subscription[]>;
  getSubscriptionById(id: number): Promise<Subscription | undefined>;
  updateSubscriptionStatus(id: number, status: string): Promise<Subscription>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private farmers: Map<number, Farmer>;
  private carts: Map<string, Cart>;
  private cartItems: Map<number, CartItem>;
  private testimonials: Map<number, Testimonial>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private productReviews: Map<number, ProductReview>;
  private users: Map<number, User>;
  private payments: Map<number, Payment>;
  private subscriptions: Map<number, Subscription>;
  private contactMessages: Map<number, ContactMessage>;
  
  private currentCartItemId: number;
  private currentNewsletterSubscriptionId: number;
  private currentProductReviewId: number;
  private currentUserId: number;
  private currentPaymentId: number;
  private currentSubscriptionId: number;
  private currentContactMessageId: number;

  constructor() {
    this.products = new Map();
    this.farmers = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.testimonials = new Map();
    this.newsletterSubscriptions = new Map();
    this.productReviews = new Map();
    this.users = new Map();
    this.payments = new Map();
    this.subscriptions = new Map();
    this.contactMessages = new Map();
    
    this.currentCartItemId = 1;
    this.currentNewsletterSubscriptionId = 1;
    this.currentProductReviewId = 1;
    this.currentUserId = 1;
    this.currentPaymentId = 1;
    this.currentSubscriptionId = 1;
    this.currentContactMessageId = 1;
    
    // Initialize with seed data
    this.initializeProducts();
    this.initializeFarmers();
    this.initializeTestimonials();
  }

  private initializeProducts(): void {
    productData.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  private initializeFarmers(): void {
    farmerData.forEach(farmer => {
      this.farmers.set(farmer.id, farmer);
    });
  }

  private initializeTestimonials(): void {
    const testimonials: Testimonial[] = [
      {
        id: 1,
        name: "Sarah K.",
        title: "Coffee Enthusiast",
        content: "I've been ordering the cardamom and coffee beans for over a year now. The difference in flavor compared to store-bought is remarkable. You can taste the care that goes into growing these products.",
        rating: 5,
        imageInitials: "SK"
      },
      {
        id: 2,
        name: "Rahul M.",
        title: "Home Chef",
        content: "The rice varieties are exceptional. I've discovered flavors I never knew existed in rice! Knowing my purchase supports traditional farming methods makes it even better.",
        rating: 5,
        imageInitials: "RM"
      },
      {
        id: 3,
        name: "Anita T.",
        title: "Tea Connoisseur",
        content: "I love the transparency about where each product comes from. The tea leaves have such a vibrant flavor and aroma that you just can't find in commercial brands. Worth every penny!",
        rating: 4.5,
        imageInitials: "AT"
      },
      {
        id: 4,
        name: "Deepa P.",
        title: "Health Enthusiast",
        content: "The moringa leaves have become a staple in my kitchen. Knowing they're grown without chemicals gives me peace of mind, and the flavor is incomparable to anything I've found elsewhere.",
        rating: 5,
        imageInitials: "DP"
      }
    ];

    testimonials.forEach(testimonial => {
      this.testimonials.set(testimonial.id, testimonial);
    });
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured
    );
  }

  // Farmer methods
  async getAllFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values());
  }

  async getFarmerById(id: number): Promise<Farmer | undefined> {
    return this.farmers.get(id);
  }

  async getFeaturedFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values()).filter(
      farmer => farmer.featured
    );
  }

  // Cart methods
  async getCart(sessionId: string): Promise<CartWithItems> {
    let cart = this.carts.get(sessionId);
    
    if (!cart) {
      cart = {
        id: 1, // In a real DB this would be auto-incremented
        sessionId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.carts.set(sessionId, cart);
    }

    return this.buildCartWithItems(cart);
  }

  async addToCart(sessionId: string, productId: number, quantity: number): Promise<CartWithItems> {
    let cart = this.carts.get(sessionId);
    
    if (!cart) {
      cart = {
        id: 1, // In a real DB this would be auto-incremented
        sessionId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.carts.set(sessionId, cart);
    }

    // Check if item already exists in cart
    const existingCartItems = Array.from(this.cartItems.values()).filter(
      item => item.cartId === cart!.id && item.productId === productId
    );

    if (existingCartItems.length > 0) {
      const existingItem = existingCartItems[0];
      existingItem.quantity += quantity;
      this.cartItems.set(existingItem.id, existingItem);
    } else {
      const newItem: CartItem = {
        id: this.currentCartItemId++,
        cartId: cart.id,
        productId,
        quantity
      };
      this.cartItems.set(newItem.id, newItem);
    }

    // Update cart's updatedAt timestamp
    cart.updatedAt = new Date();
    this.carts.set(sessionId, cart);

    return this.buildCartWithItems(cart);
  }

  async updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartWithItems> {
    const cart = this.carts.get(sessionId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItems = Array.from(this.cartItems.values()).filter(
      item => item.cartId === cart.id && item.productId === productId
    );

    if (cartItems.length === 0) {
      throw new Error("Cart item not found");
    }

    const cartItem = cartItems[0];
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.cartItems.delete(cartItem.id);
    } else {
      cartItem.quantity = quantity;
      this.cartItems.set(cartItem.id, cartItem);
    }

    // Update cart's updatedAt timestamp
    cart.updatedAt = new Date();
    this.carts.set(sessionId, cart);

    return this.buildCartWithItems(cart);
  }

  async removeFromCart(sessionId: string, productId: number): Promise<CartWithItems> {
    const cart = this.carts.get(sessionId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItems = Array.from(this.cartItems.values()).filter(
      item => item.cartId === cart.id && item.productId === productId
    );

    if (cartItems.length === 0) {
      throw new Error("Cart item not found");
    }

    const cartItem = cartItems[0];
    this.cartItems.delete(cartItem.id);

    // Update cart's updatedAt timestamp
    cart.updatedAt = new Date();
    this.carts.set(sessionId, cart);

    return this.buildCartWithItems(cart);
  }

  private buildCartWithItems(cart: Cart): CartWithItems {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.cartId === cart.id)
      .map(item => {
        const product = this.products.get(item.productId);
        
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        
        return { ...item, product };
      });

    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 4.99 : 0;
    const total = subtotal + shipping;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...cart,
      items,
      totalItems,
      subtotal,
      shipping,
      total
    };
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  // Newsletter methods
  async addNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if email already exists
    const existingSubscription = Array.from(this.newsletterSubscriptions.values()).find(
      sub => sub.email === subscription.email
    );

    if (existingSubscription) {
      throw new Error("Email already subscribed");
    }

    const newSubscription: NewsletterSubscription = {
      id: this.currentNewsletterSubscriptionId++,
      ...subscription,
      createdAt: new Date()
    };

    this.newsletterSubscriptions.set(newSubscription.id, newSubscription);
    return newSubscription;
  }
  
  // Product Review methods
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return Array.from(this.productReviews.values())
      .filter(review => review.productId === productId);
  }
  
  async addProductReview(review: InsertProductReview): Promise<ProductReview> {
    const newReview: ProductReview = {
      id: this.currentProductReviewId++,
      productId: review.productId,
      userId: review.userId,
      orderId: review.orderId,
      customerName: review.customerName,
      rating: review.rating,
      reviewText: review.reviewText,
      verified: review.verified ?? false,
      createdAt: new Date()
    };
    
    this.productReviews.set(newReview.id, newReview);
    return newReview;
  }
  
  async canUserReviewProduct(userId: number, productId: number): Promise<boolean> {
    // Check if user has already reviewed this product
    const hasReviewed = Array.from(this.productReviews.values())
      .some(review => review.userId === userId && review.productId === productId);
    
    if (hasReviewed) {
      return false; // User has already reviewed this product
    }
    
    // In a real app, we would check if the user has purchased this product
    // and if the order status is "delivered" - here we'll simulate this logic
    const userOrders = Array.from(this.payments.values())
      .filter(payment => payment.userId === userId && payment.status === "completed");
    
    // For demo purposes, if the user has any completed payment, they can review any product
    return userOrders.length > 0;
  }
  
  async getUserProductReviews(userId: number): Promise<ProductReview[]> {
    return Array.from(this.productReviews.values())
      .filter(review => review.userId === userId);
  }
  
  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: this.currentContactMessageId++,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      status: "unread",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.contactMessages.set(newMessage.id, newMessage);
    return newMessage;
  }
  
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage> {
    const message = this.contactMessages.get(id);
    if (!message) {
      throw new Error(`Contact message with ID ${id} not found`);
    }
    
    const updatedMessage: ContactMessage = {
      ...message,
      status,
      updatedAt: new Date()
    };
    
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  // User Authentication methods
  async createUser(user: InsertUser): Promise<User> {
    // Check if email already exists
    const existingUser = Array.from(this.users.values()).find(
      u => u.email === user.email
    );

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const newUser: User = {
      id: this.currentUserId++,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role || "user",
      emailVerified: user.emailVerified || false,
      verificationToken: user.verificationToken || null,
      resetToken: user.resetToken || null,
      resetTokenExpiry: user.resetTokenExpiry || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyUserEmail(token: string): Promise<boolean> {
    const user = Array.from(this.users.values()).find(
      u => u.verificationToken === token
    );

    if (!user) {
      return false;
    }

    const updatedUser: User = {
      ...user,
      emailVerified: true,
      verificationToken: null,
      updatedAt: new Date()
    };

    this.users.set(user.id, updatedUser);
    return true;
  }

  async resetPasswordRequest(email: string): Promise<boolean> {
    const user = Array.from(this.users.values()).find(
      u => u.email === email
    );

    if (!user) {
      return false;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

    const updatedUser: User = {
      ...user,
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date()
    };

    this.users.set(user.id, updatedUser);
    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const now = new Date();
    const user = Array.from(this.users.values()).find(
      u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > now
    );

    if (!user) {
      return false;
    }

    const updatedUser: User = {
      ...user,
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: new Date()
    };

    this.users.set(user.id, updatedUser);
    return true;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const newPayment: Payment = {
      id: this.currentPaymentId++,
      userId: payment.userId,
      orderId: payment.orderId ?? null,
      razorpayPaymentId: payment.razorpayPaymentId,
      amount: payment.amount,
      currency: payment.currency || "INR",
      status: payment.status,
      method: payment.method ?? null,
      createdAt: new Date()
    };

    this.payments.set(newPayment.id, newPayment);
    return newPayment;
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      payment => payment.userId === userId
    );
  }

  async getPaymentById(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  // Subscription methods
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const newSubscription: Subscription = {
      id: this.currentSubscriptionId++,
      userId: subscription.userId,
      razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      planName: subscription.planName,
      status: subscription.status || "active",
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.subscriptions.set(newSubscription.id, newSubscription);
    return newSubscription;
  }

  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      subscription => subscription.userId === userId
    );
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const updatedSubscription: Subscription = {
      ...subscription,
      status: status as any,
      updatedAt: new Date()
    };

    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
}

export class DatabaseStorage implements IStorage {
  async getAllProducts(): Promise<Product[]> {
    const productsList = await db.select().from(products);
    return productsList;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const categoryProducts = await db.select().from(products).where(eq(products.category, category));
    return categoryProducts;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const featuredProducts = await db.select().from(products).where(eq(products.featured, true));
    return featuredProducts;
  }

  async getAllFarmers(): Promise<Farmer[]> {
    const farmersList = await db.select().from(farmers);
    return farmersList;
  }

  async getFarmerById(id: number): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.id, id));
    return farmer;
  }

  async getFeaturedFarmers(): Promise<Farmer[]> {
    const featuredFarmers = await db.select().from(farmers).where(eq(farmers.featured, true));
    return featuredFarmers;
  }
  
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    const reviews = await db.select()
      .from(productReviews)
      .where(eq(productReviews.productId, productId));
    return reviews;
  }
  
  async addProductReview(review: InsertProductReview): Promise<ProductReview> {
    const [newReview] = await db
      .insert(productReviews)
      .values(review)
      .returning();
    return newReview;
  }
  
  async canUserReviewProduct(userId: number, productId: number): Promise<boolean> {
    // User can review a product if they have an order with status "delivered" containing this product
    // and they haven't already reviewed it
    
    // 1. Check if user has already reviewed this product
    const existingReviews = await db.select()
      .from(productReviews)
      .where(and(
        eq(productReviews.userId, userId),
        eq(productReviews.productId, productId)
      ));
    
    if (existingReviews.length > 0) {
      return false; // User has already reviewed this product
    }
    
    // 2. Check if user has purchased this product and it has been delivered
    const deliveredOrders = await db.select({
      orderId: orders.id
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(
      eq(orders.userId, userId),
      eq(orderItems.productId, productId),
      eq(orders.status, "delivered") // Only delivered orders qualify for review
    ));
    
    return deliveredOrders.length > 0;
  }
  
  async getUserProductReviews(userId: number): Promise<ProductReview[]> {
    const reviews = await db.select().from(productReviews).where(eq(productReviews.userId, userId));
    return reviews;
  }
  
  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  
  async getAllContactMessages(): Promise<ContactMessage[]> {
    const messages = await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
    return messages;
  }
  
  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }
  
  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    
    return updatedMessage;
  }

  async getCart(sessionId: string): Promise<CartWithItems> {
    // Find or create cart
    let [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    
    if (!cart) {
      const [newCart] = await db.insert(carts).values({ sessionId }).returning();
      cart = newCart;
    }

    return this.buildCartWithItems(cart);
  }

  async addToCart(sessionId: string, productId: number, quantity: number): Promise<CartWithItems> {
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

  async updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartWithItems> {
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

  async removeFromCart(sessionId: string, productId: number): Promise<CartWithItems> {
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

  private async buildCartWithItems(cart: Cart): Promise<CartWithItems> {
    // Get cart items
    const items = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products
    })
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id))
    .innerJoin(products, eq(cartItems.productId, products.id));

    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 4.99 : 0;
    const total = subtotal + shipping;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...cart,
      items,
      totalItems,
      subtotal,
      shipping,
      total
    };
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    const testimonialsList = await db.select().from(testimonials);
    return testimonialsList;
  }

  async addNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if email already exists
    const [existingSubscription] = await db.select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, subscription.email));

    if (existingSubscription) {
      throw new Error("Email already subscribed");
    }

    // Add new subscription
    const [newSubscription] = await db.insert(newsletterSubscriptions)
      .values(subscription)
      .returning();

    return newSubscription;
  }

  // User Authentication methods
  async createUser(user: InsertUser): Promise<User> {
    // Check if email already exists
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.email, user.email));

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();

    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email));
    
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, id));
    
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  async verifyUserEmail(token: string): Promise<boolean> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.verificationToken, token));

    if (!user) {
      return false;
    }

    await db.update(users)
      .set({
        emailVerified: true,
        verificationToken: null
      })
      .where(eq(users.id, user.id));

    return true;
  }

  async resetPasswordRequest(email: string): Promise<boolean> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return false;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

    await db.update(users)
      .set({
        resetToken,
        resetTokenExpiry
      })
      .where(eq(users.id, user.id));

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const now = new Date();
    
    const [user] = await db.select()
      .from(users)
      .where(and(
        eq(users.resetToken, token),
        isNotNull(users.resetTokenExpiry)
      ));

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < now) {
      return false;
    }

    await db.update(users)
      .set({
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      })
      .where(eq(users.id, user.id));

    return true;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();

    return newPayment;
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    const userPayments = await db.select()
      .from(payments)
      .where(eq(payments.userId, userId));

    return userPayments;
  }

  async getPaymentById(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select()
      .from(payments)
      .where(eq(payments.id, id));

    return payment;
  }

  // Subscription methods
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();

    return newSubscription;
  }

  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    const userSubscriptions = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    return userSubscriptions;
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id));

    return subscription;
  }

  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription> {
    const [updatedSubscription] = await db.update(subscriptions)
      .set({ status: status as any })
      .where(eq(subscriptions.id, id))
      .returning();

    if (!updatedSubscription) {
      throw new Error("Subscription not found");
    }

    return updatedSubscription;
  }
}

// Use the database storage implementation
// Use the database storage implementation for production
export const storage = new DatabaseStorage();
