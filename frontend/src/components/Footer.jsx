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
    <>
      {/* INTERNAL CSS FOR COMPACT MOBILE FOOTER */}
      <style>
        {`
          @media (max-width: 768px) {
            /* 1. Reduce overall padding to save space */
            .main-footer {
              padding: 20px 15px 10px !important; 
            }

            /* 2. Convert the main container to a 2-column grid */
            .footer-container {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 15px 10px !important;
            }

            /* 3. Brand takes full width and centers */
            .brand-col {
              grid-column: 1 / -1 !important;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              border-bottom: 1px solid rgba(255,255,255,0.1);
              padding-bottom: 15px;
            }
            
            .footer-logo {
              width: 50px !important; /* Smaller logo */
            }

            .footer-brand-text {
              font-size: 1.2rem !important;
            }

            .contact-line {
              font-size: 0.85rem !important;
              margin-bottom: 5px !important;
              justify-content: center !important;
            }

            /* Tighter social icons */
            .social-circles {
              margin-top: 10px !important;
              justify-content: center !important;
              gap: 8px !important;
            }
            .social-circles a {
              width: 30px !important;
              height: 30px !important;
              font-size: 0.8rem !important;
            }

            /* 4. Link sections automatically take 1 column each (side-by-side) */
            .footer-heading {
              font-size: 0.9rem !important;
              margin-bottom: 10px !important;
            }

            .links-col ul li {
              margin-bottom: 6px !important;
            }

            .links-col a {
              font-size: 0.75rem !important;
            }

            /* 5. Offices take full width, but their internal cards go side-by-side */
            .offices-col {
              grid-column: 1 / -1 !important;
              margin-top: 5px !important;
            }

            .mobile-offices-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }

            .office-card {
              padding: 10px !important;
              margin-bottom: 0 !important;
            }

            .office-card h4 {
              font-size: 0.8rem !important;
            }

            .office-card p {
              font-size: 0.7rem !important;
              margin: 5px 0 !important;
              line-height: 1.3 !important;
            }

            .office-phone {
              font-size: 0.7rem !important;
              margin-top: 3px !important;
            }

            .footer-bottom {
              margin-top: 15px !important;
              padding-top: 10px !important;
            }

            .footer-bottom p {
              font-size: 0.75rem !important;
            }
          }

          /* For extremely small phones, stack the offices so they don't break */
          @media (max-width: 380px) {
            .mobile-offices-grid {
              grid-template-columns: 1fr; 
            }
          }
        `}
      </style>

      <footer className="main-footer">
        <div className="footer-container">
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

          <div className="footer-col offices-col">
            <h3 className="footer-heading">OUR OFFICES</h3>

            {/* Wrapper added to enable side-by-side grid on mobile */}
            <div className="mobile-offices-grid">
              <div className="office-card">
                <div className="office-card-header">
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
        </div>

        <div className="footer-bottom">
          <p>© 2026 Pothik Bondhu. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;