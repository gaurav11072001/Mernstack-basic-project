import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiArrowLeft, FiHeart, FiShare2, FiPlus, FiMinus } from 'react-icons/fi';
import axios from '../utils/axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related products
  const fetchRelatedProducts = useCallback(async (category) => {
    try {
      const response = await axios.get(`/api/products?category=${category}&limit=4`);
      // Filter out the current product
      const filtered = response.data.products.filter(p => p._id !== id);
      setRelatedProducts(filtered.slice(0, 4));
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  }, [id]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
        
        // Fetch related products
        fetchRelatedProducts(response.data.category);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, fetchRelatedProducts]);

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      await axios.post('/api/cart', { 
        itemId: id,
        itemType: 'product',
        quantity 
      });
      // Show success notification
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    }
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

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/shop')}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <p>Product not found</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/shop')}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <motion.div 
        className="product-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="product-navigation">
          <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/shop')}>
            <FiArrowLeft /> Back to Shop
          </button>
        </div>
        
        <div className="product-detail-main">
          <div className="product-detail-image">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          
          <div className="product-detail-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              {renderRating(product.rating)}
              <span className="product-category">Category: {product.category}</span>
              <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="product-price">${product.price.toFixed(2)}</div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                >
                  <FiPlus />
                </button>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <FiShoppingCart /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="btn btn-outline-primary wishlist-btn">
                <FiHeart /> Wishlist
              </button>
              
              <button className="btn btn-outline-primary share-btn">
                <FiShare2 /> Share
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-detail-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Product Description</h3>
                <p>{product.description}</p>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <h3>Customer Reviews</h3>
                {product.reviews.length === 0 ? (
                  <p>No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="reviews-list">
                    {product.reviews.map((review, index) => (
                      <div className="review-item" key={index}>
                        <div className="review-header">
                          <h4>{review.name}</h4>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={i < review.rating ? "star filled" : "star"} 
                              />
                            ))}
                          </div>
                          <span className="review-date">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="tab-pane">
                <h3>Shipping & Returns</h3>
                <h4>Shipping Policy</h4>
                <p>We offer free shipping on all orders over $100. Standard shipping takes 3-5 business days.</p>
                
                <h4>Return Policy</h4>
                <p>If you're not satisfied with your purchase, you can return it within 30 days for a full refund.</p>
                
                <h4>Warranty</h4>
                <p>All products come with a standard 1-year warranty against manufacturing defects.</p>
              </div>
            )}
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div className="related-product-card" key={relatedProduct._id}>
                  <div className="related-product-image">
                    <img src={relatedProduct.imageUrl} alt={relatedProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-name" onClick={() => navigate(`/product/${relatedProduct._id}`)}>
                      {relatedProduct.name}
                    </h3>
                    <div className="related-product-price">${relatedProduct.price.toFixed(2)}</div>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductDetail;
