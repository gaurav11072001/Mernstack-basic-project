import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './auth.css';
import axios from 'axios';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  const { name, email, currentPassword, newPassword, confirmPassword } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear validation error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };
  
  const validateProfileForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const updateProfile = async () => {
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.put('/api/users/profile', 
        { name, email }, 
        config
      );
      
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      showNotification(
        err.response?.data?.msg || 'Failed to update profile', 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePassword = async () => {
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.put('/api/users/password', 
        { 
          currentPassword, 
          newPassword 
        }, 
        config
      );
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showNotification('Password updated successfully!', 'success');
    } catch (err) {
      showNotification(
        err.response?.data?.msg || 'Failed to update password', 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      
      try {
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete('/api/users', config);
        
        logout();
        navigate('/login');
      } catch (err) {
        showNotification(
          err.response?.data?.msg || 'Failed to delete account', 
          'error'
        );
        setIsLoading(false);
      }
    }
  };
  
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    if (activeTab === 'profile') {
      updateProfile();
    } else if (activeTab === 'password') {
      updatePassword();
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">User Profile</h3>
            </div>
            
            <div className="card-body">
              {notification && (
                <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                  {notification.message}
                  <button type="button" className="btn-close" onClick={() => setNotification(null)} aria-label="Close"></button>
                </div>
              )}
              
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person me-2"></i>Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('password')}
                  >
                    <i className="bi bi-key me-2"></i>Password
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'danger' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('danger')}
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>Danger Zone
                  </button>
                </li>
              </ul>
              
              {activeTab === 'profile' && (
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      disabled={isLoading}
                    />
                    {formErrors.name && (
                      <div className="invalid-feedback">
                        {formErrors.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      disabled={isLoading}
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">
                        {formErrors.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'password' && (
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${formErrors.currentPassword ? 'is-invalid' : ''}`}
                        id="currentPassword"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={onChange}
                        disabled={isLoading}
                      />
                      {formErrors.currentPassword && (
                        <div className="invalid-feedback">
                          {formErrors.currentPassword}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${formErrors.newPassword ? 'is-invalid' : ''}`}
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={onChange}
                        disabled={isLoading}
                      />
                      {formErrors.newPassword && (
                        <div className="invalid-feedback">
                          {formErrors.newPassword}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        disabled={isLoading}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {formErrors.confirmPassword && (
                        <div className="invalid-feedback">
                          {formErrors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'danger' && (
                <div className="danger-zone p-4 border border-danger rounded">
                  <h4 className="text-danger mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Danger Zone
                  </h4>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                  <button 
                    className="btn btn-danger"
                    onClick={deleteAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-2"></i>
                        Delete Account
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
