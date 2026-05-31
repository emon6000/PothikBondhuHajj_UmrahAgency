import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedPackages = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/packages');
        const data = await response.json();
        
        setFeaturedPackages(data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="packages-section">
      <div className="packages-container">
        <div className="packages-header">
          <h2>Top Recommended Hajj & Umrah Packages</h2>
          <p>Find the perfect spiritual journey tailored to your needs and comfort.</p>
        </div>

        <div className="packages-grid">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', color: '#64748b' }}>Loading live packages...</p>
          ) : featuredPackages.length > 0 ? (
            featuredPackages.map((pkg) => (
              <div className="package-card" key={pkg.id}>
                {/* Card Image */}
                <div className="card-image-wrapper">
                  <img 
                    src={pkg.image || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800"} 
                    alt={pkg.title} 
                    className="card-image" 
                  />
                </div>
                
                {/* Card Body */}
                <div className="card-body">
                  <h3 className="card-title">{pkg.title}</h3>
                  
                  <p className="card-price">
                    {pkg.cost ? pkg.cost.toLocaleString() : '0'} BDT
                  </p>
                  
                  <div className="card-meta">
                    <span className="duration-badge">{pkg.duration}</span>
                    <span style={{ fontSize: '0.8rem', color: '#064e3b', fontWeight: 'bold', marginLeft: '10px', textTransform: 'uppercase' }}>
                      {pkg.type}
                    </span>
                  </div>
                  
                  <Link to={`/packages/${pkg.id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>No packages available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;