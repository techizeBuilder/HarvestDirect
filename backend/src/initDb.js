import { db } from './config/db.js';
import { products, farmers, testimonials } from '../../shared/schema.ts';
import { productData } from './data/productData.js';
import { farmerData } from './data/farmerData.js';

/**
 * Initialize the database with seed data
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing database with seed data...');
    console.log('Using database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    // Check if products already exist with graceful error handling
    let existingProducts = [];
    try {
      existingProducts = await db.select().from(products);
    } catch (dbError) {
      console.log('Database tables may not exist yet or connection issue:', dbError.message);
      return; // Exit gracefully if database is not accessible
    }
    if (existingProducts.length === 0) {
      console.log('Seeding products...');
      await db.insert(products).values(productData);
      console.log(`Inserted ${productData.length} products`);
    } else {
      console.log(`Found ${existingProducts.length} existing products, skipping product seeding.`);
    }

    // Check if farmers already exist
    const existingFarmers = await db.select().from(farmers);
    if (existingFarmers.length === 0) {
      console.log('Seeding farmers...');
      await db.insert(farmers).values(farmerData);
      console.log(`Inserted ${farmerData.length} farmers`);
    } else {
      console.log(`Found ${existingFarmers.length} existing farmers, skipping farmer seeding.`);
    }

    // Check if testimonials already exist
    const existingTestimonials = await db.select().from(testimonials);
    if (existingTestimonials.length === 0) {
      console.log('Seeding testimonials...');
      const testimonialData = [
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
        },
        {
          id: 3,
          name: "Lisa P.",
          title: "Health Conscious Consumer",
          content: "Knowing exactly where my food comes from and supporting traditional farmers gives me so much peace of mind.",
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
          rating: 5
        },
        {
          id: 4,
          name: "David L.",
          title: "Tea Connoisseur",
          content: "The premium tea leaves are exceptional. The hand-rolling process really shows in the complex flavor profile.",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
          rating: 5
        }
      ];
      
      await db.insert(testimonials).values(testimonialData);
      console.log(`Inserted ${testimonialData.length} testimonials`);
    } else {
      console.log(`Found ${existingTestimonials.length} existing testimonials, skipping testimonial seeding.`);
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}