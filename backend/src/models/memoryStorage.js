import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory storage implementation for development/fallback
 */
export class MemoryStorage {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.carts = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    
    // Initialize with dummy product data
    this.initializeProducts();
    
    console.log('MemoryStorage initialized with dummy data');
  }

  initializeProducts() {
    const dummyProducts = [
      {
        id: 1,
        name: "Mountain Coffee Beans",
        description: "Hand-picked arabica beans from 5000ft elevation, sun-dried and small-batch roasted.",
        price: 12.50,
        category: "coffee_tea",
        imageUrl: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800",
        stockQuantity: 100,
        featured: true
      },
      {
        id: 2,
        name: "Organic Black Pepper",
        description: "Bold, aromatic peppercorns from heritage vines, traditionally sun-dried to preserve natural oils.",
        price: 8.95,
        category: "spices",
        imageUrl: "https://images.pexels.com/photos/4198772/pexels-photo-4198772.jpeg?auto=compress&cs=tinysrgb&w=800",
        stockQuantity: 120,
        featured: true
      },
      {
        id: 3,
        name: "Premium Cardamom",
        description: "Large, intensely aromatic green cardamom pods grown in virgin forest shade.",
        price: 9.25,
        category: "spices",
        imageUrl: "https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?auto=compress&cs=tinysrgb&w=800",
        stockQuantity: 85,
        featured: true
      },
      {
        id: 4,
        name: "Heirloom Rice",
        description: "Ancient grain variety cultivated in terraced paddies using traditional methods for exceptional flavor.",
        price: 7.50,
        category: "grains",
        imageUrl: "https://news.grainpro.com/hs-fs/hubfs/15388486202_1eac022edd_o.jpg?width=800",
        stockQuantity: 150,
        featured: false
      },
      {
        id: 5,
        name: "Premium Tea Leaves",
        description: "Hand-rolled orthodox tea with delicate floral notes from high-altitude gardens.",
        price: 11.75,
        category: "coffee_tea",
        imageUrl: "https://images.pexels.com/photos/5947030/pexels-photo-5947030.jpeg?auto=compress&cs=tinysrgb&w=800",
        stockQuantity: 90,
        featured: true
      }
    ];

    dummyProducts.forEach(product => {
      this.products.set(product.id, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    this.currentProductId = dummyProducts.length + 1;
  }

  // User Authentication Methods
  async createUser(userData) {
    const user = {
      id: this.currentUserId++,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password, // Should already be hashed
      role: userData.role || 'user',
      emailVerified: userData.emailVerified || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    return user;
  }

  async getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async getUserById(id) {
    return this.users.get(id);
  }

  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product Methods
  async getAllProducts() {
    return Array.from(this.products.values());
  }

  async getProductById(id) {
    return this.products.get(id);
  }

  async getProductsByCategory(category) {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getFeaturedProducts() {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  // Cart Methods
  async getCart(sessionId) {
    let cart = this.carts.get(sessionId);
    
    if (!cart) {
      cart = {
        id: uuidv4(),
        sessionId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.carts.set(sessionId, cart);
    }

    return this.buildCartWithItems(cart);
  }

  async addToCart(sessionId, productId, quantity) {
    let cart = this.carts.get(sessionId);
    
    if (!cart) {
      cart = {
        id: uuidv4(),
        sessionId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Find existing item or add new one
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: uuidv4(),
        productId,
        quantity,
        createdAt: new Date()
      });
    }

    cart.updatedAt = new Date();
    this.carts.set(sessionId, cart);

    return this.buildCartWithItems(cart);
  }

  async updateCartItem(sessionId, productId, quantity) {
    const cart = this.carts.get(sessionId);
    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) throw new Error("Cart item not found");

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date();
    this.carts.set(sessionId, cart);

    return this.buildCartWithItems(cart);
  }

  async removeFromCart(sessionId, productId) {
    const cart = this.carts.get(sessionId);
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date();
    this.carts.set(sessionId, cart);

    return this.buildCartWithItems(cart);
  }

  buildCartWithItems(cart) {
    const items = cart.items.map(item => {
      const product = this.products.get(item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
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

  // Additional methods for compatibility
  async getAllTestimonials() {
    return [
      {
        id: 1,
        name: "Sarah K.",
        title: "Coffee Enthusiast",
        content: "The mountain coffee beans are absolutely incredible. You can taste the difference that traditional farming makes.",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b02ec00c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        rating: 5
      },
      {
        id: 2,
        name: "Michael R.",
        title: "Home Chef",
        content: "These spices have transformed my cooking. The cardamom especially has such a pure, intense flavor.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        rating: 5
      }
    ];
  }

  async addNewsletterSubscription(subscription) {
    return {
      id: Date.now(),
      ...subscription,
      createdAt: new Date()
    };
  }

  async getProductReviews(productId) {
    return [];
  }

  async addProductReview(review) {
    return {
      id: Date.now(),
      ...review,
      createdAt: new Date()
    };
  }

  async addContactMessage(message) {
    return {
      id: Date.now(),
      ...message,
      createdAt: new Date()
    };
  }
}