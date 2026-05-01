// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Column 1: Brand & Contact Info */}
        <div className="footer-col brand-col">
          <div className="footer-logo-wrapper">
            <img src={logo} alt="Pothik Bondhu" className="footer-logo" />
            <div className="footer-brand-text">Pothik Bondhu</div>
          </div>

          <div className="contact-line">
            <FaMapMarkerAlt className="icon" />
            <span>
              32 Purana Paltan, Sultan Ahmed Plaza
              <br />
              11th Floor, Suite-1202, Dhaka-1000
            </span>
          </div>
          <div className="contact-line">
            <FaPhoneAlt className="icon" />
            <span>+8801733391826</span>
          </div>
          <div className="contact-line">
            <FaEnvelope className="icon" />
            <span>info@pothikbondhu.com</span>
          </div>

          {/* Circular Social Icons */}
          <div className="social-circles">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaPinterestP />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Column 2: Services */}
        <div className="footer-col links-col">
          <h3 className="footer-heading">SERVICES</h3>
          <ul>
            <li>
              <Link to="/packages?type=umrah">Umrah Package</Link>
            </li>
            <li>
              <Link to="/packages?type=hajj">Hajj Package</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/training">Hajj Training</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Important Links */}
        <div className="footer-col links-col">
          <h3 className="footer-heading">IMPORTANT LINKS</h3>
          <ul>
            <li>
              <a href="https://www.hajj.gov.bd/" target="_blank" rel="noopener noreferrer">
                Bangladesh Hajj Portal
              </a>
            </li>
            <li>
              <a href="http://caab.gov.bd/" target="_blank" rel="noopener noreferrer">
                Civil Aviation Authority
              </a>
            </li>
            <li>
              <a href="https://www.atab.org.bd/" target="_blank" rel="noopener noreferrer">
                ATAB
              </a>
            </li>
            <li>
              <a href="https://haabbd.com/" target="_blank" rel="noopener noreferrer">
                HAAB
              </a>
            </li>
            <li>
              <a href="https://haj.gov.sa/en" target="_blank" rel="noopener noreferrer">
                Ministry of Hajj, KSA
              </a>
            </li>
            <li>
              <a href="https://hajj.nusuk.sa/" target="_blank" rel="noopener noreferrer">
                NUSUK
              </a>
            </li>
            <li>
              <a
                href="https://visa.mofa.gov.sa/visaservices/searchvisa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hajj & Umrah Visa Check
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Offices Cards */}
        <div className="footer-col offices-col">
          <h3 className="footer-heading">OUR OFFICES</h3>

          {/* Card 1 */}
          <div className="office-card">
            <div className="office-card-header">
              {/* Using an emoji for the flag just like the design's icon */}
              <span className="flag-icon">🇸🇦</span>
              <h4>Saudi Arabia</h4>
            </div>
            <p>
              Al Maarefa Road, North Al
              <br />
              Aziziyah, Makkah
            </p>
            <div className="office-phone">
              <FaPhoneAlt className="small-icon" /> <span>+966 569 907 242</span>
            </div>
            <div className="office-phone">
              <FaPhoneAlt className="small-icon" /> <span>+880 1733 391 833</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="office-card">
            <div className="office-card-header">
              <span className="flag-icon">🇧🇩</span>
              <h4>Comilla Branch</h4>
            </div>
            <p>
              University Road, Kotbari
              <br />
              Comilla, Bangladesh
            </p>
            <div className="office-phone">
              <FaPhoneAlt className="small-icon" /> <span>+880 1234 567 890</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>© 2026 Pothik Bondhu. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
