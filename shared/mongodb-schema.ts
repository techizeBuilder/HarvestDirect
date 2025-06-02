import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface User extends Document {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  password?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Product Schema
export interface Product extends Document {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  sku: string;
  imageUrl: string;
  imageUrls: string[];
  videoUrl?: string;
  farmerId: string;
  stockQuantity: number;
  featured: boolean;
  naturallyGrown: boolean;
  chemicalFree: boolean;
  premiumQuality: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: Number,
  category: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  imageUrls: [String],
  videoUrl: String,
  farmerId: { type: String, required: true },
  stockQuantity: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  naturallyGrown: { type: Boolean, default: false },
  chemicalFree: { type: Boolean, default: false },
  premiumQuality: { type: Boolean, default: false },
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

// Farmer Schema
export interface Farmer extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  imageUrl: string;
  experience: number;
  specialization: string;
  verified: boolean;
  rating: number;
  totalProducts: number;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const farmerSchema = new Schema<Farmer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  imageUrl: { type: String, required: true },
  experience: { type: Number, required: true },
  specialization: { type: String, required: true },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Cart Schema
export interface Cart extends Document {
  _id: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<Cart>({
  sessionId: { type: String, required: true, unique: true },
}, { timestamps: true });

// Cart Item Schema
export interface CartItem extends Document {
  _id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>({
  cartId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { timestamps: true });

// Testimonial Schema
export interface Testimonial extends Document {
  _id: string;
  name: string;
  title: string;
  content: string;
  rating: number;
  imageUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<Testimonial>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  imageUrl: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Newsletter Subscription Schema
export interface NewsletterSubscription extends Document {
  _id: string;
  name?: string;
  email: string;
  agreedToTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSubscriptionSchema = new Schema<NewsletterSubscription>({
  name: String,
  email: { type: String, required: true, unique: true },
  agreedToTerms: { type: Boolean, required: true },
}, { timestamps: true });

// Product Review Schema
export interface ProductReview extends Document {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const productReviewSchema = new Schema<ProductReview>({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

// Contact Message Schema
export interface ContactMessage extends Document {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<ContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
}, { timestamps: true });

// Payment Schema
export interface Payment extends Document {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<Payment>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: String,
}, { timestamps: true });

// Subscription Schema
export interface Subscription extends Document {
  _id: string;
  userId: string;
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<Subscription>({
  userId: { type: String, required: true },
  planName: { type: String, required: true },
  status: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

// Order Schema
export interface Order extends Document {
  _id: string;
  userId?: string;
  sessionId: string;
  userName?: string;
  userEmail?: string;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<Order>({
  userId: String,
  sessionId: { type: String, required: true },
  userName: String,
  userEmail: String,
  total: { type: Number, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  shippingAddress: { type: String, required: true },
}, { timestamps: true });

// Order Item Schema
export interface OrderItem extends Document {
  _id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

// Team Member Schema
export interface TeamMember extends Document {
  _id: string;
  name: string;
  jobTitle: string;
  bio: string;
  imageUrl: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  displayOrder?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<TeamMember>({
  name: { type: String, required: true },
  jobTitle: { type: String, required: true },
  bio: { type: String, required: true },
  imageUrl: { type: String, required: true },
  email: String,
  phone: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
  },
  displayOrder: Number,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Export Models
export const UserModel = mongoose.model<User>('User', userSchema);
export const ProductModel = mongoose.model<Product>('Product', productSchema);
export const FarmerModel = mongoose.model<Farmer>('Farmer', farmerSchema);
export const CartModel = mongoose.model<Cart>('Cart', cartSchema);
export const CartItemModel = mongoose.model<CartItem>('CartItem', cartItemSchema);
export const TestimonialModel = mongoose.model<Testimonial>('Testimonial', testimonialSchema);
export const NewsletterSubscriptionModel = mongoose.model<NewsletterSubscription>('NewsletterSubscription', newsletterSubscriptionSchema);
export const ProductReviewModel = mongoose.model<ProductReview>('ProductReview', productReviewSchema);
export const ContactMessageModel = mongoose.model<ContactMessage>('ContactMessage', contactMessageSchema);
export const PaymentModel = mongoose.model<Payment>('Payment', paymentSchema);
export const SubscriptionModel = mongoose.model<Subscription>('Subscription', subscriptionSchema);
export const OrderModel = mongoose.model<Order>('Order', orderSchema);
export const OrderItemModel = mongoose.model<OrderItem>('OrderItem', orderItemSchema);
export const TeamMemberModel = mongoose.model<TeamMember>('TeamMember', teamMemberSchema);

// Type exports for compatibility
export type InsertUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertProduct = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertFarmer = Omit<Farmer, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertCart = Omit<Cart, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertCartItem = Omit<CartItem, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertTestimonial = Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertNewsletterSubscription = Omit<NewsletterSubscription, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertProductReview = Omit<ProductReview, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertContactMessage = Omit<ContactMessage, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertPayment = Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertSubscription = Omit<Subscription, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertOrder = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertOrderItem = Omit<OrderItem, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertTeamMember = Omit<TeamMember, '_id' | 'createdAt' | 'updatedAt'>;

// Cart with items interface
export interface CartWithItems extends Cart {
  items: Array<CartItem & { product: Product }>;
}