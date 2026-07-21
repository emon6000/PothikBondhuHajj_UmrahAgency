import React from 'react';

const AboutPreview = () => {
  return (
    <>
      {/* INTERNAL CSS FOR COMPACT MOBILE RESPONSIVENESS */}
      <style>
        {`
          /* Make the YouTube iframe perfectly responsive on all devices */
          .about-video-wrapper iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          @media (max-width: 768px) {
            .about-preview-section {
              padding: 20px 15px !important; /* Heavily reduce top/bottom padding */
            }
            
            .about-preview-container {
              display: flex;
              flex-direction: column;
              gap: 15px !important; /* Tighten the gap between text and video */
            }

            .about-text-content h2 {
              font-size: 1.5rem !important;
              margin-bottom: 8px !important;
              line-height: 1.2 !important;
            }

            .primary-text {
              font-size: 0.9rem !important;
              line-height: 1.4 !important;
              margin-bottom: 0 !important; /* Remove bottom margin to save space */
            }

            /* Completely hide the second paragraph on mobile to minimize height */
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
          {/* Left Side: The Message */}
          <div className="about-text-content">
            <span className="subtitle">WHO WE ARE</span>
            <h2>Assalamu Alaikum from Pothik Bondhu</h2>

            <p className="primary-text">
              For years, we have guided pilgrims across continents with sincerity, Islamic
              scholarship, and logistical precision. Our dedicated team works tirelessly to deliver
              Hajj and Umrah journeys that feel both spiritually rich and seamlessly organized.
            </p>

            <p className="secondary-text">
              Founded with a vision to help the Bangladeshi community experience the holy lands with
              dignity, comfort, and peace of mind. Whether you are interacting with our digital
              portal or visiting our physical branches, our focus on professional, faith-centered
              service defines every itinerary we curate.
            </p>
          </div>

          <div className="about-video-wrapper">
            {/* Removed hardcoded width/height - CSS handles it now */}
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
