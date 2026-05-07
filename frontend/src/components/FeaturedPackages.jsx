import React from 'react';
import { Link } from 'react-router-dom';
import packagesData from '../data/packages.json'; // 1. Import the JSON database!

const FeaturedPackages = () => {
  const displayPackages = packagesData.slice(0, 4);

  return (
    <section className="packages-section">
      <div className="packages-container">
        <div className="packages-header">
          <h2>Top Recommended Hajj & Umrah Packages</h2>
          <p>Find the perfect spiritual journey tailored to your needs and comfort.</p>
        </div>

        <div className="packages-grid">
          {displayPackages.map((pkg) => (
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
                
                {/* 3. This now dynamically links to /packages/h1, /packages/u1, etc. */}
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