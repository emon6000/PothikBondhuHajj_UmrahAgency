import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaUpload, FaCreditCard, FaFileInvoice, FaPlaneDeparture, FaSignOutAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const navigate = useNavigate();

  // Mock User & Enrollment Data (Later, this comes from Supabase)
  const userData = {
    name: "MD. ABDULLAH",
    hajjId: "PB-2027-8892",
    package: "VIP Short Hajj 2027",
    status: "document_pending" // State machine: registered -> document_pending -> payment_pending -> visa_processing -> ready
  };

  const handleLogout = () => {
    // Add logout logic later
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>Client Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">Overview</Link>
          <Link to="/dashboard/documents" className="nav-item">My Documents</Link>
          <Link to="/dashboard/payments" className="nav-item">Payments</Link>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignOutAlt /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        
        {/* Welcome Banner */}
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, {userData.name}</h1>
            <p>Pilgrim ID: <strong>{userData.hajjId}</strong></p>
          </div>
          <div className="package-badge">
            Enrolled in: <span>{userData.package}</span>
          </div>
        </header>

        {/* Action Required Alert */}
        <div className="action-alert">
          <div className="alert-content">
            <h3>Action Required: Document Verification</h3>
            <p>We need your Smart NID and Passport scans to proceed with your Hajj registration at the Ministry.</p>
          </div>
          <Link to="/dashboard/documents" className="alert-btn"><FaUpload /> Upload Now</Link>
        </div>

        {/* Journey Progress Tracker */}
        <section className="progress-section">
          <h2>Your Journey Status</h2>
          
          <div className="stepper-container">
            
            {/* Step 1: Completed */}
            <div className="step completed">
              <div className="step-icon"><FaCheckCircle /></div>
              <div className="step-content">
                <h4>Pre-Registration</h4>
                <p>Initial form submitted and approved.</p>
              </div>
            </div>

            {/* Step 2: Active/Current */}
            <div className="step active">
              <div className="step-icon"><FaSpinner className="spin-anim" /></div>
              <div className="step-content">
                <h4>Document Verification</h4>
                <p>Awaiting upload of NID and Passport.</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="step pending">
              <div className="step-icon"><FaCreditCard /></div>
              <div className="step-content">
                <h4>Milestone Payments</h4>
                <p>Advance clearance required.</p>
              </div>
            </div>

            {/* Step 4: Pending */}
            <div className="step pending">
              <div className="step-icon"><FaFileInvoice /></div>
              <div className="step-content">
                <h4>Visa & Ticketing</h4>
                <p>Processing with Saudi Embassy.</p>
              </div>
            </div>

            {/* Step 5: Pending */}
            <div className="step pending">
              <div className="step-icon"><FaPlaneDeparture /></div>
              <div className="step-content">
                <h4>Ready for Departure</h4>
                <p>Collect physical guidebook and bags.</p>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default UserDashboard;