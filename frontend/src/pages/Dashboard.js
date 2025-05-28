import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from '../utils/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalItems: 0,
    recentItems: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get user's items
        const res = await axios.get('/api/items');
        
        setStats({
          totalItems: res.data.length,
          recentItems: res.data.slice(0, 5) // Get only the 5 most recent items
        });
      } catch (err) {
        setError('Error loading dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-5 fw-bold">Dashboard</h1>
          <p className="lead text-muted">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-md-end">
          <Link to="/profile" className="btn btn-outline-primary me-2">
            <i className="bi bi-person me-2"></i>Profile
          </Link>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>Add Item
          </Link>
        </div>
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

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-collection me-2 text-primary"></i>
                Items Overview
              </h5>
              <div className="d-flex align-items-center mt-4">
                <div className="display-4 fw-bold me-3">{stats.totalItems}</div>
                <div className="text-muted">Total items in your collection</div>
              </div>
              <div className="mt-4">
                <Link to="/" className="btn btn-sm btn-outline-primary">
                  View All Items
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Recent Items
              </h5>
              
              {stats.recentItems.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="mt-3 text-muted">No items found</p>
                  <Link to="/" className="btn btn-primary mt-2">
                    Add Your First Item
                  </Link>
                </div>
              ) : (
                <div className="table-responsive mt-3">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentItems.map(item => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>
                            {item.description ? (
                              item.description.length > 30 
                                ? `${item.description.substring(0, 30)}...` 
                                : item.description
                            ) : (
                              <span className="text-muted">No description</span>
                            )}
                          </td>
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                          <td>
                            <Link to="/" className="btn btn-sm btn-outline-primary me-2">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-lightbulb me-2 text-primary"></i>
                Quick Tips
              </h5>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item d-flex">
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <div>
                    <strong>Organize your items</strong>
                    <p className="mb-0 text-muted">Add detailed descriptions to easily find them later</p>
                  </div>
                </li>
                <li className="list-group-item d-flex">
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <div>
                    <strong>Update your profile</strong>
                    <p className="mb-0 text-muted">Keep your account information up to date</p>
                  </div>
                </li>
                <li className="list-group-item d-flex">
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <div>
                    <strong>Secure your account</strong>
                    <p className="mb-0 text-muted">Change your password regularly for better security</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-graph-up me-2 text-primary"></i>
                Activity Overview
              </h5>
              <div className="d-flex justify-content-center align-items-center h-75">
                <div className="text-center">
                  <i className="bi bi-bar-chart-line display-1 text-muted"></i>
                  <p className="mt-3 text-muted">Activity tracking coming soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
