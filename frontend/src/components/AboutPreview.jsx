import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPreview = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>
        {`
          .about-video-wrapper iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          @media (max-width: 768px) {
            .about-preview-section {
              padding: 20px 15px !important; 
            }
            .about-preview-container {
              display: flex;
              flex-direction: column;
              gap: 15px !important; 
            }
            .about-text-content h2 {
              font-size: 1.5rem !important;
              margin-bottom: 8px !important;
              line-height: 1.2 !important;
            }
            .primary-text {
              font-size: 0.9rem !important;
              line-height: 1.4 !important;
              margin-bottom: 0 !important; 
            }
            .secondary-text {
              display: none !important; 
            }
            .about-video-wrapper {
              width: 100%;
              margin-top: 5px !important;
            }
          }
        `}
      </style>

      <section className="about-preview-section">
        <div className="about-preview-container">
          <div className="about-text-content">
            <span className="subtitle">{t('aboutPreview.subtitle')}</span>
            <h2>{t('aboutPreview.title')}</h2>

            <p className="primary-text">{t('aboutPreview.primaryText')}</p>
            <p className="secondary-text">{t('aboutPreview.secondaryText')}</p>
          </div>

          <div className="about-video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/8XLKP3x1ruY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPreview;