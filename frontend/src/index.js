import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import reportWebVitals from './reportWebVitals';

// Import e-commerce components
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import Admin from './pages/Admin';
import FoodDelivery from './pages/FoodDelivery';
import FoodDetail from './components/FoodDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/profile', element: <Profile /> },
      { path: '/dashboard', element: <Dashboard /> },
      
      // E-commerce routes
      { path: '/shop', element: <ProductList /> },
      { path: '/product/:id', element: <ProductDetail /> },
      { path: '/cart', element: <ShoppingCart /> },
      { path: '/checkout', element: <Checkout /> },
      
      // Admin routes
      { path: '/admin', element: <Admin /> },
      
      // Food Delivery routes
      { path: '/food-delivery', element: <FoodDelivery /> },
      { path: '/food/:id', element: <FoodDetail /> }
    ]
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
