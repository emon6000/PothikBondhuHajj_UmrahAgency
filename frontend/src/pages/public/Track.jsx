import React, { useState } from 'react';
import { FaCheckCircle, FaSpinner, FaCreditCard, FaFileInvoice, FaPlaneDeparture, FaSearch } from 'react-icons/fa';

const Track = () => {
  const [trackingId, setTrackingId] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setBookingData(null);
    setLoading(true);

    try {
      // 1. ADD .trim() HERE to clean the ID before sending to the server
      const cleanId = trackingId.trim(); 
      const response = await fetch(`http://localhost:5000/api/track/${cleanId}`);
      
      const data = await response.json();

      if (response.ok) {
        setBookingData(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to determine the CSS class of each step based on the database status
  const getStepClass = (stepIndex, currentStatus) => {
    const statuses = ['PENDING_APPROVAL', 'DOCUMENTS_NEEDED', 'PROCESSING_VISA', 'READY_TO_TRAVEL'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex > stepIndex) return 'step completed';
    if (currentIndex === stepIndex) return 'step active';
    return 'step pending';
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', background: '#f8fafc' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%', marginBottom: '2rem' }}>
        <h2>Track Your Journey</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Enter the secure Tracking ID provided by Pothik Bondhu to view your visa and flight progress.</p>
        
        {/* The Search Bar */}
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="e.g., PB-2027-8892 or UUID..." 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
          />
          <button type="submit" style={{ background: '#064e3b', color: 'white', padding: '0 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaSearch /> Track
          </button>
        </form>

        {error && <div style={{ color: '#ef4444', marginTop: '1rem', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</div>}
        {loading && <div style={{ color: '#064e3b', marginTop: '1rem' }}><FaSpinner className="spin-anim" /> Searching database...</div>}
      </div>

      {/* Main Dashboard Content (Only shows if ID is found) */}
      {bookingData && (
        <main className="dashboard-main" style={{ maxWidth: '800px', width: '100%', background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '2rem' }}>
          
          {/* Welcome Banner */}
          <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '5px' }}>Pilgrim: {bookingData.client_name}</h1>
              <p style={{ color: '#64748b' }}>Tracking ID: <strong>{bookingData.id}</strong></p>
            </div>
            <div className="package-badge" style={{ background: '#dcfce7', color: '#166534', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {bookingData.package_name}
            </div>
          </header>

          {/* Financial Summary */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '10px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount Paid</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#064e3b' }}>{bookingData.amount_paid} BDT</p>
            </div>
            <div style={{ flex: 1, borderLeft: '2px solid #e2e8f0', paddingLeft: '20px' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Cost</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{bookingData.total_cost} BDT</p>
            </div>
          </div>

          {/* Journey Progress Tracker */}
          <section className="progress-section">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#0f172a' }}>Your Journey Status</h2>
            
            <div className="stepper-container">
              
              {/* Step 0: PENDING_APPROVAL */}
              <div className={getStepClass(0, bookingData.status)}>
                <div className="step-icon">{getStepClass(0, bookingData.status).includes('completed') ? <FaCheckCircle /> : <FaSpinner className={getStepClass(0, bookingData.status).includes('active') ? "spin-anim" : ""} />}</div>
                <div className="step-content">
                  <h4>Application Review</h4>
                  <p>Initial registration submitted and under agency review.</p>
                </div>
              </div>

              {/* Step 1: DOCUMENTS_NEEDED */}
              <div className={getStepClass(1, bookingData.status)}>
                <div className="step-icon">{getStepClass(1, bookingData.status).includes('completed') ? <FaCheckCircle /> : <FaFileInvoice className={getStepClass(1, bookingData.status).includes('active') ? "pulse-anim" : ""} />}</div>
                <div className="step-content">
                  <h4>Document Verification</h4>
                  <p>Verifying your NID and Passport for Ministry submission.</p>
                </div>
              </div>

              {/* Step 2: PROCESSING_VISA */}
              <div className={getStepClass(2, bookingData.status)}>
                <div className="step-icon">{getStepClass(2, bookingData.status).includes('completed') ? <FaCheckCircle /> : <FaCreditCard className={getStepClass(2, bookingData.status).includes('active') ? "pulse-anim" : ""} />}</div>
                <div className="step-content">
                  <h4>Visa & Payments</h4>
                  <p>Processing visa with the Saudi Embassy and clearing milestone payments.</p>
                </div>
              </div>

              {/* Step 3: READY_TO_TRAVEL */}
              <div className={getStepClass(3, bookingData.status)}>
                <div className="step-icon">{getStepClass(3, bookingData.status).includes('completed') || getStepClass(3, bookingData.status).includes('active') ? <FaPlaneDeparture color="green" /> : <FaPlaneDeparture />}</div>
                <div className="step-content">
                  <h4>Ready for Departure</h4>
                  <p>Visa approved! Collect your physical guidebook and bags.</p>
                </div>
              </div>

            </div>
          </section>

        </main>
      )}
    </div>
  );
};

export default Track;