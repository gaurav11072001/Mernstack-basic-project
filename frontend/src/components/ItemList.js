import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiCalendar } from 'react-icons/fi';

const ItemList = ({ items, deleteItem, isLoading, itemVariants }) => {
  // Empty state is now handled in the Home component
  
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  return (
    <>
      {items.map((item, index) => (
        <motion.div 
          className="item-card" 
          key={item._id || index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="card-title mb-2">{item.name}</h5>
              <div className="item-date">
                <FiCalendar className="me-1" />
                {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
            
            {item.description && (
              <p className="card-text mb-3">{item.description}</p>
            )}
            
            <div className="d-flex justify-content-end">
              <button 
                className="btn btn-outline-danger btn-sm" 
                onClick={(e) => handleDelete(item._id, e)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <FiTrash2 className="me-1" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default ItemList;
