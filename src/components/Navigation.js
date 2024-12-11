import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="navigation-bar">
      <button 
        onClick={() => navigate(-1)}
        className="nav-button"
      >
        ← Back
      </button>
      <button 
        onClick={() => navigate('/')}
        className="nav-button"
      >
        Home
      </button>
    </div>
  );
}

export default Navigation;
