import axios from 'axios';

// Create an instance of axios with a base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors
    if (error.response && error.response.status === 401) {
      console.log('Authentication error detected');
      // You could redirect to login page or refresh token here
    }
    return Promise.reject(error);
  }
);

// Helper function to set auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete instance.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default instance;
