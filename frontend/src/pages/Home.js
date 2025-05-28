import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiList, FiPackage, FiAlertCircle } from 'react-icons/fi';
import ItemList from '../components/ItemList';
import ItemForm from '../components/ItemForm';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { items, addItem, deleteItem, isLoading, error, setError } = useOutletContext();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Animation variants for Framer Motion
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="container main-content py-4">
      {error && (
        <motion.div 
          className="alert alert-danger" 
          role="alert"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FiAlertCircle className="me-2" />
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </motion.div>
      )}
      
      <motion.div 
        className="welcome-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="welcome-title">
          Welcome{user ? `, ${user.name}` : ''}!
        </h1>
        <p className="welcome-subtitle">
          Manage your items with ease using this MERN stack application.
        </p>
        {user && (
          <motion.button 
            className="btn btn-light btn-lg mt-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FiPlus className="me-2" />
            {showAddForm ? 'Hide Form' : 'Add New Item'}
          </motion.button>
        )}
      </motion.div>
      
      <div className="row g-4 my-4">
        {(showAddForm || window.innerWidth >= 992) && (
          <motion.div 
            className="col-lg-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="item-form-container">
              <h3 className="form-title">
                <FiPlus /> Add New Item
              </h3>
              <ItemForm addItem={addItem} isLoading={isLoading} />
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className={showAddForm ? "col-lg-8" : "col-lg-12"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="items-container">
            <h2 className="section-title">
              <FiList /> Your Items
            </h2>
            
            {isLoading && items.length === 0 ? (
              <div className="loading-container">
                <div className="spinner-border text-primary loading-spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="loading-text">Loading your items...</p>
              </div>
            ) : items.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FiPackage className="empty-state-icon" />
                <h4 className="empty-state-title">No items found</h4>
                <p className="empty-state-text">
                  You haven't added any items yet. Use the form to create your first item!
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="item-grid"
              >
                <ItemList 
                  items={items} 
                  deleteItem={deleteItem} 
                  isLoading={isLoading} 
                  itemVariants={itemVariants}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
