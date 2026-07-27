import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FeaturedPackages = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        setFeaturedPackages(data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching featured packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [API_URL]);

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .packages-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
              padding: 10px !important;
            }
            .packages-header h2 {
              font-size: 1.5rem !important;
              line-height: 1.2 !important;
              margin-bottom: 8px !important;
            }
            .packages-header p {
              font-size: 0.85rem !important;
            }
            .package-card {
              display: flex;
              flex-direction: column;
              height: 100%; 
            }
            .card-image-wrapper {
              height: 120px !important; 
            }
            .card-body {
              padding: 10px !important; 
              display: flex;
              flex-direction: column;
              flex-grow: 1; 
            }
            .card-title {
              font-size: 0.95rem !important;
              line-height: 1.2 !important;
              margin-bottom: 5px !important;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .card-price {
              font-size: 0.85rem !important;
              font-weight: bold !important;
              margin-bottom: 8px !important;
            }
            .card-meta {
              flex-wrap: wrap !important; 
              gap: 5px !important;
              margin-bottom: 12px !important;
            }
            .duration-badge {
              font-size: 0.7rem !important;
              padding: 2px 6px !important;
            }
            .view-details-btn {
              padding: 8px !important;
              font-size: 0.8rem !important;
              margin-top: auto; 
            }
          }
          @media (max-width: 380px) {
             .packages-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <section className="packages-section">
        <div className="packages-container">
          <div className="packages-header">
            <h2>{t('featuredPackages.title')}</h2>
            <p>{t('featuredPackages.subtitle')}</p>
          </div>

          <div className="packages-grid">
            {loading ? (
              <p style={{ textAlign: 'center', width: '100%', color: '#64748b', gridColumn: '1 / -1' }}>
                {t('featuredPackages.loading')}
              </p>
            ) : featuredPackages.length > 0 ? (
              featuredPackages.map((pkg) => (
                <div className="package-card" key={pkg.id}>
                  <div className="card-image-wrapper">
                    <img
                      src={pkg.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800'}
                      alt={pkg.title}
                      className="card-image"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{pkg.title}</h3>
                    <p className="card-price">{pkg.cost ? pkg.cost.toLocaleString() : '0'} BDT</p>
                    <div className="card-meta">
                      <span className="duration-badge">{pkg.duration}</span>
                      <span style={{ fontSize: '0.75rem', color: '#064e3b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {pkg.type}
                      </span>
                    </div>
                    <Link to={`/packages/${pkg.id}`} className="view-details-btn">
                      {t('featuredPackages.viewDetails')}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                {t('featuredPackages.noPackages')}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedPackages;