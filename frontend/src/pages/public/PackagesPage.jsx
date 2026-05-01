import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaClock, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import packagesData from '../../data/packages.json'; // Importing your mock database!

const PackagesPage = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPackages, setFilteredPackages] = useState([]);

  // This "magic" effect reads the URL when the page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');

    if (type === 'hajj' || type === 'umrah') {
      setActiveFilter(type);
    } else {
      setActiveFilter('all');
    }
  }, [location]);

  // This filters the packages whenever the activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPackages(packagesData);
    } else {
      setFilteredPackages(packagesData.filter((pkg) => pkg.type === activeFilter));
    }
  }, [activeFilter]);

  return (
    <div className="packages-explorer-page">
      {/* Dynamic Header */}
      <div className="explorer-header">
        <h2>
          {activeFilter === 'hajj'
            ? 'Exclusive Hajj Packages'
            : activeFilter === 'umrah'
              ? 'Premium Umrah Packages'
              : 'All Spiritual Journeys'}
        </h2>
        <p>
          Browse our meticulously planned itineraries tailored for your comfort and peace of mind.
        </p>
      </div>

      {/* Filter Toggles */}
      <div className="explorer-filters">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          View All
        </button>
        <button
          className={`filter-btn ${activeFilter === 'hajj' ? 'active' : ''}`}
          onClick={() => setActiveFilter('hajj')}
        >
          Hajj Only
        </button>
        <button
          className={`filter-btn ${activeFilter === 'umrah' ? 'active' : ''}`}
          onClick={() => setActiveFilter('umrah')}
        >
          Umrah Only
        </button>
      </div>

      {/* Packages Grid */}
      <div className="explorer-grid">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <div className="explorer-card fade-in" key={pkg.id}>
              <div className="card-image-box">
                <img src={pkg.image} alt={pkg.title} />
                <span className={`pkg-type-badge ${pkg.type}`}>{pkg.type.toUpperCase()}</span>
              </div>

              <div className="card-content">
                <h3>{pkg.title}</h3>

                <div className="pkg-details-list">
                  <p>
                    <FaClock className="detail-icon" /> <strong>Duration:</strong> {pkg.duration}
                  </p>
                  <p>
                    <FaMoneyBillWave className="detail-icon" /> <strong>Price:</strong>{' '}
                    <span className="price-text">{pkg.price}</span>
                  </p>
                  <p>
                    <FaCalendarAlt className="detail-icon" /> <strong>Availability:</strong> Open
                    for Booking
                  </p>
                </div>

                <div className="card-actions">
                  {/* Changed from <button> to <Link> to connect to the Details page */}
                  <Link to={`/packages/${pkg.id}`} className="secondary-btn">
                    View Itinerary
                  </Link>
                  <Link
                    to="/register"
                    state={{ selectedPackageId: pkg.id }}
                    className="primary-btn"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-packages">
            <h3>No packages found for this category.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
