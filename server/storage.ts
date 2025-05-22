import { v4 as uuidv4 } from 'uuid';
import { 
  Product, InsertProduct, 
  Farmer, InsertFarmer, 
  Cart, InsertCart, 
  CartItem, InsertCartItem,
  CartWithItems, 
  Testimonial, InsertTestimonial,
  NewsletterSubscription, InsertNewsletterSubscription 
} from '@shared/schema';
import { productData } from './productData';
import { farmerData } from './farmerData';

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
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private farmers: Map<number, Farmer>;
  private carts: Map<string, Cart>;
  private cartItems: Map<number, CartItem>;
  private testimonials: Map<number, Testimonial>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  
  private currentCartItemId: number;
  private currentNewsletterSubscriptionId: number;

  constructor() {
    this.products = new Map();
    this.farmers = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.testimonials = new Map();
    this.newsletterSubscriptions = new Map();
    
    this.currentCartItemId = 1;
    this.currentNewsletterSubscriptionId = 1;
    
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

export const storage = new MemStorage();
