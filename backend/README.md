# Harvest Direct Backend

A Node.js Express backend for the Harvest Direct e-commerce platform, connecting farmers directly with consumers.

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── admin/          # Admin-specific controllers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── userController.js
│   │   └── user/           # User-specific controllers
│   │       ├── authController.js
│   │       ├── cartController.js
│   │       └── productController.js
│   ├── middlewares/        # Custom middleware functions
│   │   ├── auth.js
│   │   └── session.js
│   ├── models/             # Data models and storage layer
│   │   └── storage.js
│   ├── routes/
│   │   ├── admin/          # Admin API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── userRoutes.js
│   │   └── user/           # User API routes
│   │       ├── authRoutes.js
│   │       ├── cartRoutes.js
│   │       └── productRoutes.js
│   ├── utils/              # Utility functions
│   │   └── jwt.js
│   ├── config/             # Configuration files
│   │   └── db.js
│   ├── data/               # Seed data
│   │   ├── productData.js
│   │   └── farmerData.js
│   ├── initDb.js           # Database initialization
│   ├── app.js              # Express app configuration
│   └── server.js           # Server entry point
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Features

- **Role-based Authentication**: Separate admin and user authentication
- **RESTful API**: Clean, organized API endpoints
- **Database Integration**: Uses Drizzle ORM with PostgreSQL
- **Security**: JWT authentication and middleware protection
- **Modular Structure**: Organized controllers, routes, and middlewares

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy and edit environment variables
   cp .env.example .env
   ```

3. **Set up your database URL and JWT secret in .env:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Admin Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get admin dashboard data

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get product by ID

### Farmers (Public)
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/featured` - Get featured farmers
- `GET /api/farmers/:id` - Get farmer by ID

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove item from cart

### Admin Routes (Protected)
- `GET /api/admin/products` - Manage products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/users` - Manage users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | No |
| `PORT` | Server port | No (default: 5000) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |

## Development

- `npm run dev` - Start with auto-reload
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm run check` - Type check
- `npm run db:push` - Push database schema changes

## License

MIT