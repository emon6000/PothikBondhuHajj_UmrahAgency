import React, { useState, useRef, useEffect } from 'react';
import { FaIdCard, FaPassport, FaUser, FaPhoneAlt, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PreRegistration = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // --- NEW: FETCH PACKAGES FROM DATABASE ---
  const [hajjPackages, setHajjPackages] = useState([]);
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/packages');
        const data = await response.json();
        // Filter only the Hajj packages for this page
        setHajjPackages(data.filter(pkg => pkg.type === 'hajj'));
      } catch (err) {
        console.error("Failed to load packages", err);
      }
    };
    fetchPackages();
  }, []);

  // --- Session Check ---
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userStr = localStorage.getItem('pothik_user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  // --- Form State ---
  const [selectedPkgId, setSelectedPkgId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nid: '', passport: '' });

  const handleSelectPackage = (pkgId) => {
    setSelectedPkgId(pkgId);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPkgId) return alert("Please select a package first!");

    try {
      if (user) {
        const response = await fetch('http://localhost:5000/api/create-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, packageId: selectedPkgId }) 
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Success! ${data.message}`);
          navigate('/');
        } else alert(`Error: ${data.error}`);
        
      } else {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, packageId: selectedPkgId }) 
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Application submitted! We will send your Tracking ID shortly.`);
          navigate('/'); 
        } else alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="registration-page">
      <section className="reg-packages-section">
        <div className="reg-header">
          <h2>Hajj Pre-Registration</h2>
          <p>Secure your spot for the upcoming Hajj season. Choose your desired package tier below.</p>
        </div>

        {/* DYNAMIC PACKAGES GRID */}
        <div className="reg-packages-grid">
          {hajjPackages.length === 0 ? <p>Loading live packages...</p> : null}
          {hajjPackages.map((pkg) => (
            <div className="reg-card" key={pkg.id} style={{ border: selectedPkgId === pkg.id ? '2px solid #064e3b' : '1px solid #eee' }}>
              <div className="reg-card-header">
                <h3>{pkg.title}</h3>
                <span className="reg-badge">{pkg.type.toUpperCase()}</span>
              </div>
              <div className="reg-card-body">
                <p><strong>Duration:</strong> {pkg.duration}</p>
                <p className="reg-fee"><strong>Cost:</strong> <br/>{pkg.cost.toLocaleString()} BDT</p>
                
                {/* Dynamically split the comma-separated features into bullet points */}
                <ul style={{ textAlign: 'left', fontSize: '0.85em', marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
                  {pkg.features ? pkg.features.split(',').map((feature, index) => (
                    <li key={index}>{feature.trim()}</li>
                  )) : null}
                </ul>

              </div>
              <button type="button" className="select-pkg-btn" onClick={() => handleSelectPackage(pkg.id)}>
                {selectedPkgId === pkg.id ? "Selected" : "Select This Package"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Form (Same logic as before) */}
      <section className="reg-form-section" ref={formRef}>
        <div className="form-container">
          {user ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <FaCheckCircle size={50} color="#064e3b" style={{ marginBottom: '1rem' }} />
              <h3>Welcome back, {user.name}!</h3>
              <div className="form-group full-width" style={{ marginTop: '2rem', textAlign: 'left' }}>
                <label>Confirm Your Selection</label>
                <select required value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)} className="reg-input">
                  <option value="" disabled>-- Choose a Package --</option>
                  {hajjPackages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.title}</option>)}
                </select>
              </div>
              <button onClick={handleSubmit} className="submit-reg-btn" style={{ marginTop: '2rem' }}>Confirm & Book</button>
            </div>
          ) : (
            <>
              <div className="form-header">
                <h3>Official Pilgrim Details</h3>
                <p>Please enter your legal details exactly as they appear on your National ID and Passport.</p>
              </div>
              <form onSubmit={handleSubmit} className="official-reg-form">
                <div className="form-group full-width">
                  <label>Selected Package Tier</label>
                  <select required value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)} className="reg-input">
                    <option value="" disabled>-- Select a Package --</option>
                    {hajjPackages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.title}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group"><label><FaUser className="input-icon"/> Full Name</label><input type="text" name="name" onChange={handleInputChange} required className="reg-input" /></div>
                  <div className="form-group"><label><FaPhoneAlt className="input-icon"/> Phone</label><input type="tel" name="phone" onChange={handleInputChange} required className="reg-input" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label><FaIdCard className="input-icon"/> NID Number</label><input type="number" name="nid" onChange={handleInputChange} required className="reg-input" /></div>
                  <div className="form-group"><label><FaPassport className="input-icon"/> Passport</label><input type="text" name="passport" onChange={handleInputChange} required className="reg-input" /></div>
                </div>
                <div className="form-group full-width" style={{ marginBottom: '1.5rem' }}>
                  <label><FaEnvelope className="input-icon"/> Email Address</label>
                  <input type="email" name="email" onChange={handleInputChange} required className="reg-input" />
                </div>
                <button type="submit" className="submit-reg-btn">Submit Pre-Registration</button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PreRegistration;