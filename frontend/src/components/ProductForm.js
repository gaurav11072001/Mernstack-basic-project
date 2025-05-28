import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import axios from '../utils/axios';
import './ProductForm.css';

const ProductForm = ({ editProduct = null, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize form state with either edit product data or empty values
  const [formData, setFormData] = useState({
    name: editProduct?.name || '',
    description: editProduct?.description || '',
    price: editProduct?.price || '',
    imageUrl: editProduct?.imageUrl || '',
    category: editProduct?.category || 'other',
    quantity: editProduct?.quantity || 1,
    inStock: editProduct?.inStock !== false
  });

  // Categories for the dropdown
  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Kitchen' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format the data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10)
      };

      let response;
      if (editProduct) {
        // Update existing product
        response = await axios.put(`/api/products/${editProduct._id}`, productData);
      } else {
        // Create new product
        response = await axios.post('/api/products', productData);
      }

      setLoading(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        // Navigate to product detail page
        navigate(`/product/${response.data._id}`);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || 'Error saving product. Please try again.');
      console.error('Error saving product:', err);
    }
  };

  return (
    <motion.div 
      className="product-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-form-header">
        <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <p>Fill in the details below to {editProduct ? 'update the' : 'create a new'} product</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Product Name *</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price" className="form-label">Price ($) *</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity" className="form-label">Quantity *</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category *</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            type="url"
            className="form-control"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Product preview" />
            </div>
          )}
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="inStock">
            In Stock
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <FiX /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave /> {editProduct ? 'Update Product' : 'Add Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
