import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const PackagesPage = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');

  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchLivePackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        setAllPackages(data);
      } catch (error) {
        console.error('Failed to fetch database packages:', error);
      }
    };
    fetchLivePackages();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');

    if (type === 'hajj' || type === 'umrah') {
      setActiveFilter(type);
    } else {
      setActiveFilter('all');
    }
  }, [location]);
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPackages(allPackages);
    } else {
      setFilteredPackages(allPackages.filter((pkg) => pkg.type === activeFilter));
    }
  }, [activeFilter, allPackages]);

  return (
    <div className="packages-explorer-page">
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
                {/* Fallback image used in case the database doesn't have an image column yet */}
                <img
                  src={
                    pkg.image ||
                    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800'
                  }
                  alt={pkg.title}
                />
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
                    {/* Database uses 'cost' instead of 'price', formatted nicely */}
                    <span className="price-text">
                      {pkg.cost ? pkg.cost.toLocaleString() : '0'} BDT
                    </span>
                  </p>
                  <p>
                    <FaCalendarAlt className="detail-icon" /> <strong>Availability:</strong> Open
                    for Booking
                  </p>
                </div>

                <div className="card-actions">
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
            <h3>
              {allPackages.length === 0
                ? 'Loading live packages...'
                : 'No packages found for this category.'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
