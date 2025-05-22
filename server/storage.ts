import { v4 as uuidv4 } from 'uuid';
import { 
  Product, InsertProduct, 
  Farmer, InsertFarmer, 
  Cart, InsertCart, 
  CartItem, InsertCartItem,
  CartWithItems, 
  Testimonial, InsertTestimonial,
  NewsletterSubscription, InsertNewsletterSubscription,
  products, farmers, carts, cartItems, testimonials, newsletterSubscriptions
} from '@shared/schema';
import { productData } from './productData';
import { farmerData } from './farmerData';
import { db } from './db';
import { eq, and } from 'drizzle-orm';

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
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private farmers: Map<number, Farmer>;
  private carts: Map<string, Cart>;
  private cartItems: Map<number, CartItem>;
  private testimonials: Map<number, Testimonial>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private productReviews: Map<number, ProductReview>;
  
  private currentCartItemId: number;
  private currentNewsletterSubscriptionId: number;
  private currentProductReviewId: number;

  constructor() {
    this.products = new Map();
    this.farmers = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.testimonials = new Map();
    this.newsletterSubscriptions = new Map();
    this.productReviews = new Map();
    
    this.currentCartItemId = 1;
    this.currentNewsletterSubscriptionId = 1;
    this.currentProductReviewId = 1;
    
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
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
