import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { FiHome, FiUser, FiLogIn, FiUserPlus, FiLogOut, FiMoon, FiSun, FiMenu, FiX, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const onLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };
  
  // eslint-disable-next-line no-unused-vars
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${scrolled ? 'scrolled' : ''} ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <i className="bi bi-stack me-2"></i>
          <span>MERN Items Manager</span>
        </a>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/')}`} 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="icon-sm me-1" /> Home
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/dashboard')}`} 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="icon-sm me-1" /> Dashboard
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/admin')}`} 
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiShoppingBag className="icon-sm me-1" /> Admin
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/shop')}`} 
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiShoppingBag className="icon-sm me-1" /> Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/food-delivery')}`} 
                to="/food-delivery"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiShoppingCart className="icon-sm me-1" /> Food Delivery
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item me-2">
              <Link 
                className={`nav-link ${isActive('/cart')}`} 
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiShoppingCart className="icon-sm me-1" /> Cart
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  id="navbarDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ background: 'none', border: 'none' }}
                >
                  <div className="avatar-circle me-2">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="d-none d-md-inline">{user?.name || 'Account'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="navbarDropdown">
                  <li>
                    <Link 
                      className="dropdown-item py-2" 
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser className="me-2" /> Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={onLogout}>
                      <FiLogOut className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/login')}`} 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiLogIn className="icon-sm me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/register')}`} 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUserPlus className="icon-sm me-1" /> Register
                  </Link>
                </li>
              </>
            )}
            
            <li className="nav-item ms-lg-2">
              <button 
                className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} rounded-circle p-2`} 
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
