import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaSearchLocation, FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation(); 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <style>
        {`
          .mobile-menu-btn {
            display: none;
          }

          @media (max-width: 768px) {
            .main-navbar {
              display: flex !important;
              justify-content: space-between;
              align-items: center;
              padding: 10px 15px !important;
            }
            
            .navbar-brand {
              display: flex;
              align-items: center;
            }

            /* HIDE BRAND TEXT ON MOBILE TO SAVE SPACE */
            .brand-text {
              display: none !important; 
            }

            .navbar-actions {
              display: flex;
              align-items: center;
              gap: 8px !important;
              margin-left: auto;
              margin-right: 15px;
            }

            .mobile-menu-btn {
              display: block !important;
              background: none;
              border: none;
              font-size: 1.5rem;
              color: #064e3b;
              cursor: pointer;
              padding: 5px 0 0 0;
            }

            .nav-content-wrapper {
              width: 100%;
              display: ${isMobileMenuOpen ? 'flex' : 'none'} !important;
              flex-direction: column;
              margin-top: 15px;
              gap: 15px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              order: 4;
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

          @media (max-width: 380px) {
            .track-text-hide {
              display: none;
            }
          }
        `}
      </style>

      <nav className="main-navbar" style={{ flexWrap: 'wrap' }}>
        <div className="navbar-brand">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Pothik Bondhu Logo" className="logo-img" />
            <span className="brand-text">{t('navbar.brand')}</span>
          </Link>
        </div>

        <div className="nav-content-wrapper">
          <ul className="navbar-links">
            <li className="dropdown">
              <Link to="/packages?type=hajj" className="dropbtn">
                {t('navbar.hajj')} <FaChevronDown className="dropdown-icon" />
              </Link>
              <div className="dropdown-content">
                <Link to="/hajj/pre-registration" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.hajjPreReg')}</Link>
                <Link to="/visa-requirements?type=hajj" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.hajjVisa')}</Link>
                <Link to="/packages?type=hajj" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.hajjPackages')}</Link>
              </div>
            </li>

            <li className="dropdown">
              <Link to="/packages?type=umrah" className="dropbtn">
                {t('navbar.umrah')} <FaChevronDown className="dropdown-icon" />
              </Link>
              <div className="dropdown-content">
                <Link to="/visa-requirements?type=umrah" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.umrahVisa')}</Link>
                <Link to="/packages?type=umrah" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.umrahPackages')}</Link>
              </div>
            </li>

            <li className="dropdown">
              <Link to="/about" className="dropbtn">
                {t('navbar.about')} <FaChevronDown className="dropdown-icon" />
              </Link>
              <div className="dropdown-content">
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.aboutUs')}</Link>
                <Link to="/agents" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.agents')}</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.contacts')}</Link>
              </div>
            </li>
          </ul>
        </div>

        <div className="navbar-actions">
          <button 
            onClick={toggleLanguage}
            style={{ 
              background: 'transparent',
              color: '#064e3b',
              border: '1px solid #064e3b',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {i18n.language === 'en' ? 'বাংলা' : 'EN'}
          </button>

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
            <span>{t('navbar.track')} <span className="track-text-hide">{t('navbar.status')}</span></span>
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