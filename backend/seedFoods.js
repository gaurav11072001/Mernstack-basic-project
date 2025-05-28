require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Sample food data
const foodData = [
  {
    name: "Classic Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, tomatoes, basil, and extra virgin olive oil on a thin, crispy crust.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "dinner",
    preparationTime: 20,
    calories: 850,
    ingredients: ["Pizza dough", "Fresh mozzarella", "San Marzano tomatoes", "Fresh basil", "Extra virgin olive oil", "Salt"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isNutFree: true
    },
    inStock: true,
    featured: true,
    rating: 4.8
  },
  {
    name: "Avocado Toast",
    description: "Artisanal sourdough bread topped with mashed avocado, cherry tomatoes, microgreens, and a sprinkle of red pepper flakes.",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "breakfast",
    preparationTime: 10,
    calories: 320,
    ingredients: ["Sourdough bread", "Avocado", "Cherry tomatoes", "Microgreens", "Red pepper flakes", "Salt", "Olive oil"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      isNutFree: true
    },
    inStock: true,
    featured: true,
    rating: 4.5
  },
  {
    name: "Chicken Caesar Salad",
    description: "Crisp romaine lettuce, grilled chicken breast, parmesan cheese, and house-made croutons tossed in our signature Caesar dressing.",
    price: 11.99,
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "lunch",
    preparationTime: 15,
    calories: 450,
    ingredients: ["Romaine lettuce", "Grilled chicken breast", "Parmesan cheese", "Croutons", "Caesar dressing", "Black pepper"],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isNutFree: true
    },
    inStock: true,
    featured: false,
    rating: 4.3
  },
  {
    name: "Vegan Buddha Bowl",
    description: "Nutritious bowl with quinoa, roasted sweet potatoes, chickpeas, avocado, kale, and tahini dressing. Perfect for a balanced meal.",
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "vegan",
    preparationTime: 25,
    calories: 520,
    ingredients: ["Quinoa", "Sweet potatoes", "Chickpeas", "Avocado", "Kale", "Tahini", "Lemon juice", "Olive oil"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isNutFree: false
    },
    inStock: true,
    featured: true,
    rating: 4.7
  },
  {
    name: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=327&q=80",
    category: "dessert",
    preparationTime: 18,
    calories: 650,
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla ice cream", "Fresh berries"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isNutFree: false
    },
    inStock: true,
    featured: true,
    rating: 4.9
  },
  {
    name: "Mango Smoothie",
    description: "Refreshing blend of ripe mangoes, yogurt, honey, and a hint of cardamom. Perfect for a quick breakfast or afternoon pick-me-up.",
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
    category: "beverage",
    preparationTime: 5,
    calories: 280,
    ingredients: ["Mango", "Greek yogurt", "Honey", "Cardamom", "Ice"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isNutFree: true
    },
    inStock: true,
    featured: false,
    rating: 4.6
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, pickles, and our special sauce on a brioche bun. Served with crispy fries.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=999&q=80",
    category: "dinner",
    preparationTime: 15,
    calories: 850,
    ingredients: ["Beef patty", "Brioche bun", "Lettuce", "Tomato", "Onion", "Pickles", "Special sauce", "Fries"],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isNutFree: true
    },
    inStock: true,
    featured: true,
    rating: 4.7
  },
  {
    name: "Vegetable Stir Fry",
    description: "Colorful mix of fresh vegetables stir-fried in a savory sauce, served over steamed rice or noodles.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    category: "vegetarian",
    preparationTime: 20,
    calories: 380,
    ingredients: ["Bell peppers", "Broccoli", "Carrots", "Snow peas", "Mushrooms", "Garlic", "Ginger", "Soy sauce", "Rice"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isNutFree: true
    },
    inStock: true,
    featured: false,
    rating: 4.4
  },
  {
    name: "Pancake Stack",
    description: "Fluffy pancakes stacked high, served with maple syrup, fresh berries, and a dollop of whipped cream.",
    price: 10.99,
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "breakfast",
    preparationTime: 15,
    calories: 720,
    ingredients: ["Flour", "Eggs", "Milk", "Butter", "Maple syrup", "Mixed berries", "Whipped cream"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isNutFree: true
    },
    inStock: true,
    featured: true,
    rating: 4.8
  },
  {
    name: "Caprese Salad",
    description: "Simple and elegant salad with fresh mozzarella, ripe tomatoes, and basil, drizzled with balsamic glaze and olive oil.",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
    category: "appetizer",
    preparationTime: 10,
    calories: 320,
    ingredients: ["Fresh mozzarella", "Tomatoes", "Fresh basil", "Balsamic glaze", "Extra virgin olive oil", "Salt", "Black pepper"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isNutFree: true
    },
    inStock: true,
    featured: false,
    rating: 4.5
  },
  {
    name: "Grilled Salmon",
    description: "Perfectly grilled salmon fillet with lemon-dill sauce, served with roasted vegetables and quinoa.",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "dinner",
    preparationTime: 25,
    calories: 520,
    ingredients: ["Salmon fillet", "Lemon", "Dill", "Garlic", "Olive oil", "Mixed vegetables", "Quinoa"],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isNutFree: true
    },
    inStock: true,
    featured: true,
    rating: 4.7
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder.",
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=435&q=80",
    category: "dessert",
    preparationTime: 30,
    calories: 420,
    ingredients: ["Ladyfingers", "Mascarpone cheese", "Coffee", "Eggs", "Sugar", "Cocoa powder"],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isNutFree: true
    },
    inStock: true,
    featured: false,
    rating: 4.6
  }
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing foods
      await Food.deleteMany({});
      console.log('Cleared existing food data');
      
      // Insert new food data
      const foods = await Food.insertMany(foodData);
      console.log(`Successfully seeded ${foods.length} food items`);
      
      // Add some reviews to foods
      const reviews = [
        {
          name: "John Doe",
          rating: 5,
          comment: "Absolutely delicious! Will order again."
        },
        {
          name: "Jane Smith",
          rating: 4,
          comment: "Very tasty and arrived hot. Portion size could be bigger."
        },
        {
          name: "Mike Johnson",
          rating: 5,
          comment: "Perfect meal! Fresh ingredients and amazing flavors."
        }
      ];
      
      // Add reviews to each food item
      for (const food of foods) {
        food.reviews = reviews.map(review => ({
          ...review,
          user: new mongoose.Types.ObjectId(),
          date: new Date()
        }));
        
        await food.save();
      }
      
      console.log('Added reviews to food items');
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
