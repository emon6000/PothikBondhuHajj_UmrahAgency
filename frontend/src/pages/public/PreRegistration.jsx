import React, { useState, useRef } from 'react';
import { FaIdCard, FaPassport, FaUser, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const PreRegistration = () => {
  // 1. Mock Data for the 3 Hajj 2027 Packages
  const packages2027 = [
    { id: "p1", title: "Standard Hajj 2027", duration: "40 Days", fee: "BDT 30,000 Advance", type: "Shifting" },
    { id: "p2", title: "Premium Hajj 2027", duration: "30 Days", fee: "BDT 50,000 Advance", type: "Non-Shifting" },
    { id: "p3", title: "VIP Short Hajj 2027", duration: "14 Days", fee: "BDT 1,00,000 Advance", type: "VIP Luxury" }
  ];

  // 2. Form State and Scroll Reference
  const [selectedPackage, setSelectedPackage] = useState('');
  const formRef = useRef(null);

  const handleSelectPackage = (pkgTitle) => {
    setSelectedPackage(pkgTitle);
    // Smoothly scroll down to the form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration Details Submitted Successfully! We will contact you shortly.");
    // We will connect this to Supabase later!
  };

  return (
    <div className="registration-page">
      
      {/* Top Section: The 2027 Packages */}
      <section className="reg-packages-section">
        <div className="reg-header">
          <h2>Hajj 2027 Pre-Registration</h2>
          <p>Secure your spot for the upcoming Hajj season. Choose your desired package tier below.</p>
        </div>

        <div className="reg-packages-grid">
          {packages2027.map((pkg) => (
            <div className="reg-card" key={pkg.id}>
              <div className="reg-card-header">
                <h3>{pkg.title}</h3>
                <span className="reg-badge">{pkg.type}</span>
              </div>
              <div className="reg-card-body">
                <p><strong>Duration:</strong> {pkg.duration}</p>
                <p className="reg-fee"><strong>Pre-Reg Fee:</strong> <br/>{pkg.fee}</p>
              </div>
              <button 
                className="select-pkg-btn"
                onClick={() => handleSelectPackage(pkg.title)}
              >
                Pre-Register for This
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Section: The Official Form */}
      <section className="reg-form-section" ref={formRef}>
        <div className="form-container">
          <div className="form-header">
            <h3>Official Pilgrim Details</h3>
            <p>Please enter your legal details exactly as they appear on your National ID and Passport.</p>
          </div>

          <form onSubmit={handleSubmit} className="official-reg-form">
            
            {/* Package Selection */}
            <div className="form-group full-width">
              <label>Selected Package Tier</label>
              <select 
                required 
                value={selectedPackage} 
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="reg-input"
              >
                <option value="" disabled>-- Select a Package --</option>
                {packages2027.map(pkg => (
                  <option key={pkg.id} value={pkg.title}>{pkg.title}</option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="form-row">
              <div className="form-group">
                <label><FaUser className="input-icon"/> Full Legal Name</label>
                <input type="text" placeholder="MD. ABDULLAH" required className="reg-input" />
              </div>
              <div className="form-group">
                <label><FaPhoneAlt className="input-icon"/> Phone Number</label>
                <input type="tel" placeholder="+880 1XXXXXXXXX" required className="reg-input" />
              </div>
            </div>

            {/* Document Details */}
            <div className="form-row">
              <div className="form-group">
                <label><FaIdCard className="input-icon"/> National ID (NID) Number</label>
                <input type="number" placeholder="10 or 17 digit NID" required className="reg-input" />
              </div>
              <div className="form-group">
                <label><FaPassport className="input-icon"/> Passport Number</label>
                <input type="text" placeholder="e.g., A12345678" required className="reg-input" />
              </div>
            </div>

            {/* Email (Optional but recommended) */}
            <div className="form-group full-width">
              <label><FaEnvelope className="input-icon"/> Email Address</label>
              <input type="email" placeholder="example@gmail.com" required className="reg-input" />
            </div>

            <button type="submit" className="submit-reg-btn">Submit Pre-Registration</button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default PreRegistration;