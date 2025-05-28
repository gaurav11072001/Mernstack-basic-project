import React, { useEffect, useState } from 'react';

const Notification = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800); // Slightly less than the parent timeout to allow for fade-out
    
    return () => clearTimeout(timer);
  }, [message]);
  
  const getNotificationClass = () => {
    switch(type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };
  
  const getIcon = () => {
    switch(type) {
      case 'success':
        return <i className="bi bi-check-circle-fill me-2"></i>;
      case 'error':
        return <i className="bi bi-exclamation-circle-fill me-2"></i>;
      case 'warning':
        return <i className="bi bi-exclamation-triangle-fill me-2"></i>;
      default:
        return <i className="bi bi-info-circle-fill me-2"></i>;
    }
  };
  
  return (
    <div 
      className={`notification alert ${getNotificationClass()} d-flex align-items-center ${isVisible ? 'show' : 'hide'}`}
      role="alert"
    >
      {getIcon()}
      <div>{message}</div>
    </div>
  );
};

export default Notification;
