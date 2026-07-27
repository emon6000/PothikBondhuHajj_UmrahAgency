import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PackagesPage = () => {
  const location = useLocation();
  const { t } = useTranslation();
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
  }, [API_URL]);

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
            ? t('packagesPage.hajjTitle')
            : activeFilter === 'umrah'
              ? t('packagesPage.umrahTitle')
              : t('packagesPage.allTitle')}
        </h2>
        <p>{t('packagesPage.subtitle')}</p>
      </div>

      <div className="explorer-filters">
        <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
          {t('packagesPage.viewAll')}
        </button>
        <button className={`filter-btn ${activeFilter === 'hajj' ? 'active' : ''}`} onClick={() => setActiveFilter('hajj')}>
          {t('packagesPage.hajjOnly')}
        </button>
        <button className={`filter-btn ${activeFilter === 'umrah' ? 'active' : ''}`} onClick={() => setActiveFilter('umrah')}>
          {t('packagesPage.umrahOnly')}
        </button>
      </div>

      <div className="explorer-grid">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <div className="explorer-card fade-in" key={pkg.id}>
              <div className="card-image-box">
                <img src={pkg.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800'} alt={pkg.title} />
                <span className={`pkg-type-badge ${pkg.type}`}>{pkg.type.toUpperCase()}</span>
              </div>

              <div className="card-content">
                <h3>{pkg.title}</h3>

                <div className="pkg-details-list">
                  <p>
                    <FaClock className="detail-icon" /> <strong>{t('packagesPage.duration')}:</strong> {pkg.duration}
                  </p>
                  <p>
                    <FaMoneyBillWave className="detail-icon" /> <strong>{t('packagesPage.price')}:</strong>{' '}
                    <span className="price-text">
                      {pkg.cost ? pkg.cost.toLocaleString() : '0'} BDT
                    </span>
                  </p>
                  <p>
                    <FaCalendarAlt className="detail-icon" /> <strong>{t('packagesPage.availability')}:</strong> {t('packagesPage.open')}
                  </p>
                </div>

                <div className="card-actions">
                  <Link to={`/packages/${pkg.id}`} className="secondary-btn">
                    {t('packagesPage.viewItinerary')}
                  </Link>
                  <Link to="/register" state={{ selectedPackageId: pkg.id }} className="primary-btn">
                    {t('packagesPage.bookNow')}
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-packages">
            <h3>
              {allPackages.length === 0
                ? t('packagesPage.loading')
                : t('packagesPage.noneFound')}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;