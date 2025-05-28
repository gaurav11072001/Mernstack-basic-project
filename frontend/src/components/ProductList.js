import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiFilter, FiSearch } from 'react-icons/fi';
import axios from '../utils/axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(false);

  // Categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Kitchen' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

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

  const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (category !== 'all') {
          params.append('category', category);
        }
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        params.append('sort', sort);
        params.append('page', currentPage);
        
        const response = await axios.get(`/api/products?${params.toString()}`);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm, sort, currentPage]);

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { 
        itemId: productId,
        itemType: 'product',
        quantity: 1
      });
      // Show success notification
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setFilters(!filters);
  };

  // Render star ratings
  const renderRating = (rating) => {
    return (
      <div className="product-rating">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={i < Math.round(rating) ? "star filled" : "star"} 
          />
        ))}
        <span className="rating-number">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Pagination controls
  const renderPagination = () => {
    return (
      <div className="pagination">
        <button 
          className="btn btn-sm" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          className="btn btn-sm" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Shop Our Products</h1>
        <p>Discover our wide range of high-quality products</p>
        
        <div className="filter-toggle-mobile">
          <button className="btn btn-outline-primary" onClick={toggleFilters}>
            <FiFilter /> Filters
          </button>
        </div>
      </div>
      
      <div className="product-list-content">
        <div className={`product-filters ${filters ? 'show' : ''}`}>
          <div className="filter-section">
            <h4>Search</h4>
            <form onSubmit={handleSearch} className="search-form">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>
          
          <div className="filter-section">
            <h4>Categories</h4>
            <div className="category-filters">
              {categories.map((cat) => (
                <div className="form-check" key={cat.value}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    id={`category-${cat.value}`}
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={() => {
                      setCategory(cat.value);
                      setCurrentPage(1);
                    }}
                  />
                  <label className="form-check-label" htmlFor={`category-${cat.value}`}>
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Sort By</h4>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="products-grid-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try changing your search criteria or check back later for new products.</p>
            </div>
          ) : (
            <>
              <motion.div 
                className="products-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product) => (
                  <motion.div 
                    className="product-card" 
                    key={product._id}
                    variants={productVariants}
                  >
                    <div className="product-image">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                      </h3>
                      {renderRating(product.rating)}
                      <div className="product-price">${product.price.toFixed(2)}</div>
                      <div className="product-actions">
                        <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-primary">
                          View Details
                        </Link>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={!product.inStock}
                        >
                          <FiShoppingCart /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
