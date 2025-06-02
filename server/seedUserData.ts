import mongoose from 'mongoose';
import { UserModel, OrderModel, OrderItemModel, PaymentModel, SubscriptionModel } from '@shared/mongodb-schema';

async function seedUserData() {
  try {
    // Find the test user
    const testUser = await UserModel.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
      console.log('Test user not found');
      return;
    }

    console.log(`Found test user: ${testUser._id}`);

    // Create sample orders for the test user
    const sampleOrders = [
      {
        userId: testUser._id.toString(),
        sessionId: 'sample-session-1',
        total: 129.99,
        status: 'delivered',
        paymentMethod: 'razorpay',
        shippingAddress: 'Test User, 123 Main Street, Mumbai, Maharashtra 400001, India, +91 9876543210',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        userId: testUser._id.toString(),
        sessionId: 'sample-session-2',
        total: 75.50,
        status: 'shipped',
        paymentMethod: 'razorpay',
        shippingAddress: 'Test User, 123 Main Street, Mumbai, Maharashtra 400001, India, +91 9876543210',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        userId: testUser._id.toString(),
        sessionId: 'sample-session-3',
        total: 45.95,
        status: 'processing',
        paymentMethod: 'razorpay',
        shippingAddress: 'Test User, 123 Main Street, Mumbai, Maharashtra 400001, India, +91 9876543210',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    // Check if orders already exist
    const existingOrders = await OrderModel.find({ userId: testUser._id.toString() });
    if (existingOrders.length === 0) {
      const createdOrders = await OrderModel.insertMany(sampleOrders);
      console.log(`Created ${createdOrders.length} sample orders`);

      // Create sample order items for each order
      const orderItems = [
        // Order 1 items
        {
          orderId: createdOrders[0]._id.toString(),
          productId: '683e17762761c170b3cb6fa7', // Mountain Coffee Beans
          productName: 'Mountain Coffee Beans',
          quantity: 2,
          price: 49.99,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: createdOrders[0]._id.toString(),
          productId: '683e17762761c170b3cb6fa8', // Organic Spice Mix
          productName: 'Organic Spice Mix',
          quantity: 1,
          price: 30.01,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        // Order 2 items
        {
          orderId: createdOrders[1]._id.toString(),
          productId: '683e17762761c170b3cb6fa9', // Fresh Valley Honey
          productName: 'Fresh Valley Honey',
          quantity: 3,
          price: 25.50,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        // Order 3 items
        {
          orderId: createdOrders[2]._id.toString(),
          productId: '683e17762761c170b3cb6faa', // Handcrafted Cheese
          productName: 'Handcrafted Cheese',
          quantity: 1,
          price: 45.95,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ];

      await OrderItemModel.insertMany(orderItems);
      console.log(`Created ${orderItems.length} sample order items`);

      // Create sample payments for the orders
      const payments = [
        {
          userId: testUser._id.toString(),
          amount: 129.99,
          currency: 'INR',
          status: 'completed',
          paymentMethod: 'razorpay',
          transactionId: 'pay_sample_1',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          userId: testUser._id.toString(),
          amount: 75.50,
          currency: 'INR',
          status: 'completed',
          paymentMethod: 'razorpay',
          transactionId: 'pay_sample_2',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          userId: testUser._id.toString(),
          amount: 45.95,
          currency: 'INR',
          status: 'pending',
          paymentMethod: 'razorpay',
          transactionId: 'pay_sample_3',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ];

      await PaymentModel.insertMany(payments);
      console.log(`Created ${payments.length} sample payments`);

      // Create a sample subscription
      const subscription = {
        userId: testUser._id.toString(),
        razorpaySubscriptionId: 'sub_sample_1',
        planName: 'Monthly Fresh Box',
        status: 'active',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 11 * 30 * 24 * 60 * 60 * 1000), // 11 months from now
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };

      await SubscriptionModel.create(subscription);
      console.log('Created sample subscription');

    } else {
      console.log(`Test user already has ${existingOrders.length} orders`);
    }

  } catch (error) {
    console.error('Error seeding user data:', error);
  }
}

export { seedUserData };