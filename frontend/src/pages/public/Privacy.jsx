import React from 'react';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="page-banner">
        <h1>Privacy Policy</h1>
        <p>How we protect your personal and legal information.</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>1. Data Collection</h2>
          <p>We collect essential personal information including your full name, National ID (NID), passport details, biometric data (via Nusuk), and medical history to process your travel documents.</p>
        </section>

        <section>
          <h2>2. Use of Information</h2>
          <p>Your data is used exclusively for booking flights, securing accommodations, and processing visas with the Saudi Arabian government. We do not use your data for unauthorized marketing.</p>
        </section>

        <section>
          <h2>3. Data Sharing</h2>
          <p>We share your official documents strictly with authorized entities: the Bangladesh Ministry of Religious Affairs, the Saudi Ministry of Hajj & Umrah, and our partnered airlines/hotels. We never sell your data to third parties.</p>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>All digital uploads (passports, photos) are stored securely. Once your Hajj or Umrah cycle is complete, sensitive physical and digital copies can be purged upon request, adhering to local data retention laws.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;