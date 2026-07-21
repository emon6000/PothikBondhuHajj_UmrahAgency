import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedPackages = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <>
      {/* INTERNAL CSS FOR 2-COLUMN MOBILE RESPONSIVENESS */}
      <style>
        {`
          @media (max-width: 768px) {
            /* Force the grid to display 2 columns on mobile */
            .packages-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important; /* Smaller gap to save space */
              padding: 10px !important;
            }

            /* Make the header text slightly smaller to fit better */
            .packages-header h2 {
              font-size: 1.5rem !important;
              line-height: 1.2 !important;
              margin-bottom: 8px !important;
            }
            .packages-header p {
              font-size: 0.85rem !important;
            }

            /* Adjust card internals so they fit nicely in a half-width container */
            .package-card {
              display: flex;
              flex-direction: column;
              height: 100%; /* Ensure both cards in a row stretch to match heights */
            }

            .card-image-wrapper {
              height: 120px !important; /* Smaller image height on mobile */
            }

            .card-body {
              padding: 10px !important; /* Tighter padding inside the card */
              display: flex;
              flex-direction: column;
              flex-grow: 1; /* Pushes the button to the bottom */
            }

            /* Compact text sizes for the card contents */
            .card-title {
              font-size: 0.95rem !important;
              line-height: 1.2 !important;
              margin-bottom: 5px !important;
              /* Keep title on maximum 2 lines */
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
              flex-wrap: wrap !important; /* Allow tags to stack if too long */
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
              margin-top: auto; /* Force button to the very bottom */
            }
          }

          /* Optional: For extremely small phones (like old iPhone SE), drop it back to 1 column so it doesn't break */
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
            <h2>Top Recommended Hajj & Umrah Packages</h2>
            <p>Find the perfect spiritual journey tailored to your needs and comfort.</p>
          </div>

          <div className="packages-grid">
            {loading ? (
              <p style={{ textAlign: 'center', width: '100%', color: '#64748b', gridColumn: '1 / -1' }}>
                Loading live packages...
              </p>
            ) : featuredPackages.length > 0 ? (
              featuredPackages.map((pkg) => (
                <div className="package-card" key={pkg.id}>
                  {/* Card Image */}
                  <div className="card-image-wrapper">
                    <img
                      src={
                        pkg.image ||
                        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800'
                      }
                      alt={pkg.title}
                      className="card-image"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <h3 className="card-title">{pkg.title}</h3>

                    <p className="card-price">{pkg.cost ? pkg.cost.toLocaleString() : '0'} BDT</p>

                    <div className="card-meta">
                      <span className="duration-badge">{pkg.duration}</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#064e3b',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
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
              <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                No packages available at the moment.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedPackages;