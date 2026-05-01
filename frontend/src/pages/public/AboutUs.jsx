import React from 'react';
import { FaHistory, FaHandshake, FaGlobe } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="page-banner">
        <h1>About Pothik Bondhu</h1>
        <p>Your trusted companion for the holy journey.</p>
      </div>

      <div className="about-content">
        <section className="about-text-section">
          <h2>Our Story</h2>
          <p>Founded in 2012, Pothik Bondhu was established with a singular vision: to facilitate the Hajj and Umrah journeys for Bangladeshi pilgrims with utmost sincerity, comfort, and logistical precision. Over the past decade, we have grown from a small local office into a nationwide network, recognized for our faith-centered service and transparent practices.</p>
        </section>

        <section className="core-values-grid">
          <div className="value-card">
            <FaHistory className="value-icon" />
            <h3>Experience</h3>
            <p>Over a decade of hands-on experience in managing complex visa, flight, and accommodation logistics in Saudi Arabia.</p>
          </div>
          <div className="value-card">
            <FaHandshake className="value-icon" />
            <h3>Trust & Transparency</h3>
            <p>No hidden fees. We believe in complete financial transparency and delivering exactly what we promise to our pilgrims.</p>
          </div>
          <div className="value-card">
            <FaGlobe className="value-icon" />
            <h3>Global Network</h3>
            <p>Direct partnerships with top-tier hotels in Makkah and Madinah, ensuring premium comfort close to the Harams.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;