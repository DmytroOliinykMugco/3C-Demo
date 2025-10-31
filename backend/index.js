import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mocked Data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'active' }
];

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 45, rating: 4.5 },
  { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stock: 150, rating: 4.2 },
  { id: 3, name: 'USB-C Cable', price: 12.99, category: 'Accessories', stock: 200, rating: 4.0 },
  { id: 4, name: 'Monitor 27"', price: 399.99, category: 'Electronics', stock: 30, rating: 4.7 },
  { id: 5, name: 'Keyboard Mechanical', price: 89.99, category: 'Accessories', stock: 75, rating: 4.6 }
];

const analytics = {
  totalUsers: 1247,
  activeUsers: 892,
  totalRevenue: 125430.50,
  totalOrders: 3421,
  conversionRate: 3.2,
  averageOrderValue: 36.67
};

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'Purchased Laptop Pro', timestamp: '2024-10-31T10:30:00Z', amount: 1299.99 },
  { id: 2, user: 'Jane Smith', action: 'Added Monitor to cart', timestamp: '2024-10-31T10:25:00Z', amount: 0 },
  { id: 3, user: 'Bob Johnson', action: 'Registered new account', timestamp: '2024-10-31T10:20:00Z', amount: 0 },
  { id: 4, user: 'Alice Brown', action: 'Purchased Wireless Mouse', timestamp: '2024-10-31T10:15:00Z', amount: 29.99 },
  { id: 5, user: 'Charlie Wilson', action: 'Left product review', timestamp: '2024-10-31T10:10:00Z', amount: 0 }
];

const salesData = [
  { month: 'Jan', sales: 45000, orders: 320 },
  { month: 'Feb', sales: 52000, orders: 380 },
  { month: 'Mar', sales: 48000, orders: 350 },
  { month: 'Apr', sales: 61000, orders: 420 },
  { month: 'May', sales: 55000, orders: 390 },
  { month: 'Jun', sales: 67000, orders: 480 },
  { month: 'Jul', sales: 72000, orders: 510 },
  { month: 'Aug', sales: 68000, orders: 495 },
  { month: 'Sep', sales: 74000, orders: 530 },
  { month: 'Oct', sales: 79000, orders: 560 }
];

const profileData = {
  userId: '3298-981239',
  status: 'Mister',
  firstName: 'Scott',
  lastName: 'Miller',
  middleName: 'Sasha',
  prefix: '',
  suffix: '',
  phoneNumber: '+00 000 0000 00 00',
  email: 'Scott.miller@gmail.com',
  secondNumber: '+00 000 0000 00 00',
  country: 'USA',
  addressLine1: '20 W 34th St., New York, NY 10001, United States',
  addressLine2: '',
  state: 'CA',
  city: 'Menlo park',
  zipCode: '01000',
  initials: 'SM'
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Demo Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      analytics: '/api/analytics',
      activity: '/api/activity',
      sales: '/api/sales',
      profile: '/api/profile'
    }
  });
});

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users, count: users.length });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products, count: products.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  res.json({ success: true, data: analytics });
});

// Recent activity endpoint
app.get('/api/activity', (req, res) => {
  res.json({ success: true, data: recentActivity, count: recentActivity.length });
});

// Sales data endpoint
app.get('/api/sales', (req, res) => {
  res.json({ success: true, data: salesData });
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  res.json({ success: true, data: profileData });
});

app.put('/api/profile', (req, res) => {
  // Update profile data with request body
  Object.assign(profileData, req.body);
  res.json({ success: true, data: profileData, message: 'Profile updated successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
