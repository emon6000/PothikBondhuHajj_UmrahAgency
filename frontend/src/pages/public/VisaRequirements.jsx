import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaPassport, FaIdCard, FaFileImage, FaSyringe, FaNotesMedical, FaCheckCircle } from 'react-icons/fa';

const VisaRequirements = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('hajj');

  // This checks the URL when the page loads to open the correct tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'umrah' || type === 'hajj') {
      setActiveTab(type);
    }
  }, [location]);

  return (
    <div className="visa-page">
      <div className="visa-header">
        <h2>Official Visa Requirements</h2>
        <p>Ensure you have all the necessary documents for a smooth visa processing experience.</p>
      </div>

      {/* Tab Navigation */}
      <div className="visa-tabs">
        <button 
          className={`tab-btn ${activeTab === 'hajj' ? 'active' : ''}`}
          onClick={() => setActiveTab('hajj')}
        >
          Hajj Visa
        </button>
        <button 
          className={`tab-btn ${activeTab === 'umrah' ? 'active' : ''}`}
          onClick={() => setActiveTab('umrah')}
        >
          Umrah Visa
        </button>
      </div>

      {/* Content Area */}
      <div className="visa-content-container">
        
        {/* HAJJ REQUIREMENTS */}
        {activeTab === 'hajj' && (
          <div className="visa-content-panel fade-in">
            <h3 className="panel-title">Hajj Visa Checklist (2026-2027)</h3>
            <p className="panel-desc">Hajj visas have strict quotas and rigorous medical requirements. Please prepare the following well in advance.</p>
            
            <div className="req-grid">
              <div className="req-card">
                <FaPassport className="req-icon" />
                <h4>Original Passport</h4>
                <p>Must be valid for at least 6 months from the date of travel, with two blank pages facing each other.</p>
              </div>
              
              <div className="req-card">
                <FaIdCard className="req-icon" />
                <h4>National ID / Birth Certificate</h4>
                <p>Clear color photocopy of your Smart NID. For minors, a computerized Birth Certificate is required.</p>
              </div>

              <div className="req-card">
                <FaFileImage className="req-icon" />
                <h4>Photographs</h4>
                <p>4 recent passport-size photographs (4x4 cm) with a pure white background. Do not wear glasses.</p>
              </div>

              <div className="req-card">
                <FaSyringe className="req-icon" />
                <h4>Meningitis Vaccine</h4>
                <p>Original vaccination certificate for ACYW135 (Meningitis). Must be valid for 3 years.</p>
              </div>

              <div className="req-card">
                <FaNotesMedical className="req-icon" />
                <h4>Medical Certificate</h4>
                <p>A general health certificate from a certified medical practitioner confirming you are fit for travel.</p>
              </div>

              <div className="req-card">
                <FaCheckCircle className="req-icon" />
                <h4>Biometrics (NUSUK)</h4>
                <p>Mandatory biometric fingerprint registration through the official Saudi Visa Bio app.</p>
              </div>
            </div>
          </div>
        )}

        {/* UMRAH REQUIREMENTS */}
        {activeTab === 'umrah' && (
          <div className="visa-content-panel fade-in">
            <h3 className="panel-title">Umrah e-Visa Checklist</h3>
            <p className="panel-desc">Umrah e-Visas are processed rapidly. Ensure your digital documents are clear and readable.</p>
            
            <div className="req-grid">
              <div className="req-card">
                <FaPassport className="req-icon" />
                <h4>Scanned Passport</h4>
                <p>A high-quality color scan of your passport's bio-data page. Must be valid for at least 6 months.</p>
              </div>
              
              <div className="req-card">
                <FaFileImage className="req-icon" />
                <h4>Digital Photograph</h4>
                <p>Soft copy of a recent passport-size photo with a white background. Minimum resolution 600x600 pixels.</p>
              </div>

              <div className="req-card">
                <FaIdCard className="req-icon" />
                <h4>NID Copy</h4>
                <p>Clear photocopy of your Bangladeshi National ID card.</p>
              </div>

              <div className="req-card">
                <FaCheckCircle className="req-icon" />
                <h4>Biometrics (NUSUK)</h4>
                <p>Mandatory biometric fingerprint registration through the official Saudi Visa Bio app before departure.</p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action at the bottom */}
        <div className="visa-help-box">
          <h4>Need Assistance?</h4>
          <p>Our document verification team can review your files before submission to ensure a 100% approval rate.</p>
          <Link to="/login" className="contact-support-btn">Log In to Upload Documents</Link>
        </div>

      </div>
    </div>
  );
};

export default VisaRequirements;