// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa'; // 1. Import the down arrow icon
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="main-navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Pothik Bondhu Logo" className="logo-img" />
          <span className="brand-text">Pothik Bondhu</span>
        </Link>
      </div>

      <ul className="navbar-links">
        
        {/* Hajj Dropdown */}
        <li className="dropdown">
          {/* 2. Add the icon inside the dropbtn span */}
          <span className="dropbtn">Hajj <FaChevronDown className="dropdown-icon" /></span>
          <div className="dropdown-content">
            <Link to="/hajj/pre-registration">Pre-registration</Link>
            <Link to="/hajj/visa-requirements">Visa Requirements</Link>
            <Link to="/packages?type=hajj">Packages</Link>
          </div>
        </li>

        {/* Umrah Dropdown */}
        <li className="dropdown">
          <span className="dropbtn">Umrah <FaChevronDown className="dropdown-icon" /></span>
          <div className="dropdown-content">
            <Link to="/umrah/visa-requirements">Visa Requirements</Link>
            <Link to="/packages?type=umrah">Packages</Link>
          </div>
        </li>

        {/* About Dropdown */}
        <li className="dropdown">
          <span className="dropbtn">About <FaChevronDown className="dropdown-icon" /></span>
          <div className="dropdown-content">
            <Link to="/about-us">About Us</Link>
            <Link to="/agents">Agents</Link>
            <Link to="/contacts">Contacts</Link>
          </div>
        </li>

      </ul>

      <div className="navbar-actions">
        <Link to="/login" className="login-btn">Log In</Link>
      </div>
    </nav>
  );
};

export default Navbar;