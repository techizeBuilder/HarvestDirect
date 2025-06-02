import {
  UserModel,
  ProductModel,
  FarmerModel,
  CartModel,
  CartItemModel,
  TestimonialModel,
  NewsletterSubscriptionModel,
  ProductReviewModel,
  ContactMessageModel,
  PaymentModel,
  SubscriptionModel,
  OrderModel,
  OrderItemModel,
  TeamMemberModel,
  type User,
  type Product,
  type Farmer,
  type Cart,
  type CartItem,
  type Testimonial,
  type NewsletterSubscription,
  type ProductReview,
  type ContactMessage,
  type Payment,
  type Subscription,
  type Order,
  type OrderItem,
  type TeamMember,
  type InsertUser,
  type InsertProduct,
  type InsertFarmer,
  type InsertCart,
  type InsertCartItem,
  type InsertTestimonial,
  type InsertNewsletterSubscription,
  type InsertProductReview,
  type InsertContactMessage,
  type InsertPayment,
  type InsertSubscription,
  type InsertOrder,
  type InsertOrderItem,
  type InsertTeamMember,
  type CartWithItems,
} from '@shared/mongodb-schema';
import { IStorage } from './storage';
import bcrypt from 'bcrypt';

export class MongoDBStorage implements IStorage {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return await ProductModel.find().lean();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const product = await ProductModel.findById(id).lean();
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await ProductModel.find({ category }).lean();
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await ProductModel.find({ featured: true }).lean();
  }

  async getAllEnhancedProducts(): Promise<any[]> {
    const products = await ProductModel.find().populate('farmerId').lean();
    return products.map(product => ({
      ...product,
      id: product._id.toString(),
      farmerId: product.farmerId.toString(),
    }));
  }

  // Farmers
  async getAllFarmers(): Promise<Farmer[]> {
    return await FarmerModel.find().lean();
  }

  async getFarmerById(id: string): Promise<Farmer | undefined> {
    const farmer = await FarmerModel.findById(id).lean();
    return farmer || undefined;
  }

  async getFeaturedFarmers(): Promise<Farmer[]> {
    return await FarmerModel.find({ verified: true }).limit(6).lean();
  }

  // Cart
  async getCart(sessionId: string): Promise<CartWithItems> {
    let cart = await CartModel.findOne({ sessionId }).lean();
    
    if (!cart) {
      cart = await CartModel.create({ sessionId });
    }

    return await this.buildCartWithItems(cart);
  }

  async addToCart(sessionId: string, productId: string, quantity: number): Promise<CartWithItems> {
    let cart = await CartModel.findOne({ sessionId });
    
    if (!cart) {
      cart = await CartModel.create({ sessionId });
    }

    const existingItem = await CartItemModel.findOne({ 
      cartId: cart._id.toString(), 
      productId 
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItemModel.create({
        cartId: cart._id.toString(),
        productId,
        quantity,
      });
    }

    return await this.buildCartWithItems(cart);
  }

  async updateCartItem(sessionId: string, productId: string, quantity: number): Promise<CartWithItems> {
    const cart = await CartModel.findOne({ sessionId });
    if (!cart) throw new Error('Cart not found');

    if (quantity <= 0) {
      await CartItemModel.deleteOne({ 
        cartId: cart._id.toString(), 
        productId 
      });
    } else {
      await CartItemModel.updateOne(
        { cartId: cart._id.toString(), productId },
        { quantity }
      );
    }

    return await this.buildCartWithItems(cart);
  }

  async removeFromCart(sessionId: string, productId: string): Promise<CartWithItems> {
    const cart = await CartModel.findOne({ sessionId });
    if (!cart) throw new Error('Cart not found');

    await CartItemModel.deleteOne({ 
      cartId: cart._id.toString(), 
      productId 
    });

    return await this.buildCartWithItems(cart);
  }

  async clearCart(sessionId: string): Promise<void> {
    const cart = await CartModel.findOne({ sessionId });
    if (cart) {
      await CartItemModel.deleteMany({ cartId: cart._id.toString() });
    }
  }

  private async buildCartWithItems(cart: Cart): Promise<CartWithItems> {
    const cartItems = await CartItemModel.find({ 
      cartId: cart._id.toString() 
    }).lean();

    const items = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ProductModel.findById(item.productId).lean();
        return {
          ...item,
          product: product!,
        };
      })
    );

    return {
      ...cart,
      items,
    };
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await TestimonialModel.find().lean();
  }

  // Newsletter
  async addNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    return await NewsletterSubscriptionModel.create(subscription);
  }

  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await NewsletterSubscriptionModel.find().lean();
  }

  async getNewsletterSubscriptionById(id: string): Promise<NewsletterSubscription | undefined> {
    const subscription = await NewsletterSubscriptionModel.findById(id).lean();
    return subscription || undefined;
  }

  async deleteNewsletterSubscription(id: string): Promise<boolean> {
    const result = await NewsletterSubscriptionModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Product Reviews
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    return await ProductReviewModel.find({ productId }).lean();
  }

  async addProductReview(review: InsertProductReview): Promise<ProductReview> {
    return await ProductReviewModel.create(review);
  }

  async canUserReviewProduct(userId: string, productId: string): Promise<boolean> {
    const existingReview = await ProductReviewModel.findOne({ userId, productId });
    return !existingReview;
  }

  async getUserProductReviews(userId: string): Promise<ProductReview[]> {
    return await ProductReviewModel.find({ userId }).lean();
  }

  // Contact Messages
  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    return await ContactMessageModel.create(message);
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
  }

  async getContactMessageById(id: string): Promise<ContactMessage | undefined> {
    const message = await ContactMessageModel.findById(id).lean();
    return message || undefined;
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage> {
    const updatedMessage = await ContactMessageModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    
    if (!updatedMessage) {
      throw new Error('Contact message not found');
    }
    return updatedMessage;
  }

  // User Authentication
  async createUser(user: InsertUser): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return await UserModel.create(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email }).lean();
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    return user || undefined;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      userData,
      { new: true }
    ).lean();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async verifyUserEmail(token: string): Promise<boolean> {
    const user = await UserModel.findOne({ verificationToken: token });
    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      return true;
    }
    return false;
  }

  async resetPasswordRequest(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    if (user) {
      const resetToken = Math.random().toString(36).substring(2, 15);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
      return true;
    }
    return false;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return true;
    }
    return false;
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    return await PaymentModel.create(payment);
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await PaymentModel.find({ userId }).lean();
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    const payment = await PaymentModel.findById(id).lean();
    return payment || undefined;
  }

  // Subscriptions
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    return await SubscriptionModel.create(subscription);
  }

  async getSubscriptionsByUserId(userId: string): Promise<Subscription[]> {
    return await SubscriptionModel.find({ userId }).lean();
  }

  async getSubscriptionById(id: string): Promise<Subscription | undefined> {
    const subscription = await SubscriptionModel.findById(id).lean();
    return subscription || undefined;
  }

  async updateSubscriptionStatus(id: string, status: string): Promise<Subscription> {
    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    
    if (!updatedSubscription) {
      throw new Error('Subscription not found');
    }
    return updatedSubscription;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    return await OrderModel.create(order);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    return await OrderItemModel.create(orderItem);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const order = await OrderModel.findById(id).lean();
    return order || undefined;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return await OrderItemModel.find({ orderId }).lean();
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return updatedOrder;
  }

  // Team Members
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await TeamMemberModel.find().sort({ displayOrder: 1 }).lean();
  }

  async getActiveTeamMembers(): Promise<TeamMember[]> {
    return await TeamMemberModel.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  }

  async getTeamMemberById(id: string): Promise<TeamMember | undefined> {
    const teamMember = await TeamMemberModel.findById(id).lean();
    return teamMember || undefined;
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    return await TeamMemberModel.create(teamMember);
  }

  async updateTeamMember(id: string, teamMember: Partial<InsertTeamMember>): Promise<TeamMember> {
    const updatedTeamMember = await TeamMemberModel.findByIdAndUpdate(
      id,
      teamMember,
      { new: true }
    ).lean();
    
    if (!updatedTeamMember) {
      throw new Error('Team member not found');
    }
    return updatedTeamMember;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await TeamMemberModel.findByIdAndDelete(id);
  }
}