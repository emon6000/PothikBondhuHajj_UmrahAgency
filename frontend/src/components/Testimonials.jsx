import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Abdur Rahman",
      package: "Hajj 2025 Group",
      text: "Alhamdulillah, my Hajj journey with Pothik Bondhu was incredibly smooth. Their Moallem (guide) was very knowledgeable, and the hotel in Makkah was exactly as close as they promised. Highly recommended.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Fatima Begum",
      package: "Premium Umrah (Ramadan)",
      text: "I was worried about traveling with my elderly mother, but the agency handled everything. From the wheelchair assistance at Jeddah airport to the hotel arrangements, their service was outstanding.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Tariqul Islam",
      package: "Standard Umrah Package",
      text: "The visa processing was incredibly fast! I submitted my physical passport to the Comilla branch, and within days I got my e-Visa on the dashboard. Very transparent pricing, no hidden costs.",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  // Auto-play the carousel every 4 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveIndex((current) => (current === reviews.length - 1 ? 0 : current + 1));
    }, 1000); 

    // Cleanup the timer when the component unmounts
    return () => clearInterval(slideTimer);
  }, [reviews.length]);

  return (
    <>
      <style>
        {`
          /* Hide dot indicators on desktop by default */
          .carousel-dots {
            display: none;
          }

          @media (max-width: 768px) {
            .testimonials-section {
              padding: 25px 15px !important;
            }

            .testimonials-header h2 {
              font-size: 1.5rem !important;
              margin-bottom: 5px !important;
            }

            .testimonials-header p {
              font-size: 0.85rem !important;
              margin-bottom: 15px !important;
            }

            .testimonials-grid {
              display: block !important;
              position: relative;
              width: 100%;
              overflow: hidden;
            }

            .review-card {
              display: none;
              padding: 15px !important;
              margin: 0 auto !important;
              box-sizing: border-box;
            }

            .review-card.active-mobile {
              display: flex !important;
              flex-direction: column;
              animation: fadeIn 0.4s ease-in-out;
            }

            .review-text {
              font-size: 0.85rem !important;
              line-height: 1.4 !important;
              margin: 10px 0 !important;
            }

            .quote-icon {
              font-size: 1.2rem !important;
            }

            .stars {
              font-size: 0.8rem !important;
            }

            .author-img {
              width: 40px !important;
              height: 40px !important;
            }

            .author-details h4 {
              font-size: 0.9rem !important;
            }

            .author-details span {
              font-size: 0.75rem !important;
            }

            /* Carousel Navigation Dots */
            .carousel-dots {
              display: flex;
              justify-content: center;
              gap: 8px;
              margin-top: 15px;
            }

            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #cbd5e1;
              border: none;
              padding: 0;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .dot.active {
              background: #064e3b;
              width: 18px; 
              border-radius: 4px;
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>

      <section className="testimonials-section">
        <div className="testimonials-container">
          
          <div className="testimonials-header">
            <h2>Voices of Our Pilgrims</h2>
            <p>Read what our respected clients have to say about their journey with us.</p>
          </div>

          <div className="testimonials-grid">
            {reviews.map((review, index) => (
              <div 
                className={`review-card ${index === activeIndex ? 'active-mobile' : ''}`} 
                key={review.id}
              >
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

          {/* Pagination Indicators */}
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