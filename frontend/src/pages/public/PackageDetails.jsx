import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaBus,
  FaCheckCircle,
  FaHotel,
  FaIdBadge,
  FaPlane,
  FaUtensils,
} from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        // Fetch all packages and find the specific one
        // (Or you can create a specific backend route for /api/packages/:id)
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        const foundPackage = data.find((p) => p.id === id);
        setPkg(foundPackage);
      } catch (err) {
        console.error('Error fetching package details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetails();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading package details...</div>;
  }

  if (!pkg) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Package not found</h2>
        <button onClick={() => navigate('/packages')}>Back to Packages</button>
      </div>
    );
  }

  return (
    <div className="package-details-page">
      <div className="details-top-bar" style={{ padding: '20px' }}>
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#064e3b',
            fontWeight: 'bold',
          }}
        >
          <FaArrowLeft /> Back to Packages
        </button>
      </div>

      <div className="details-hero">
        <div className="details-hero-image">
          <img
            src={pkg.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200'}
            alt={pkg.title}
          />
          <div className="type-badge">{pkg.type.toUpperCase()}</div>
        </div>

        <div className="details-hero-info">
          <h1>{pkg.title}</h1>
          <p className="details-duration">
            Total Duration: <strong>{pkg.duration}</strong>
          </p>
          <div className="details-price-box">
            <span className="price-label">Starting from</span>
            {/* Updated from .price to .cost with formatting */}
            <h2 className="price-amount">{pkg.cost ? pkg.cost.toLocaleString() : '0'} BDT</h2>
            <span className="price-suffix">/ Per Person</span>
          </div>

          <Link to="/register" state={{ selectedPackageId: pkg.id }} className="book-now-large-btn">
            Proceed to Pre-Registration
          </Link>
          <p className="guarantee-text">
            <FaCheckCircle /> Authorized Hajj & Umrah Agency
          </p>
        </div>
      </div>

      <div className="details-content-grid">
        <div className="details-main-content">
          <section className="info-section">
            <h3>Package Inclusions</h3>
            <div className="inclusions-grid">
              <div className="inclusion-item">
                <FaPlane className="inc-icon" /> <span>Return Air Ticket</span>
              </div>
              <div className="inclusion-item">
                <FaIdBadge className="inc-icon" /> <span>Visa Processing</span>
              </div>
              <div className="inclusion-item">
                <FaHotel className="inc-icon" /> <span>Star Rated Hotels</span>
              </div>
              <div className="inclusion-item">
                <FaBus className="inc-icon" /> <span>AC Transport in KSA</span>
              </div>
              <div className="inclusion-item">
                <FaUtensils className="inc-icon" /> <span>Daily Meals (Buffet)</span>
              </div>
              <div className="inclusion-item">
                <FaCheckCircle className="inc-icon" /> <span>Guided Ziyarah</span>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h3>Sample Itinerary Overview</h3>
            <ul className="itinerary-list">
              <li>
                <strong>Day 1:</strong> Departure from Dhaka (Hazrat Shahjalal International
                Airport) to Jeddah. Transfer to Makkah hotel.
              </li>
              <li>
                <strong>Day 2-5:</strong> Perform Umrah with our experienced Moallem. Free days for
                regular prayers at Masjid al-Haram.
              </li>
              <li>
                {pkg.features || 'Guided Ziyarah (sightseeing) to historical places in Makkah.'}
              </li>
              <li>
                <strong>Final Day:</strong> Transfer to Madinah/Jeddah airport for departure back to
                Dhaka.
              </li>
            </ul>
          </section>
        </div>

        <div className="details-sidebar">
          <div className="sidebar-card">
            <h3>Important Notes</h3>
            <ul className="notes-list">
              <li>Prices are subject to change based on airline ticket availability.</li>
              <li>Hotel distances are calculated from the outer courtyard of the Harams.</li>
              <li>Please ensure your passport is valid for at least 6 months.</li>
            </ul>
          </div>

          <div className="sidebar-contact">
            <h4>Need Customization?</h4>
            <p>Call our branch for a customized itinerary tailored to your family's needs.</p>
            <p className="contact-number">+880 1733 391 826</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
