import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiShoppingCart, FiFilter, FiSearch } from 'react-icons/fi';
import axios from '../utils/axios';
import './FoodList.css';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'appetizer', label: 'Appetizers' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'beverage', label: 'Beverages' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'prep-time', label: 'Preparation Time' },
    { value: 'newest', label: 'Newest' }
  ];

  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/foods';
        
        // If category is selected and not 'all', use the category endpoint
        if (category && category !== 'all') {
          endpoint = `/api/foods/category/${category}`;
          const response = await axios.get(endpoint);
          setFoods(response.data);
          setTotalPages(Math.ceil(response.data.length / 9));
          setLoading(false);
          return;
        }
        
        // Otherwise use the main endpoint with query parameters
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        params.append('sort', sort);
        params.append('page', currentPage);
        params.append('limit', 9); // Show 9 items per page
        
        const response = await axios.get(`${endpoint}?${params.toString()}`);
        
        // Check the structure of the response
        if (response.data.foods) {
          setFoods(response.data.foods);
          setTotalPages(response.data.totalPages || 1);
        } else if (Array.isArray(response.data)) {
          setFoods(response.data);
          setTotalPages(Math.ceil(response.data.length / 9));
        } else {
          setFoods([]);
          setTotalPages(1);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching foods:', err);
        setError('Failed to load menu items. Please try again.');
        setLoading(false);
      }
    };

    fetchFoods();
  }, [category, searchTerm, sort, currentPage]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle add to cart
  const handleAddToCart = async (foodId) => {
    try {
      await axios.post('/api/cart', {
        productId: foodId,
        quantity: 1
      });
      // Show success message or notification
      alert('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart. Please try again.');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Render food cards
  const renderFoodCards = () => {
    if (foods.length === 0) {
      return (
        <div className="no-results">
          <h3>No items found</h3>
          <p>Try adjusting your filters or search term</p>
        </div>
      );
    }

    return (
      <motion.div 
        className="food-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {foods.map((food) => (
          <motion.div 
            key={food._id} 
            className="food-card"
            variants={itemVariants}
          >
            <div className="food-image">
              <img src={food.imageUrl} alt={food.name} />
              {food.featured && <span className="featured-badge">Featured</span>}
              {food.dietaryInfo?.isVegetarian && <span className="veg-badge">Veg</span>}
            </div>
            <div className="food-content">
              <h3>{food.name}</h3>
              <p className="food-description">{food.description.substring(0, 80)}...</p>
              <div className="food-meta">
                <span className="prep-time">
                  <FiClock /> {food.preparationTime} min
                </span>
                <span className="rating">
                  <FiStar /> {food.rating.toFixed(1)}
                </span>
              </div>
              <div className="food-price-row">
                <span className="food-price">${food.price.toFixed(2)}</span>
                <div className="food-actions">
                  <Link to={`/food/${food._id}`} className="view-btn">View</Link>
                  <button 
                    className="cart-btn"
                    onClick={() => handleAddToCart(food._id)}
                    disabled={!food.inStock}
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    return (
      <div className="pagination">
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="food-list-container">
      <div className="food-list-header">
        <h1>Food Delivery</h1>
        <p>Delicious meals delivered to your doorstep</p>
      </div>

      <div className="food-list-actions">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </div>
        </form>

        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <motion.div 
          className="filters-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sort} 
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading delicious meals...</p>
        </div>
      ) : (
        <>
          {renderFoodCards()}
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default FoodList;
