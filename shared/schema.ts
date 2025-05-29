import { pgTable, text, integer, decimal, boolean, timestamp, uuid, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const ProductCategory = {
  COFFEE_TEA: 'coffee_tea',
  SPICES_HERBS: 'spices_herbs',
  GRAINS_CEREALS: 'grains_cereals',
  FRUITS: 'fruits',
  VEGETABLES: 'vegetables',
  DAIRY: 'dairy',
  NUTS_SEEDS: 'nuts_seeds',
  HONEY_SWEETENERS: 'honey_sweeteners',
  OILS_VINEGARS: 'oils_vinegars',
  PRESERVES_JAMS: 'preserves_jams'
} as const;

// Users table
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: text('role').default('user').notNull(),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: text('email_verification_token'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Farmers table
export const farmers = pgTable('farmers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  image: text('image'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('4.50'),
  totalReviews: integer('total_reviews').default(0),
  featured: boolean('featured').default(false),
  specialties: json('specialties').$type<string[]>().default([]),
  yearsExperience: integer('years_experience').default(0),
  certifications: json('certifications').$type<string[]>().default([]),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  image: text('image'),
  featured: boolean('featured').default(false),
  inStock: boolean('in_stock').default(true),
  stockQuantity: integer('stock_quantity').default(0),
  unit: text('unit').default('kg'),
  farmerId: integer('farmer_id').references(() => farmers.id),
  nutritionalInfo: json('nutritional_info').$type<Record<string, any>>(),
  tags: json('tags').$type<string[]>().default([]),
  harvestDate: timestamp('harvest_date'),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Cart table
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').unique().notNull(),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Cart items table
export const cartItems = pgTable('cart_items', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  cartId: uuid('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product reviews table
export const productReviews = pgTable('product_reviews', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Testimonials table
export const testimonials = pgTable('testimonials', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  role: text('role'),
  content: text('content').notNull(),
  image: text('image'),
  rating: integer('rating').default(5),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  email: text('email').unique().notNull(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
  active: boolean('active').default(true),
});

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userId: integer('user_id').references(() => users.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  status: text('status').notNull(), // pending, completed, failed, refunded
  paymentMethod: text('payment_method'),
  transactionId: text('transaction_id'),
  metadata: json('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userId: integer('user_id').references(() => users.id).notNull(),
  planName: text('plan_name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  status: text('status').notNull(), // active, inactive, cancelled, expired
  billingCycle: text('billing_cycle').notNull(), // monthly, yearly
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  metadata: json('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerificationToken: true,
  passwordResetToken: true,
  passwordResetExpires: true,
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Additional schemas for forms
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const contactFormSchema = insertContactMessageSchema;

export const newsletterSchema = insertNewsletterSubscriptionSchema;

export const reviewSchema = insertProductReviewSchema.extend({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
});

export const profileSchema = z.object({
  name: z.string().min(2),
});