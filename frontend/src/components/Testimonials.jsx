import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  // The review data dynamically pulls from your JSON based on language
  const reviews = [
    {
      id: 1,
      name: t('testimonials.r1.name'),
      package: t('testimonials.r1.package'),
      text: t('testimonials.r1.text'),
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: t('testimonials.r2.name'),
      package: t('testimonials.r2.package'),
      text: t('testimonials.r2.text'),
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: t('testimonials.r3.name'),
      package: t('testimonials.r3.package'),
      text: t('testimonials.r3.text'),
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveIndex((current) => (current === reviews.length - 1 ? 0 : current + 1));
    }, 4000); // Set to 4 seconds, as 1000 is extremely fast for reading

    return () => clearInterval(slideTimer);
  }, [reviews.length]);

  return (
    <>
      <style>
        {`
          .carousel-dots { display: none; }
          @media (max-width: 768px) {
            .testimonials-section { padding: 25px 15px !important; }
            .testimonials-header h2 { font-size: 1.5rem !important; margin-bottom: 5px !important; }
            .testimonials-header p { font-size: 0.85rem !important; margin-bottom: 15px !important; }
            .testimonials-grid { display: block !important; position: relative; width: 100%; overflow: hidden; }
            .review-card { display: none; padding: 15px !important; margin: 0 auto !important; box-sizing: border-box; }
            .review-card.active-mobile { display: flex !important; flex-direction: column; animation: fadeIn 0.4s ease-in-out; }
            .review-text { font-size: 0.85rem !important; line-height: 1.4 !important; margin: 10px 0 !important; }
            .quote-icon { font-size: 1.2rem !important; }
            .stars { font-size: 0.8rem !important; }
            .author-img { width: 40px !important; height: 40px !important; }
            .author-details h4 { font-size: 0.9rem !important; }
            .author-details span { font-size: 0.75rem !important; }
            .carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 15px; }
            .dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; border: none; padding: 0; cursor: pointer; transition: all 0.3s ease; }
            .dot.active { background: #064e3b; width: 18px; border-radius: 4px; }
          }
          @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        `}
      </style>

      <section className="testimonials-section">
        <div className="testimonials-container">
          
          <div className="testimonials-header">
            <h2>{t('testimonials.title')}</h2>
            <p>{t('testimonials.subtitle')}</p>
          </div>

          <div className="testimonials-grid">
            {reviews.map((review, index) => (
              <div className={`review-card ${index === activeIndex ? 'active-mobile' : ''}`} key={review.id}>
                <FaQuoteLeft className="quote-icon" />
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <img src={review.image} alt={review.name} className="author-img" />
                  <div className="author-details">
                    <h4>{review.name}</h4>
                    <span>{review.package}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-dots">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
        </div>
      </section>
    </>
  );
};

export default Testimonials;