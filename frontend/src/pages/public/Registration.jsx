import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import packagesData from '../../data/packages.json'; 
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaPassport, FaCheckCircle } from 'react-icons/fa';

const Registration = () => {
  const navigate = useNavigate();
  const [journeyType, setJourneyType] = useState('hajj'); 
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', nid: '', passport: ''
  });

  // --- Session Check ---
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userStr = localStorage.getItem('pothik_user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const filteredPackages = packagesData.filter(p => p.type === journeyType);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPkg) return alert("Please select a package first!");
    
    try {
      if (user) {
        // SCENARIO A: User is already logged in (Quick Booking)
        const response = await fetch('http://localhost:5000/api/create-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, packageId: selectedPkg.id }) 
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Success! ${data.message}`);
          navigate('/client-dashboard');
        } else alert(`Error: ${data.error}`);
        
      } else {
        // SCENARIO B: Brand new user (Full Registration)
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            password: formData.phone, // Silently use phone as password
            packageId: selectedPkg.id 
          }) 
        });

        const data = await response.json();
        if (response.ok) {
          alert(`Success! Application submitted. We will contact you with your Tracking ID shortly.`);
          navigate('/'); // Send them to home page after booking
        } else {
          alert(`Error: ${data.error}`);
        }
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="reg-page-container">
      <h2>Pilgrim Registration</h2>

      {/* 1. Journey Toggle */}
      <div className="journey-toggle">
        <button 
          type="button"
          className={journeyType === 'hajj' ? 'active' : ''} 
          onClick={() => {setJourneyType('hajj'); setSelectedPkg(null);}}
        >
          Hajj Journey
        </button>
        <button 
          type="button"
          className={journeyType === 'umrah' ? 'active' : ''} 
          onClick={() => {setJourneyType('umrah'); setSelectedPkg(null);}}
        >
          Umrah Journey
        </button>
      </div>

      {/* 2. Package Selection Grid */}
      <div className="pkg-selection-grid">
        {filteredPackages.map(pkg => (
          <div 
            key={pkg.id} 
            className={`pkg-option ${selectedPkg?.id === pkg.id ? 'selected' : ''}`}
            onClick={() => setSelectedPkg(pkg)}
            style={{ border: selectedPkg?.id === pkg.id ? '2px solid #064e3b' : '1px solid #eee', cursor: 'pointer', padding: '1rem', borderRadius: '8px' }}
          >
            <h3>{pkg.title}</h3>
            <p>{pkg.duration} | {pkg.price}</p>
          </div>
        ))}
      </div>

      {/* 3. The Registration Form */}
      {selectedPkg && (
        <div className="reg-form-container" style={{ marginTop: '2rem' }}>
          
          {user ? (
            /* --- LOGGED IN VIEW --- */
            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '10px' }}>
              <FaCheckCircle size={50} color="#064e3b" style={{ marginBottom: '1rem' }} />
              <h3>Welcome back, {user.name}!</h3>
              <p>Registering for: <strong>{selectedPkg.title}</strong></p>
              <button onClick={handleSubmit} className="submit-btn" style={{ marginTop: '1.5rem' }}>
                Confirm & Add to Dashboard
              </button>
            </div>
          ) : (
            /* --- LOGGED OUT VIEW --- */
            <form className="reg-form" onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '2rem', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Registering for: {selectedPkg.title}
              </h3>
              
              <div className="input-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaUser /> Full Name</label>
                  <input type="text" name="name" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaPhone /> Phone</label>
                  <input type="tel" name="phone" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
              </div>

              <div className="input-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaIdCard /> NID Number</label>
                  <input type="number" name="nid" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaPassport /> Passport Number</label>
                  <input type="text" name="passport" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label><FaEnvelope /> Email Address (For Notifications)</label>
                <input type="email" name="email" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>

              <button type="submit" className="submit-btn" style={{ width: '100%', padding: '12px', background: '#064e3b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer' }}>
                Complete Registration
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
};

export default Registration;