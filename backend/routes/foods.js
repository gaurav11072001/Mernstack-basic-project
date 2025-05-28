const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');

// @route   GET api/foods
// @desc    Get all foods with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10, featured } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    // Build sort object
    let sortOption = {};
    
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'prep-time') {
      sortOption = { preparationTime: 1 };
    } else {
      // Default sort by newest
      sortOption = { createdAt: -1 };
    }
    
    // Count total documents for pagination
    const total = await Food.countDocuments(filter);
    
    // Get foods
    const foods = await Food.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json({
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalFoods: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/foods/category/:category
// @desc    Get foods by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const foods = await Food.find({ 
      category: req.params.category 
    }).sort({ rating: -1 });
    
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/foods/featured
// @desc    Get featured foods
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const foods = await Food.find({ 
      featured: true 
    }).sort({ rating: -1 }).limit(6);
    
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/foods/:id
// @desc    Get food by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    res.json(food);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   POST api/foods
// @desc    Create a food item
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      imageUrl, 
      category, 
      preparationTime,
      calories,
      ingredients,
      dietaryInfo 
    } = req.body;
    
    // Simple validation
    if (!name || !description || !price || !category || !ingredients) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    // Create new food item
    const newFood = new Food({
      name,
      description,
      price,
      imageUrl,
      category,
      preparationTime: preparationTime || 30,
      calories: calories || 0,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      dietaryInfo: dietaryInfo || {}
    });
    
    const food = await newFood.save();
    
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/foods/:id
// @desc    Update a food item
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      imageUrl, 
      category, 
      preparationTime,
      calories,
      ingredients,
      dietaryInfo,
      inStock,
      featured
    } = req.body;
    
    // Find food by ID
    let food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    // Update food fields
    if (name) food.name = name;
    if (description) food.description = description;
    if (price) food.price = price;
    if (imageUrl) food.imageUrl = imageUrl;
    if (category) food.category = category;
    if (preparationTime) food.preparationTime = preparationTime;
    if (calories !== undefined) food.calories = calories;
    if (ingredients) {
      food.ingredients = Array.isArray(ingredients) ? ingredients : [ingredients];
    }
    if (dietaryInfo) food.dietaryInfo = { ...food.dietaryInfo, ...dietaryInfo };
    if (inStock !== undefined) food.inStock = inStock;
    if (featured !== undefined) food.featured = featured;
    
    // Save updated food
    await food.save();
    
    res.json(food);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/foods/:id
// @desc    Delete a food item
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    res.json({ msg: 'Food item removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   POST api/foods/:id/reviews
// @desc    Create a food review
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Find food by ID
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    
    // Check if user already reviewed this food
    const alreadyReviewed = food.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ msg: 'Food item already reviewed' });
    }
    
    // Create new review
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };
    
    // Add review to food
    food.reviews.push(review);
    
    // Update food rating
    food.rating = food.reviews.reduce((acc, item) => item.rating + acc, 0) / food.reviews.length;
    
    // Save food with new review
    await food.save();
    
    res.status(201).json({ msg: 'Review added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
