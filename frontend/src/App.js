import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Notification from './components/Notification';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from './utils/axios';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch items when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Fetch all items from the API
  const fetchItems = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await axios.get('/api/items');
      setItems(res.data || []);
      console.log('Items fetched successfully:', res.data);
    } catch (err) {
      setError('Error fetching items. Please try again later.');
      console.error('Error fetching items:', err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new item
  const addItem = async (item) => {
    if (!isAuthenticated) {
      setError('You must be logged in to add items.');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await axios.post('/api/items', item);
      setItems([res.data, ...items]);
      showNotification('Item added successfully!', 'success');
      console.log('Item added successfully:', res.data);
    } catch (err) {
      setError('Error adding item. Please try again.');
      console.error('Error adding item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      showNotification('Item deleted successfully!', 'success');
    } catch (err) {
      setError('Error deleting item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <Outlet context={{
        items,
        addItem,
        deleteItem,
        isLoading,
        error,
        setError
      }} />
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
