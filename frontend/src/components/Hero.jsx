import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import heroBg from '../assets/hero-background.jpg';
import trustedFaces from '../assets/trusted-faces.png';
import Branches from '../assets/Branches.png';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .hero-container {
              display: flex;
              flex-direction: column;
              gap: 15px !important; 
              overflow: hidden; 
            }
            .hero-title {
              font-size: 1.7rem !important; 
              line-height: 1.3 !important;
              margin-bottom: 10px !important;
            }
            .hero-description {
              font-size: 0.9rem !important;
              margin-bottom: 15px !important;
            }
            .trusted-faces-container {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 10px !important;
              background: rgba(255, 255, 255, 0.15) !important;
              padding: 8px 15px !important;
              border-radius: 50px !important;
              margin: 10px auto 20px auto !important;
              width: fit-content !important;
              max-width: 95%;
            }
            .trusted-faces-img {
              height: 40px !important;
              width: auto !important;
            }
            .trusted-text {
              font-size: 0.85rem !important;
              line-height: 1.2 !important;
              text-align: left;
            }
            .hero-btns {
              display: flex !important;
              justify-content: center !important;
              gap: 15px !important;
              margin-bottom: 20px !important;
            }
            .book-now-btn, .play-video {
              font-size: 0.9rem !important;
              padding: 10px 20px !important;
            }
            .hero-right {
              width: 100%;
              box-sizing: border-box;
              padding: 0 10px;
            }
            .map-wrapper {
              width: 100%;
              display: flex;
              justify-content: center;
              position: relative;
            }
            .map-wrapper a {
              display: inline-block;
              width: 100%;
              position: relative;
            }
            .BranchImage {
              width: 100%;
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              object-fit: contain;
            }
            .map-hint {
              position: absolute;
              bottom: 10px;
              right: 10px;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 5px 10px;
              border-radius: 5px;
              font-size: 0.75rem;
            }
            .stats-container {
              display: flex;
              flex-wrap: wrap !important;
              justify-content: center;
              gap: 10px !important;
              width: 100%;
              box-sizing: border-box;
              padding: 15px 10px !important;
              margin-top: 20px !important;
            }
            .stat-card {
              flex: 1 1 45% !important; 
              min-width: 130px; 
              padding: 10px 5px !important;
              box-sizing: border-box;
            }
            .stat-card h2 {
              font-size: 1.4rem !important;
              margin-bottom: 5px !important;
            }
            .stat-card p {
              font-size: 0.65rem !important;
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
                <h1 className="hero-title">{t('hero.title')}</h1>
                <p className="hero-description">{t('hero.subtitle')}</p>

                <div className="trusted-faces-container">
                  <img src={trustedFaces} alt="Our Experts" className="trusted-faces-img" />
                  <span className="trusted-text">{t('hero.guidedBy')}</span>
                </div>

                <div className="hero-btns">
                  <button className="book-now-btn" onClick={() => navigate('/packages')}>
                    {t('hero.bookNow')}
                  </button>
                  <a
                    href="https://youtu.be/8XLKP3x1ruY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="play-video"
                    style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <div className="play-icon">▶</div>
                    <span>{t('hero.experienceMore')}</span>
                  </a>
                </div>
              </div>

              <div className="hero-right">
                <div className="map-wrapper">
                  <Link to="/contact">
                    <img src={Branches} alt="Branches Images" className="BranchImage" />
                    <div className="map-hint">{t('hero.tapToContact')}</div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <h2>700+</h2>
                <p>{t('hero.stats.hajjTraveler')}</p>
              </div>
              <div className="stat-card">
                <h2>2.2K+</h2>
                <p>{t('hero.stats.umrahTraveler')}</p>
              </div>
              <div className="stat-card">
                <h2>99%</h2>
                <p>{t('hero.stats.satisfied')}</p>
              </div>
              <div className="stat-card">
                <h2>7+</h2>
                <p>{t('hero.stats.experience')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;