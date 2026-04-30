// src/components/Testimonials.jsx
import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  // Authentic-sounding dummy reviews
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

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        
        <div className="testimonials-header">
          <h2>Voices of Our Pilgrims</h2>
          <p>Read what our respected clients have to say about their journey with us.</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              {/* Quote Icon Background */}
              <FaQuoteLeft className="quote-icon" />
              
              {/* Star Rating */}
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              
              {/* Review Text */}
              <p className="review-text">"{review.text}"</p>
              
              {/* User Info */}
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
        
      </div>
    </section>
  );
};

export default Testimonials;