# Harvest Direct Backend - Render Deployment Guide

## Overview
This is the backend API server for the Harvest Direct e-commerce platform, built with Node.js, Express, and PostgreSQL.

## Deployment Steps on Render

### 1. Prerequisites
- GitHub account with your code pushed to a repository
- Render account (free tier available)
- PostgreSQL database credentials
- Razorpay API keys (for payments)
- Email service credentials (for notifications)

### 2. Database Setup on Render

1. **Create PostgreSQL Database:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "PostgreSQL"
   - Name: `harvest-direct-db`
   - Database Name: `harvest_direct`
   - User: `harvest_user`
   - Select Free tier
   - Click "Create Database"

2. **Note Database Details:**
   - Save the connection string provided by Render
   - Format: `postgresql://username:password@hostname:port/database`

### 3. Web Service Deployment

1. **Create Web Service:**
   - In Render Dashboard, click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `harvest-direct-backend` folder as root directory

2. **Configure Build Settings:**
   - **Name:** `harvest-direct-backend`
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

3. **Environment Variables:**
   Add these environment variables in Render:

   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[Your PostgreSQL connection string from step 2]
   JWT_SECRET=[Generate a random 32+ character string]
   RAZORPAY_KEY_ID=[Your Razorpay key ID]
   RAZORPAY_KEY_SECRET=[Your Razorpay secret]
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=[Your Gmail address]
   EMAIL_PASS=[Your Gmail app password]
   ```

### 4. Required API Keys and Credentials

You'll need to obtain these from external services:

#### Razorpay (Payment Processing)
1. Sign up at [Razorpay](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. Use test keys for development, live keys for production

#### Email Service (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use your Gmail address and the app password

### 5. Database Migration

After deployment, your database will be automatically initialized with:
- Product tables
- User management
- Cart functionality
- Order processing
- Newsletter subscriptions
- Admin features

### 6. Verify Deployment

1. **Health Check:**
   Visit: `https://your-app-name.onrender.com/api/health`
   Should return: `{"status": "OK", "timestamp": "..."}`

2. **API Endpoints:**
   - Products: `/api/products`
   - Authentication: `/api/auth/login`
   - Admin: `/api/admin/login`

### 7. Domain Configuration

- Your API will be available at: `https://your-app-name.onrender.com`
- Update your frontend to use this URL for API calls
- Configure CORS if needed for your frontend domain

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/payment/verify` - Verify payment

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | Yes |
| `EMAIL_HOST` | SMTP host | Yes |
| `EMAIL_PORT` | SMTP port | Yes |
| `EMAIL_USER` | Email username | Yes |
| `EMAIL_PASS` | Email password | Yes |
| `PORT` | Server port (auto-set by Render) | No |
| `NODE_ENV` | Environment mode | No |

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Verify DATABASE_URL is correct
   - Check database is running and accessible

2. **Payment Processing Issues:**
   - Verify Razorpay credentials
   - Check webhook configuration

3. **Email Delivery Problems:**
   - Verify Gmail app password
   - Check email credentials

4. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Logs Access:
- View deployment logs in Render Dashboard
- Check application logs for runtime errors

## Support

For deployment issues:
1. Check Render documentation
2. Verify all environment variables
3. Review application logs
4. Ensure database connection is working

The backend provides a complete API for the Harvest Direct e-commerce platform with authentication, product management, cart functionality, payment processing, and admin features.