import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import FoodList from '../components/FoodList';
import axios from '../utils/axios';
import './FoodDelivery.css';

const FoodDelivery = () => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedFoods = async () => {
      try {
        const response = await axios.get('/api/foods/featured');
        setFeaturedFoods(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured foods:', error);
        setLoading(false);
      }
    };

    // Define food categories with images
    const foodCategories = [
      {
        id: 'breakfast',
        name: 'Breakfast',
        image: 'https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Start your day right with our delicious breakfast options'
      },
      {
        id: 'lunch',
        name: 'Lunch',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Perfect midday meals for a productive afternoon'
      },
      {
        id: 'dinner',
        name: 'Dinner',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
        description: 'End your day with our gourmet dinner selections'
      },
      {
        id: 'dessert',
        name: 'Desserts',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=327&q=80',
        description: 'Sweet treats to satisfy your cravings'
      },
      {
        id: 'beverage',
        name: 'Beverages',
        image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Refreshing drinks for any occasion'
      },
      {
        id: 'vegan',
        name: 'Vegan',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Plant-based options full of flavor and nutrition'
      }
    ];

    setCategories(foodCategories);
    fetchFeaturedFoods();
  }, []);

  return (
    <div className="food-delivery-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Delicious Food, Delivered Fast
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Order from our wide selection of gourmet meals prepared by expert chefs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a href="#food-menu" className="cta-button">
              Explore Menu <FiArrowRight />
            </a>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Browse Menu</h3>
            <p>Explore our wide selection of dishes from various cuisines</p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Place Order</h3>
            <p>Select your favorite meals and add them to your cart</p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Fast Delivery</h3>
            <p>Get your food delivered to your doorstep in 30 minutes or less</p>
          </div>
          <div className="step">
            <div className="step-icon">4</div>
            <h3>Enjoy!</h3>
            <p>Savor your delicious meal and share your experience</p>
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      {!loading && featuredFoods.length > 0 && (
        <section className="featured-foods-section">
          <h2>Featured Dishes</h2>
          <p>Our most popular and highly rated dishes</p>
          
          <div className="featured-foods-grid">
            {featuredFoods.map(food => (
              <motion.div 
                key={food._id}
                className="featured-food-card"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <a href={`/food/${food._id}`} className="featured-food-link">
                  <div className="featured-food-image">
                    <img src={food.imageUrl} alt={food.name} />
                    {food.dietaryInfo?.isVegetarian && <span className="veg-badge">Veg</span>}
                  </div>
                  <div className="featured-food-content">
                    <h3>{food.name}</h3>
                    <p>{food.description.substring(0, 60)}...</p>
                    <div className="featured-food-meta">
                      <span className="featured-food-price">${food.price.toFixed(2)}</span>
                      <span className="featured-food-time">{food.preparationTime} min</span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Food Categories Section */}
      <section className="food-categories-section">
        <h2>Browse by Category</h2>
        <p>Explore our menu categories</p>
        
        <div className="categories-grid">
          {categories.map(category => (
            <motion.div 
              key={category.id}
              className="category-card"
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <a href={`#${category.id}`} className="category-link">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Food Menu Section */}
      <section id="food-menu" className="food-menu-section">
        <h2>Our Menu</h2>
        <p>Browse our full selection of dishes</p>
        
        <FoodList />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"The food is always fresh and delicious. Delivery is prompt and the app is easy to use. My go-to food delivery service!"</p>
            </div>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah J." />
              <div>
                <h4>Sarah J.</h4>
                <p>Regular Customer</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"I love the variety of options available. As someone with dietary restrictions, it's great to find so many choices that suit my needs."</p>
            </div>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael T." />
              <div>
                <h4>Michael T.</h4>
                <p>Vegan Food Lover</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"The quality of food is exceptional. It's like having a restaurant-quality meal in the comfort of my home. Highly recommended!"</p>
            </div>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emily R." />
              <div>
                <h4>Emily R.</h4>
                <p>Food Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="download-app-section">
        <div className="download-content">
          <h2>Get the Mobile App</h2>
          <p>Download our mobile app for a better experience. Order food, track delivery, and get exclusive offers.</p>
          <div className="app-buttons">
            <button className="app-button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" />
            </button>
            <button className="app-button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="Download on App Store" />
            </button>
          </div>
        </div>
        <div className="app-image">
          <img src="https://www.pngall.com/wp-content/uploads/5/Smartphone-Mobile-PNG-Picture.png" alt="Mobile App" />
        </div>
      </section>
    </div>
  );
};

export default FoodDelivery;
