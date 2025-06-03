import { db } from './db';
import { products, farmers, testimonials } from '@shared/schema';
import { productData } from './productData';
import { farmerData } from './farmerData';
import { sql } from 'drizzle-orm';

/**
 * Initialize the database with seed data
 */
export async function initializeDatabase() {
  console.log('Initializing database with seed data...');
  
  try {
    // Check if products already exist
    const existingProducts = await db.select({ count: sql`count(*)` }).from(products);
    
    if (Number(existingProducts[0].count) === 0) {
      console.log('Adding products...');
      await db.insert(products).values(productData);
    } else {
      console.log(`Found ${existingProducts[0].count} existing products, skipping product seeding.`);
    }
    
    // Check if farmers already exist
    const existingFarmers = await db.select({ count: sql`count(*)` }).from(farmers);
    
    if (Number(existingFarmers[0].count) === 0) {
      console.log('Adding farmers...');
      await db.insert(farmers).values(farmerData);
    } else {
      console.log(`Found ${existingFarmers[0].count} existing farmers, skipping farmer seeding.`);
    }
    
    // Add testimonials if they don't exist
    const existingTestimonials = await db.select({ count: sql`count(*)` }).from(testimonials);
    
    if (Number(existingTestimonials[0].count) === 0) {
      console.log('Adding testimonials...');
      const testimonialsData = [
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
      
      await db.insert(testimonials).values(testimonialsData);
    } else {
      console.log(`Found ${existingTestimonials[0].count} existing testimonials, skipping testimonial seeding.`);
    }
    
    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}