import { 
  ProductModel, 
  FarmerModel, 
  TestimonialModel,
  UserModel
} from '@shared/mongodb-schema';
import { productData } from './productData';
import { farmerData } from './farmerData';
import { seedUserData } from './seedUserData';
import bcrypt from 'bcrypt';

/**
 * Initialize the database with seed data
 */
export async function initializeDatabase() {
  console.log('Initializing database with seed data...');
  
  try {
    // Check if products already exist
    const existingProductsCount = await ProductModel.countDocuments();
    
    if (existingProductsCount === 0) {
      console.log('Adding products...');
      await ProductModel.insertMany(productData);
    } else {
      console.log(`Found ${existingProductsCount} existing products, skipping product seeding.`);
    }
    
    // Check if farmers already exist
    const existingFarmersCount = await FarmerModel.countDocuments();
    
    if (existingFarmersCount === 0) {
      console.log('Adding farmers...');
      await FarmerModel.insertMany(farmerData);
    } else {
      console.log(`Found ${existingFarmersCount} existing farmers, skipping farmer seeding.`);
    }
    
    // Add testimonials if they don't exist
    const existingTestimonialsCount = await TestimonialModel.countDocuments();
    
    if (existingTestimonialsCount === 0) {
      console.log('Adding testimonials...');
      const testimonialsData = [
        {
          name: "Sarah K.",
          title: "Coffee Enthusiast",
          content: "I've been ordering the cardamom and coffee beans for over a year now. The difference in flavor compared to store-bought is remarkable. You can taste the care that goes into growing these products.",
          rating: 5,
          imageInitials: "SK"
        },
        {
          name: "Rahul M.",
          title: "Home Chef",
          content: "The rice varieties are exceptional. I've discovered flavors I never knew existed in rice! Knowing my purchase supports traditional farming methods makes it even better.",
          rating: 5,
          imageInitials: "RM"
        },
        {
          name: "Anita T.",
          title: "Tea Connoisseur",
          content: "I love the transparency about where each product comes from. The tea leaves have such a vibrant flavor and aroma that you just can't find in commercial brands. Worth every penny!",
          rating: 4.5,
          imageInitials: "AT"
        },
        {
          name: "Deepa P.",
          title: "Health Enthusiast",
          content: "The moringa leaves have become a staple in my kitchen. Knowing they're grown without chemicals gives me peace of mind, and the flavor is incomparable to anything I've found elsewhere.",
          rating: 5,
          imageInitials: "DP"
        }
      ];
      
      await TestimonialModel.insertMany(testimonialsData);
    } else {
      console.log(`Found ${existingTestimonialsCount} existing testimonials, skipping testimonial seeding.`);
    }
    
    // Create test user if it doesn't exist
    const existingTestUser = await UserModel.findOne({ email: 'testuser@example.com' });
    if (!existingTestUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await UserModel.create({
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: hashedPassword,
        role: 'user',
        isVerified: true
      });
      console.log('Test user created: testuser@example.com / password123');
    }

    // Seed sample user data for testing
    await seedUserData();

    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}