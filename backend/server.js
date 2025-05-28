require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something broke!' });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from MERN Backend!');
});

// Debug: Log when requiring routes
console.log('Loading routes...');

// Routes
console.log('Loading items routes...');
app.use('/api/items', require('./routes/items'));

console.log('Loading auth routes...');
app.use('/api/auth', require('./routes/auth'));

console.log('Loading users routes...');
app.use('/api/users', require('./routes/users'));

console.log('Loading products routes...');
app.use('/api/products', require('./routes/products'));

console.log('Loading cart routes...');
try {
  const cartRoutes = require('./routes/cart');
  console.log('Cart routes loaded successfully');
  app.use('/api/cart', cartRoutes);
} catch (err) {
  console.error('Error loading cart routes:', err);
  throw err;
}

console.log('Loading orders routes...');
app.use('/api/orders', require('./routes/orders'));

console.log('Loading foods routes...');
app.use('/api/foods', require('./routes/foods'));

// API Home route
app.get('/api', (req, res) => {
  res.json({ msg: 'Welcome to the MERN Stack API' });
});

// Test route directly in server.js
app.get('/api/test-cart', (req, res) => {
  console.log('Test cart route hit!');
  res.json({ message: 'Test cart route is working from server.js' });
});


// Check required environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env file');
  process.exit(1);
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB');
      startServer();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.warn('Server starting without database connection due to connection error.');
      startServer(); // Start server even if DB connection fails for now
    });
} else {
  console.warn('MONGODB_URI not found. Server starting without database connection.');
  startServer();
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
