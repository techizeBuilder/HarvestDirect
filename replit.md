# Harvest Direct: Farm-to-Table E-commerce Platform

## Overview

Harvest Direct is a full-stack e-commerce application that connects consumers directly with traditional farmers, enabling them to purchase authentic, preservative-free products like coffee, spices, and grains. The platform focuses on showcasing the stories behind traditional farming methods and providing a seamless shopping experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture:

1. **Frontend**: React-based SPA (Single Page Application) using modern UI components from shadcn/ui and styled with Tailwind CSS.

2. **Backend**: Express.js server handling API requests and serving the frontend.

3. **Data Layer**: Drizzle ORM with a PostgreSQL database (configured but not fully implemented).

4. **State Management**: Combination of React Query for server state and React Context for local state.

5. **Routing**: Uses Wouter for client-side routing.

The application is designed to be deployed on Replit with configurations for both development and production environments.

## Key Components

### Frontend

1. **Pages**:
   - Home (`client/src/pages/home.tsx`): Landing page showcasing featured products and farmers
   - Product Detail (`client/src/pages/product-detail.tsx`): Detailed view of a specific product
   - All Products (`client/src/pages/all-products.tsx`): Product catalog with filtering capabilities
   - All Farmers (`client/src/pages/all-farmers.tsx`): Directory of farmers with their stories
   - Checkout (`client/src/pages/checkout.tsx`): Order processing and payment

2. **Components**:
   - UI Components: Extensive collection of reusable UI components using shadcn
   - Cart: Shopping cart functionality with add/remove/update capabilities
   - ProductCard: Card displaying product information
   - FarmerCard: Card displaying farmer information
   - Layout: Common layout wrapper for consistent header and footer

3. **Context**:
   - CartContext (`client/src/context/CartContext.tsx`): Manages cart state and operations

### Backend

1. **API Routes** (`server/routes.ts`):
   - Product routes: CRUD operations for products
   - Farmer routes: Retrieve farmer information
   - Cart routes: Manage shopping cart actions

2. **Data Storage** (`server/storage.ts`):
   - In-memory storage implementation for development
   - Interface prepared for database integration

3. **Data Schemas** (`shared/schema.ts`):
   - Product schema
   - Farmer schema
   - Cart schema
   - Testimonial schema
   - Newsletter subscription schema

## Data Flow

1. **Product Browsing**:
   - Frontend makes API requests to fetch products/farmers
   - React Query caches the results
   - User interacts with products (filtering, viewing details)

2. **Shopping Cart**:
   - User adds items to cart
   - CartContext manages local cart state
   - Cart data is synchronized with server via API calls
   - Cart persists using session ID stored in localStorage

3. **Checkout Process**:
   - Form data validation using React Hook Form and Zod
   - Order submission via API
   - Success/failure handling

## External Dependencies

### Frontend
- React and React DOM for UI
- Tailwind CSS for styling
- shadcn/ui components (based on Radix UI)
- React Query for data fetching
- Wouter for routing
- Framer Motion for animations
- React Hook Form and Zod for form validation

### Backend
- Express.js for API server
- Drizzle ORM for database operations
- Vite for development and building

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development Mode**:
   - `npm run dev` starts both backend and frontend in development mode
   - Vite provides hot module reloading

2. **Production Mode**:
   - `npm run build` builds both frontend and backend
   - Frontend assets are built to `dist/public`
   - Backend is bundled to `dist/index.js`
   - `npm run start` serves the production build

3. **Database**:
   - Configured to use PostgreSQL, but currently using in-memory storage
   - Database URL is expected in environment variables

The deployment is configured via `.replit` file, which specifies the necessary Replit modules (Node.js, PostgreSQL) and deployment settings.