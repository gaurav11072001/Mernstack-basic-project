import React from 'react';
import { useRouteError } from 'react-router-dom';

function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Oops! Something went wrong</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="error-message">
          {error.status === 404 ? (
            'Page not found'
          ) : (
            error.message || 'Unknown error occurred'
          )}
        </p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
