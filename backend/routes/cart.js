const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Food = require('../models/Food');

console.log('Cart routes file loaded');

// Simple test route to verify cart routes are working
router.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Cart routes are working!' });
});

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalPrice: 0
      });
      
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, itemType, quantity = 1 } = req.body;
    
    if (!itemId || !itemType) {
      return res.status(400).json({ msg: 'ItemId and itemType are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }
    
    let item;
    // Validate item exists
    if (itemType === 'product') {
      item = await Product.findById(itemId);
    } else if (itemType === 'food') {
      item = await Food.findById(itemId);
    } else {
      return res.status(400).json({ msg: 'Invalid item type' });
    }

    if (!item) {
      return res.status(404).json({ msg: `${itemType} not found` });
    }
    
    // Check if item is in stock
    if (!item.inStock) {
      return res.status(400).json({ msg: `${itemType} is out of stock` });
    }
    
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    // Create a new cart if one doesn't exist
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalPrice: 0
      });
    }
    
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      cartItem => cartItem.itemId?.toString() === itemId && cartItem.itemType === itemType
    );
    
    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        itemId: itemId,
        itemType: itemType,
        name: item.name || 'Unknown Item',
        quantity,
        price: item.price || 0,
        imageUrl: item.imageUrl || ''
      });
    }
    
    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    
    // Save cart
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }
    
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    // Find item in cart - handle potential null/undefined values
    let itemIndex = -1;
    try {
      itemIndex = cart.items.findIndex(item => {
        if (!item || !item._id) return false;
        return item._id.toString() === req.params.itemId;
      });
    } catch (err) {
      console.error('Error finding item in cart:', err);
      return res.status(500).json({ msg: 'Error processing cart items' });
    }
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    const cartItem = cart.items[itemIndex];
    
    // Skip product validation if needed
    const skipValidation = req.query.skipValidation === 'true';
    
    if (!skipValidation) {
      // Check item stock based on type
      let item = null;
      let stockError = false;
      
      try {
        if (!cartItem.itemId) {
          // Item ID is missing, remove from cart
          cart.items.splice(itemIndex, 1);
          await cart.save();
          return res.status(400).json({ msg: 'Invalid item in cart' });
        }
        
        if (cartItem.itemType === 'product') {
          item = await Product.findById(cartItem.itemId);
        } else if (cartItem.itemType === 'food') {
          item = await Food.findById(cartItem.itemId);
        }
  
        // Only check stock if we found the item
        if (item) {
          // Use optional chaining and nullish coalescing for safety
          const inStock = item?.inStock ?? true; // Default to true if inStock is not defined
          const itemQuantity = item?.quantity ?? Infinity; // Default to unlimited if quantity is not defined
          
          if (!inStock || itemQuantity < quantity) {
            stockError = true;
          }
        }
      } catch (err) {
        console.error('Error finding item:', err);
        // Continue with the update anyway, but log the error
      }
      
      // Handle missing or invalid items
      if (!item || stockError) {
        // Remove the item from cart
        cart.items.splice(itemIndex, 1);
        
        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
          (total, item) => total + ((item?.price || 0) * (item?.quantity || 0)),
          0
        );
        
        // Save the updated cart
        await cart.save();
        
        // Return appropriate error message
        if (stockError) {
          return res.status(400).json({ msg: 'Item is out of stock or insufficient quantity' });
        } else {
          return res.status(404).json({ msg: 'Item no longer exists in catalog' });
        }
      }
    }
    
    // Update item quantity safely
    try {
      cart.items[itemIndex].quantity = quantity;
      
      // Recalculate total price with null safety
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + ((item?.price || 0) * (item?.quantity || 0)),
        0
      );
      
      // Save cart
      await cart.save();
      
      res.json(cart);
    } catch (err) {
      console.error('Error updating cart:', err);
      res.status(500).json({ msg: 'Error updating cart' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', auth, async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    // Find item index
    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    
    // Save cart
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    // Clear cart items
    cart.items = [];
    cart.totalPrice = 0;
    
    // Save cart
    await cart.save();
    
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

console.log('Exporting cart router');
module.exports = router;
