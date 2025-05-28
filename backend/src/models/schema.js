import { pgTable, serial, text, boolean, timestamp, doublePrecision, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Product Category Constants
export const ProductCategory = {
  COFFEE_TEA: "Coffee & Tea",
  GRAINS_CEREALS: "Grains & Cereals", 
  FRUITS_VEGETABLES: "Fruits & Vegetables",
  DAIRY_PRODUCTS: "Dairy Products",
  SPICES_HERBS: "Spices & Herbs",
  NUTS_SEEDS: "Nuts & Seeds",
  HONEY_SWEETENERS: "Honey & Sweeteners",
  OILS_VINEGARS: "Oils & Vinegars"
};

// Products Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
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

// Cart Schema
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Cart Items Schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
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

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  isVerified: boolean("is_verified").default(false),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertFarmerSchema = createInsertSchema(farmers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });