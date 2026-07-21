import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaSearchLocation, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* INTERNAL CSS FOR MOBILE RESPONSIVENESS */}
      <style>
        {`
          /* Hide the hamburger button on Desktop */
          .mobile-menu-btn {
            display: none;
          }

          @media (max-width: 768px) {
            .main-navbar {
              display: flex;
              flex-wrap: wrap; /* Allows the dropdown links to slide underneath */
              align-items: center;
              padding: 10px 15px;
            }
            
            /* 1. Keep Brand on the left */
            .navbar-brand {
              order: 1; 
            }

            /* 2. Push Track button to the right, just before the hamburger */
            .navbar-actions {
              order: 2;
              margin-left: auto; /* Pushes it all the way right */
              margin-right: 15px; /* Gap between button and hamburger */
            }

            /* 3. Hamburger menu stays on the far right */
            .mobile-menu-btn {
              display: block;
              order: 3;
              background: none;
              border: none;
              font-size: 1.5rem;
              color: #064e3b;
              cursor: pointer;
              padding-top: 5px;
            }

            /* 4. The links container takes full width on the bottom row when open */
            .nav-content-wrapper {
              order: 4;
              width: 100%;
              display: ${isMobileMenuOpen ? 'flex' : 'none'};
              flex-direction: column;
              margin-top: 15px;
              gap: 15px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }

            /* Stack links vertically */
            .navbar-links {
              display: flex;
              flex-direction: column;
              width: 100%;
              padding: 0;
              margin: 0;
              gap: 10px;
            }

            .dropdown {
              width: 100%;
            }
            
            .dropbtn {
              display: flex;
              justify-content: space-between;
              width: 100%;
              padding: 10px 0;
            }
            
            .dropdown-content {
              position: static;
              box-shadow: none;
              padding-left: 20px;
              display: none;
              flex-direction: column;
            }
            
            .dropdown:hover .dropdown-content {
              display: flex;
            }

            /* Make the Track button slightly smaller on mobile to guarantee it fits */
            .login-btn {
              padding: 6px 12px !important;
              font-size: 0.85rem !important;
            }
          }

          /* On tiny screens (like iPhone SE), hide the word "Status" so it doesn't squish the logo */
          @media (max-width: 400px) {
            .track-text-hide {
              display: none;
            }
          }
        `}
      </style>

      <nav className="main-navbar">
        {/* 1. Navbar Brand */}
        <div className="navbar-brand">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Pothik Bondhu Logo" className="logo-img" />
            <span className="brand-text">Pothik Bondhu</span>
          </Link>
        </div>

        {/* 4. Link Wrapper (This drops to the bottom on mobile) */}
        <div className="nav-content-wrapper">
          <ul className="navbar-links">
            <li className="dropdown">
              <Link to="/packages?type=hajj" className="dropbtn">
                Hajj <FaChevronDown className="dropdown-icon" />
              </Link>
              <div className="dropdown-content">
                <Link to="/hajj/pre-registration" onClick={() => setIsMobileMenuOpen(false)}>Pre-registration</Link>
                <Link to="/visa-requirements?type=hajj" onClick={() => setIsMobileMenuOpen(false)}>Visa Requirements</Link>
                <Link to="/packages?type=hajj" onClick={() => setIsMobileMenuOpen(false)}>Hajj Packages</Link>
              </div>
            </li>

            <li className="dropdown">
              <Link to="/packages?type=umrah" className="dropbtn">
                Umrah <FaChevronDown className="dropdown-icon" />
              </Link>
              <div className="dropdown-content">
                <Link to="/visa-requirements?type=umrah" onClick={() => setIsMobileMenuOpen(false)}>Visa Requirements</Link>
                <Link to="/packages?type=umrah" onClick={() => setIsMobileMenuOpen(false)}>Umrah Packages</Link>
              </div>
            </li>

            <li className="dropdown">
              <Link to="/about" className="dropbtn">
                About <FaChevronDown className="dropdown-icon" />
              </Link>
              <div className="dropdown-content">
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <Link to="/agents" onClick={() => setIsMobileMenuOpen(false)}>Agents</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contacts</Link>
              </div>
            </li>
          </ul>
        </div>

        {/* 2. Track Status Button (Visible at all times) */}
        <div className="navbar-actions">
          <Link 
            to="/track" 
            className="login-btn" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#064e3b', 
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            <FaSearchLocation /> 
            <span>Track <span className="track-text-hide">Status</span></span>
          </Link>
        </div>

        {/* 3. Hamburger Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </nav>
    </>
  );
};

export default Navbar;