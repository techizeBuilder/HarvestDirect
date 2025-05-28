import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product Categories Enum
export const ProductCategory = {
  COFFEE_TEA: "Coffee & Tea",
  SPICES: "Spices",
  GRAINS: "Grains",
  OTHERS: "Others"
} as const;

export type ProductCategoryType = typeof ProductCategory[keyof typeof ProductCategory];

// User Role Enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// Subscription Status Enum
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'expired', 'past_due']);

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array(),
  videoUrl: text("video_url"),
  farmerId: integer("farmer_id").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(100),
  featured: boolean("featured").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true
});

// Farmer Schema
export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  story: text("story").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Cart Schema
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Cart Items Schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true
});

// Testimonials Schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  rating: doublePrecision("rating").notNull(),
  imageInitials: text("image_initials").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true
});

// Newsletter Subscription Schema
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  agreedToTerms: boolean("agreed_to_terms").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  createdAt: true
});

// Order Schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull().default("razorpay"),
  cancellationReason: text("cancellation_reason"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});

// Order Items Schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});

// Product Reviews Schema
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  orderId: integer("order_id").notNull(),
  customerName: text("customer_name").notNull(),
  rating: doublePrecision("rating").notNull(),
  reviewText: text("review_text").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true
});

// Contact Messages Schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Payment Schema
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderId: integer("order_id"),
  razorpayPaymentId: text("razorpay_payment_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull(),
  method: text("method"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true
});

// Subscription Schema
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  razorpaySubscriptionId: text("razorpay_subscription_id").notNull(),
  planName: text("plan_name").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Export types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type Farmer = typeof farmers.$inferSelect;

export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;
export type ProductReview = typeof productReviews.$inferSelect;

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Cart with items
export interface CartWithItems extends Cart {
  items: (CartItem & { product: Product })[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}
