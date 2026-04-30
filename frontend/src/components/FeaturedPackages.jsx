// src/components/FeaturedPackages.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedPackages = () => {
  // Dummy data for our packages
  const packages = [
    {
      id: 1,
      title: "Hajj Pre-Registration 2026-2027 From Bangladesh",
      price: "BDT 30,000 /Per Person",
      duration: "Registration",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      title: "40 Days Standard Hajj Package From Bangladesh",
      price: "Starts from BDT 6,00,000 /Per Person",
      duration: "40 Days",
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      title: "30 Days Non-Shifting Hajj Package",
      price: "Starts from BDT 6,50,000 /Per Person",
      duration: "30 Days",
      image: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 4,
      title: "14 Days Premium VIP Umrah Package",
      price: "Starts from BDT 2,10,000 /Per Person",
      duration: "14 Days",
      image: "https://images.unsplash.com/photo-1572044161556-9a58498b58cd?auto=format&fit=crop&q=80&w=600",
    }
  ];

  return (
    <section className="packages-section">
      <div className="packages-container">
        <div className="packages-header">
          <h2>Top Recommended Hajj & Umrah Packages</h2>
          <p>Find the perfect spiritual journey tailored to your needs and comfort.</p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              {/* Card Image */}
              <div className="card-image-wrapper">
                <img src={pkg.image} alt={pkg.title} className="card-image" />
              </div>
              
              {/* Card Body */}
              <div className="card-body">
                <h3 className="card-title">{pkg.title}</h3>
                <p className="card-price">{pkg.price}</p>
                
                <div className="card-meta">
                  <span className="duration-badge">{pkg.duration}</span>
                </div>
                
                <Link to={`/packages/${pkg.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;