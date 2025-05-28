import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import ProductForm from '../components/ProductForm';
import './Admin.css';

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        params.append('page', currentPage);
        
        const response = await axios.get(`/api/products?${params.toString()}`);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, currentPage]);

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  // Handle form success
  const handleFormSuccess = (product) => {
    if (editProduct) {
      // Update existing product in the list
      setProducts(products.map(p => p._id === product._id ? product : p));
    } else {
      // Add new product to the list
      setProducts([product, ...products]);
    }
    
    setShowForm(false);
    setEditProduct(null);
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

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>You need to be logged in to access the admin panel.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Product Management</h1>
        <p>Manage your store's products</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="admin-actions">
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

        <button 
          className="btn btn-primary add-product-btn"
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      {showForm ? (
        <ProductForm 
          editProduct={editProduct} 
          onSuccess={handleFormSuccess} 
        />
      ) : (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Start adding products to your store.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowForm(true)}
              >
                <FiPlus /> Add First Product
              </button>
            </div>
          ) : (
            <>
              <motion.div 
                className="products-table-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <motion.tr 
                        key={product._id}
                        variants={itemVariants}
                      >
                        <td className="product-image">
                          <img src={product.imageUrl} alt={product.name} />
                        </td>
                        <td>{product.name}</td>
                        <td>
                          <span className="category-badge">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </span>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? `${product.quantity} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="actions">
                          <Link 
                            to={`/product/${product._id}`} 
                            className="btn btn-sm btn-outline-primary"
                            title="View Product"
                          >
                            <FiEye />
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditProduct(product)}
                            title="Edit Product"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product._id)}
                            title="Delete Product"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              
              {renderPagination()}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
