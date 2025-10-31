# Backend API - Demo Application

Express.js backend with mocked data for demo purposes.

## Getting Started

```bash
npm install
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base
- `GET /` - API information and available endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Analytics
- `GET /api/analytics` - Get dashboard analytics (users, revenue, orders, etc.)

### Activity
- `GET /api/activity` - Get recent user activity

### Sales
- `GET /api/sales` - Get sales data by month

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "count": 5
}
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
