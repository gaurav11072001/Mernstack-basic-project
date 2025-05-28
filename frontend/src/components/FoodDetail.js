import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiShoppingCart, FiArrowLeft, FiHeart, FiShare2, FiPlus, FiMinus } from 'react-icons/fi';
import axios from '../utils/axios';
import './FoodDetail.css';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedFoods, setRelatedFoods] = useState([]);

  // Define fetchRelatedFoods with useCallback to avoid dependency issues
  const fetchRelatedFoods = React.useCallback(async (category) => {
    try {
      const response = await axios.get(`/api/foods/category/${category}`);
      // Filter out the current food and limit to 4 items
      const filtered = response.data
        .filter(item => item._id !== id)
        .slice(0, 4);
      setRelatedFoods(filtered);
    } catch (err) {
      console.error('Error fetching related foods:', err);
    }
  }, [id]);

  // Fetch food details
  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/foods/${id}`);
        setFood(response.data);
        setLoading(false);
        
        // Fetch related foods after getting the main food
        fetchRelatedFoods(response.data.category);
      } catch (err) {
        console.error('Error fetching food details:', err);
        setError('Failed to load food details. Please try again.');
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id, fetchRelatedFoods]);

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        setError('Please log in to add items to cart');
        return;
      }

      console.log('Making request to /api/cart with data:', {
        itemId: id,
        itemType: 'food',
        quantity: quantity
      });

      const response = await axios.post('/api/cart', {
        itemId: id,
        itemType: 'food',
        quantity: quantity
      });
      
      console.log('Response from server:', response);
      alert(`${quantity} item(s) added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data
        }
      });
      
      if (err.response?.status === 401) {
        setError('Please log in to add items to cart');
      } else if (err.response?.status === 404) {
        setError('Cart endpoint not found. Please check the server URL and try again.');
      } else {
        setError(`Failed to add item to cart: ${err.message}`);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="food-detail-loading">
        <div className="spinner"></div>
        <p>Loading food details...</p>
      </div>
    );
  }

  // Error state
  if (error || !food) {
    return (
      <div className="food-detail-error">
        <h2>Error</h2>
        <p>{error || 'Food not found'}</p>
        <button onClick={() => navigate('/food-delivery')} className="back-btn">
          <FiArrowLeft /> Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="food-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FiArrowLeft /> Back
      </button>

      <div className="food-detail-content">
        <div className="food-detail-left">
          <motion.div 
            className="food-detail-image"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={food.imageUrl} alt={food.name} />
            {food.featured && <span className="featured-badge">Featured</span>}
            {food.dietaryInfo?.isVegetarian && <span className="veg-badge">Vegetarian</span>}
            {food.dietaryInfo?.isVegan && <span className="vegan-badge">Vegan</span>}
          </motion.div>

          <div className="food-detail-actions">
            <button className="action-btn">
              <FiHeart /> Save
            </button>
            <button className="action-btn">
              <FiShare2 /> Share
            </button>
          </div>
        </div>

        <motion.div 
          className="food-detail-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="food-name">{food.name}</h1>
          
          <div className="food-meta">
            <span className="prep-time">
              <FiClock /> {food.preparationTime} min prep time
            </span>
            <span className="rating">
              <FiStar /> {food.rating.toFixed(1)} ({food.reviews.length} reviews)
            </span>
            {food.calories > 0 && (
              <span className="calories">{food.calories} calories</span>
            )}
          </div>

          <p className="food-description">{food.description}</p>

          {food.ingredients.length > 0 && (
            <div className="food-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {food.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="dietary-info">
            <h3>Dietary Information</h3>
            <div className="dietary-tags">
              {food.dietaryInfo?.isVegetarian && <span className="dietary-tag vegetarian">Vegetarian</span>}
              {food.dietaryInfo?.isVegan && <span className="dietary-tag vegan">Vegan</span>}
              {food.dietaryInfo?.isGlutenFree && <span className="dietary-tag gluten-free">Gluten Free</span>}
              {food.dietaryInfo?.isNutFree && <span className="dietary-tag nut-free">Nut Free</span>}
              {!food.dietaryInfo?.isVegetarian && !food.dietaryInfo?.isVegan && 
                !food.dietaryInfo?.isGlutenFree && !food.dietaryInfo?.isNutFree && 
                <span className="dietary-tag">No specific dietary information</span>}
            </div>
          </div>

          <div className="order-section">
            <div className="price-section">
              <h3>Price</h3>
              <span className="food-price">${food.price.toFixed(2)}</span>
            </div>

            <div className="quantity-section">
              <h3>Quantity</h3>
              <div className="quantity-control">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!food.inStock}
            >
              <FiShoppingCart /> {food.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related Foods Section */}
      {relatedFoods.length > 0 && (
        <div className="related-foods-section">
          <h2>You Might Also Like</h2>
          <div className="related-foods-grid">
            {relatedFoods.map(relatedFood => (
              <div 
                key={relatedFood._id} 
                className="related-food-card"
                onClick={() => navigate(`/food/${relatedFood._id}`)}
              >
                <div className="related-food-image">
                  <img src={relatedFood.imageUrl} alt={relatedFood.name} />
                </div>
                <div className="related-food-content">
                  <h3>{relatedFood.name}</h3>
                  <div className="related-food-meta">
                    <span className="related-food-price">${relatedFood.price.toFixed(2)}</span>
                    <span className="related-food-rating">
                      <FiStar /> {relatedFood.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
