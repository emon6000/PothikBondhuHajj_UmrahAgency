import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const TopHeader = () => {
  return (
    <div className="top-header">
      {/* Left Side: Contact Info */}
      <div className="contact-info">
        <div className="contact-item">
          <FaEnvelope className="icon" />
          <span>info@pothikbondhu.com</span>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="icon" />
          <span>+880 1234 567 890</span>
        </div>
      </div>

      {/* Right Side: Social Media Links */}
      <div className="social-links">
        <p>Connect Us :</p>
        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
        <a href="#" aria-label="Twitter"><FaTwitter /></a>
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
      </div>
    </div>
  );
};

export default TopHeader;