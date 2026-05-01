import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPlane, FaHotel, FaBus, FaUtensils, FaCheckCircle, FaArrowLeft, FaIdBadge } from 'react-icons/fa';
import packagesData from '../../data/packages.json';

const PackageDetails = () => {
  const { id } = useParams(); // Gets the ID from the URL (e.g., 'h1')
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    // Find the specific package from our mock database
    const foundPackage = packagesData.find(p => p.id === id);
    setPkg(foundPackage);
  }, [id]);

  if (!pkg) {
    return <div className="loading-state">Loading package details...</div>;
  }

  return (
    <div className="package-details-page">
      
      {/* 1. Back Button & Header */}
      <div className="details-top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Packages
        </button>
      </div>

      {/* 2. Hero Section of the Package */}
      <div className="details-hero">
        <div className="details-hero-image">
          <img src={pkg.image} alt={pkg.title} />
          <div className="type-badge">{pkg.type.toUpperCase()}</div>
        </div>
        
        <div className="details-hero-info">
          <h1>{pkg.title}</h1>
          <p className="details-duration">Total Duration: <strong>{pkg.duration}</strong></p>
          <div className="details-price-box">
            <span className="price-label">Starting from</span>
            <h2 className="price-amount">{pkg.price}</h2>
            <span className="price-suffix">/ Per Person</span>
          </div>
          
          <Link to="/register" className="book-now-large-btn">
            Proceed to Pre-Registration
          </Link>
          <p className="guarantee-text"><FaCheckCircle /> Authorized Hajj & Umrah Agency</p>
        </div>
      </div>

      {/* 3. Detailed Information Grid */}
      <div className="details-content-grid">
        
        {/* Left Column: What's Included */}
        <div className="details-main-content">
          <section className="info-section">
            <h3>Package Inclusions</h3>
            <div className="inclusions-grid">
              <div className="inclusion-item"><FaPlane className="inc-icon"/> <span>Return Air Ticket</span></div>
              <div className="inclusion-item"><FaIdBadge className="inc-icon"/> <span>Visa Processing</span></div>
              <div className="inclusion-item"><FaHotel className="inc-icon"/> <span>Star Rated Hotels</span></div>
              <div className="inclusion-item"><FaBus className="inc-icon"/> <span>AC Transport in KSA</span></div>
              <div className="inclusion-item"><FaUtensils className="inc-icon"/> <span>Daily Meals (Buffet)</span></div>
              <div className="inclusion-item"><FaCheckCircle className="inc-icon"/> <span>Guided Ziyarah</span></div>
            </div>
          </section>

          <section className="info-section">
            <h3>Sample Itinerary Overview</h3>
            <ul className="itinerary-list">
              <li><strong>Day 1:</strong> Departure from Dhaka (Hazrat Shahjalal International Airport) to Jeddah. Transfer to Makkah hotel.</li>
              <li><strong>Day 2-5:</strong> Perform Umrah with our experienced Moallem. Free days for regular prayers at Masjid al-Haram.</li>
              <li><strong>Day 6:</strong> Guided Ziyarah (sightseeing) to historical places in Makkah (Arafat, Mina, Muzdalifah, Jabal al-Nour).</li>
              <li><strong>Day 7:</strong> Transfer from Makkah to Madinah via AC luxury bus or Haramain High-Speed Railway.</li>
              <li><strong>Day 8-12:</strong> Stay in Madinah. Prayers at Al-Masjid an-Nabawi. Guided Ziyarah to Quba Mosque and Mount Uhud.</li>
              <li><strong>Final Day:</strong> Transfer to Madinah/Jeddah airport for departure back to Dhaka.</li>
            </ul>
          </section>
        </div>

        {/* Right Column: Important Notes */}
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
            <p>Call our Dhaka or Comilla branch for a customized itinerary tailored to your family's needs.</p>
            <p className="contact-number">+880 1733 391 826</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PackageDetails;