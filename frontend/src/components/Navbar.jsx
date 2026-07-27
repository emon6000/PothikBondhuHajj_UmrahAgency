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
      <style>
        {`
          .mobile-menu-btn {
            display: none;
          }

          @media (max-width: 768px) {
            /* Switch to CSS Grid to strictly prevent the hamburger from wrapping */
            .main-navbar {
              display: grid !important;
              grid-template-columns: 1fr auto auto;
              align-items: center;
              padding: 10px 15px !important;
              gap: 10px;
            }
            
            .navbar-brand {
              grid-column: 1;
              display: flex;
              align-items: center;
              overflow: hidden; /* Prevent long text from blowing out the layout */
            }

            .brand-text {
              font-size: 1.1rem !important; /* Slightly smaller for mobile */
              white-space: nowrap;
            }

            .navbar-actions {
              grid-column: 2;
              margin: 0 !important; /* Clear any conflicting margins */
            }

            .mobile-menu-btn {
              grid-column: 3;
              display: block !important;
              background: none;
              border: none;
              font-size: 1.5rem;
              color: #064e3b;
              cursor: pointer;
              padding: 5px 0 0 0;
            }

            .nav-content-wrapper {
              grid-column: 1 / -1; /* Span the entire bottom row */
              width: 100%;
              display: ${isMobileMenuOpen ? 'flex' : 'none'} !important;
              flex-direction: column;
              margin-top: 15px;
              gap: 15px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }

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

            .login-btn {
              padding: 6px 12px !important;
              font-size: 0.85rem !important;
            }
          }

          /* Hide "Status" on very tiny screens like iPhone SE */
          @media (max-width: 380px) {
            .track-text-hide {
              display: none;
            }
            .brand-text {
              font-size: 1rem !important;
            }
          }
        `}
      </style>

      <nav className="main-navbar">
        <div className="navbar-brand">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Pothik Bondhu Logo" className="logo-img" />
            <span className="brand-text">Pothik Bondhu</span>
          </Link>
        </div>

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

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </nav>
    </>
  );
};

export default Navbar;