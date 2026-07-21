import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import heroBg from '../assets/hero-background.jpg';
import trustedFaces from '../assets/trusted-faces.png';
import Branches from '../assets/Branches.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* INTERNAL CSS FOR MOBILE RESPONSIVENESS ONLY */}
      <style>
        {`
          @media (max-width: 768px) {
            /* 1. Reduce overall vertical space */
            .hero-container {
              display: flex;
              flex-direction: column;
              gap: 20px !important; /* Pulls the map image closer to the text */
            }

            .hero-title {
              font-size: 1.8rem !important; /* Prevent massive text on mobile */
              line-height: 1.2 !important;
              margin-bottom: 10px !important;
            }

            .hero-description {
              font-size: 0.9rem !important;
              margin-bottom: 15px !important;
            }

            /* Make sure the map image scales down cleanly */
            .map-wrapper {
              width: 100%;
              text-align: center;
            }
            .BranchImage {
              max-width: 100%;
              height: auto;
              border-radius: 8px; /* Optional: smooths the edges */
            }

            /* 2. Fix the Stats Overflow (Convert row to 2x2 grid) */
            .stats-container {
              display: flex;
              flex-wrap: wrap !important; /* This stops the horizontal overflow */
              justify-content: center;
              gap: 10px !important;
              width: 100%;
              box-sizing: border-box;
              padding: 15px 10px !important;
              margin-top: 20px !important;
            }

            .stat-card {
              flex: 1 1 45% !important; /* Forces 2 items per row */
              min-width: 130px; /* Prevents them from getting too squished */
              padding: 10px 5px !important;
              box-sizing: border-box;
            }

            /* Scale down stat text so it fits in the new 2x2 grid */
            .stat-card h2 {
              font-size: 1.6rem !important;
              margin-bottom: 5px !important;
            }

            .stat-card p {
              font-size: 0.75rem !important;
              word-wrap: break-word;
            }
          }
        `}
      </style>

      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <div className="hero-container">
              <div className="hero-left">
                <h1 className="hero-title">Best Hajj and Umrah Agency in Bangladesh</h1>
                <p className="hero-description">
                  Embracing the journey of a lifetime with Pothik Bondhu. We provide holistic
                  support and expert guidance to ensure your pilgrimage is peaceful and spiritual.
                </p>

                <div className="trusted-faces-container">
                  <img src={trustedFaces} alt="Our Experts" className="trusted-faces-img" />
                  <span className="trusted-text">Guided by trusted scholars & experts</span>
                </div>

                <div className="hero-btns">
                  <button className="book-now-btn" onClick={() => navigate('/packages')}>
                    Book Now
                  </button>
                  <a
                    href="https://youtu.be/8XLKP3x1ruY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="play-video"
                    style={{
                      textDecoration: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div className="play-icon">▶</div>
                    <span>Experience More</span>
                  </a>
                </div>
              </div>

              <div className="hero-right">
                <div className="map-wrapper">
                  <Link to="/contact">
                    <img src={Branches} alt="Branches Images" className="BranchImage" />
                    <div className="map-hint">Tap to Contact Us</div>
                  </Link>
                </div>
              </div>
            </div>

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
    </>
  );
};

export default Hero;
