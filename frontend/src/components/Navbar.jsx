import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  // 1. Check if the user is currently logged in
  const userStr = localStorage.getItem('pothik_user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Handle the logout process safely
  const handleLogout = () => {
    localStorage.removeItem('pothik_token');
    localStorage.removeItem('pothik_user');
    navigate('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Pothik Bondhu Logo" className="logo-img" />
          <span className="brand-text">Pothik Bondhu</span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li className="dropdown">
          <Link to="/packages?type=hajj" className="dropbtn">
            Hajj <FaChevronDown className="dropdown-icon" />
          </Link>
          <div className="dropdown-content">
            <Link to="/hajj/pre-registration">Pre-registration</Link>
            <Link to="/visa-requirements?type=hajj">Visa Requirements</Link>
            <Link to="/packages?type=hajj">Hajj Packages</Link>
          </div>
        </li>

        <li className="dropdown">
          <Link to="/packages?type=umrah" className="dropbtn">
            Umrah <FaChevronDown className="dropdown-icon" />
          </Link>
          <div className="dropdown-content">
            <Link to="/visa-requirements?type=umrah">Visa Requirements</Link>
            <Link to="/packages?type=umrah">Umrah Packages</Link>
          </div>
        </li>

        <li className="dropdown">
          <Link to="/about" className="dropbtn">
            About <FaChevronDown className="dropdown-icon" />
          </Link>
          <div className="dropdown-content">
            <Link to="/about">About Us</Link>
            <Link to="/agents">Agents</Link>
            <Link to="/contact">Contacts</Link>
          </div>
        </li>
      </ul>

      <div className="navbar-actions">
        {/* 3. Dynamically render buttons based on login status */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Direct them to the correct dashboard based on their role */}
            <Link 
              to={user.role === 'ADMIN' ? '/admin-dashboard' : '/client-dashboard'} 
              className="login-btn"
              style={{ background: 'transparent', color: '#064e3b', border: '2px solid #064e3b' }}
            >
              Dashboard
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="login-btn"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;