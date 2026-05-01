import React, { useState } from 'react';
import packagesData from '../../data/packages.json'; // Importing our package "database"
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaPassport, FaLock } from 'react-icons/fa';

const Registration = () => {
  const [journeyType, setJourneyType] = useState('hajj'); // 'hajj' or 'umrah'
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', nid: '', passport: '', password: ''
  });

  // Filter packages based on the toggle
  const filteredPackages = packagesData.filter(p => p.type === journeyType);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPkg) return alert("Please select a package first!");
    
    // This is where we will eventually send data to the backend
    console.log("Submitting to Database:", { ...formData, package: selectedPkg });
    alert(`Registration Successful for ${formData.name}! (Data logged to console)`);
  };

  return (
    <div className="reg-page-container">
      <h2>Pilgrim Registration</h2>

      {/* 1. Journey Toggle */}
      <div className="journey-toggle">
        <button className={journeyType === 'hajj' ? 'active' : ''} onClick={() => {setJourneyType('hajj'); setSelectedPkg(null);}}>Hajj Journey</button>
        <button className={journeyType === 'umrah' ? 'active' : ''} onClick={() => {setJourneyType('umrah'); setSelectedPkg(null);}}>Umrah Journey</button>
      </div>

      {/* 2. Package Selection Grid */}
      <div className="pkg-selection-grid">
        {filteredPackages.map(pkg => (
          <div 
            key={pkg.id} 
            className={`pkg-option ${selectedPkg?.id === pkg.id ? 'selected' : ''}`}
            onClick={() => setSelectedPkg(pkg)}
          >
            <h3>{pkg.title}</h3>
            <p>{pkg.duration} | {pkg.price}</p>
          </div>
        ))}
      </div>

      {/* 3. The Registration Form */}
      {selectedPkg && (
        <form className="reg-form" onSubmit={handleSubmit}>
          <h3>Registering for: {selectedPkg.title}</h3>
          
          <div className="input-row">
            <div className="input-group">
              <label><FaUser /> Full Name</label>
              <input type="text" name="name" onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label><FaEnvelope /> Email</label>
              <input type="email" name="email" onChange={handleInputChange} required />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label><FaPhone /> Phone</label>
              <input type="tel" name="phone" onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label><FaLock /> Password</label>
              <input type="password" name="password" onChange={handleInputChange} required />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label><FaIdCard /> NID Number</label>
              <input type="number" name="nid" onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label><FaPassport /> Passport Number</label>
              <input type="text" name="passport" onChange={handleInputChange} required />
            </div>
          </div>

          <button type="submit" className="submit-btn">Complete Registration</button>
        </form>
      )}
    </div>
  );
};

export default Registration;