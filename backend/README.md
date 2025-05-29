# Harvest Direct Backend API

A Node.js Express backend for the Harvest Direct e-commerce platform, connecting farmers directly with consumers.

## Features

- **Role-based Authentication**: Separate admin and user authentication
- **RESTful API**: Clean, organized API endpoints
- **PostgreSQL Integration**: Database connection with Drizzle ORM
- **Security**: JWT authentication, rate limiting, CORS protection
- **Modular Structure**: Organized controllers, routes, and middlewares

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── admin/          # Admin-specific controllers
│   │   └── user/           # User-specific controllers
│   ├── middlewares/        # Custom middleware functions
│   ├── models/             # Database models
│   ├── routes/
│   │   ├── admin/          # Admin API routes
│   │   └── user/           # User API routes
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   ├── app.js              # Express app configuration
│   └── server.js           # Server entry point
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders

### User Routes
- `GET /api/user/products` - Get products
- `POST /api/user/cart` - Cart management
- `POST /api/user/orders` - Place orders

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3000 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRY` | JWT expiration time | 24h |

## Development

- `npm run dev` - Start with nodemon for auto-reload
- `npm test` - Run test suite
- `npm start` - Start production server

## License

MIT