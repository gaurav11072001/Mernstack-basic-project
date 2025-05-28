import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer mt-auto py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">© {year} MERN Stack Project</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">
              Built with <i className="bi bi-heart-fill text-danger"></i> using MongoDB, Express, React & Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
