// src/components/AboutPreview.jsx
import React from 'react';

const AboutPreview = () => {
  return (
    <section className="about-preview-section">
      <div className="about-preview-container">
        {/* Left Side: The Message */}
        <div className="about-text-content">
          <span className="subtitle">WHO WE ARE</span>
          <h2>Assalamu Alaikum from Pothik Bondhu</h2>

          <p className="primary-text">
            For years, we have guided pilgrims across continents with sincerity, Islamic
            scholarship, and logistical precision. Our dedicated team works tirelessly to deliver
            Hajj and Umrah journeys that feel both spiritually rich and seamlessly organized.
          </p>

          <p className="secondary-text">
            Founded with a vision to help the Bangladeshi community experience the holy lands with
            dignity, comfort, and peace of mind. Whether you are interacting with our digital portal
            or visiting our physical branches, our focus on professional, faith-centered service
            defines every itinerary we curate.
          </p>

          <button className="learn-more-btn">Read Our Full Story</button>
        </div>

        <div className="about-video-wrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/zSMuaCNb_B4?si=6NsJvK-DUPy1cLuc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
