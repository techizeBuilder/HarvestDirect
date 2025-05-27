# 🌾 Harvest Direct - Backend API

Complete backend API server for the Harvest Direct e-commerce platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Push database schema
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Farmers
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/featured` - Get featured farmers
- `GET /api/farmers/:id` - Get farmer by ID

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/farmers` - Manage farmers
- `POST /api/admin/farmers` - Add new farmer
- `PUT /api/admin/farmers/:id` - Update farmer
- `DELETE /api/admin/farmers/:id` - Delete farmer

## 🌐 Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
PORT=5000
NODE_ENV=development
```

## 📦 Tech Stack

- **Node.js** + **Express** - Server framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **JWT** - Authentication
- **Razorpay** - Payment processing
- **TypeScript** - Type safety

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Type checking

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Zod
- SQL injection protection

Server runs on `http://localhost:5000` by default.