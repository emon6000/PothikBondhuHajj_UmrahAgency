import React from 'react';
import { useNavigate } from 'react-router-dom';

import heroBg from '../assets/hero-background.jpg';
import trustedFaces from '../assets/trusted-faces.png';
import Branches from '../assets/Branches.png';
import { Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    
    <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay">
        <div className="hero-content-wrapper">
          <div className="hero-container">
            <div className="hero-left">
              <h1 className="hero-title">Best Hajj and Umrah Agency in Bangladesh</h1>
              <p className="hero-description">
                Embracing the journey of a lifetime with Pothik Bondhu. We provide holistic support
                and expert guidance to ensure your pilgrimage is peaceful and spiritual.
              </p>

              <div className="trusted-faces-container">
                <img src={trustedFaces} alt="Our Experts" className="trusted-faces-img" />
                <span className="trusted-text">Guided by trusted scholars & experts</span>
              </div>

              <div className="hero-btns">
                <button className="book-now-btn" onClick={() => navigate('/packages')}>
                  Book Now
                </button>
                <div className="play-video">
                  <div className="play-icon">▶</div>
                  <span>Experience More</span>
                </div>
              </div>
            </div>

            {/* Right Side: Map */}
            <div className="hero-right">
              <div className="map-wrapper">
                <Link to="/contact">
                  <img src={Branches} alt="Branches Images" className="BranchImage" />
                <div className="map-hint">Tap to Contact Us</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Layer: Social Proof Stats */}
          <div className="stats-container">
            <div className="stat-card">
              <h2>700+</h2>
              <p>HAJJ TRAVELER</p>
            </div>
            <div className="stat-card">
              <h2>2.2K+</h2>
              <p>UMRAH TRAVELER</p>
            </div>
            <div className="stat-card">
              <h2>99%</h2>
              <p>SATISFIED PILGRIMS</p>
            </div>
            <div className="stat-card">
              <h2>7+</h2>
              <p>YEARS EXPERIENCE</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
