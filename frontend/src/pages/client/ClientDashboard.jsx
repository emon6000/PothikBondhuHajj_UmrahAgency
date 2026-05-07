import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Pull user from local storage
    const userStr = localStorage.getItem('pothik_user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      fetchMyBooking(parsedUser.id); // 2. Fetch their specific booking
    }
  }, []);

  const fetchMyBooking = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/my-booking/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your dashboard...</div>;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in.</div>;

  return (
    <div className="client-dashboard" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Welcome back, {user.name}!</h2>
      <p>Your portal to track your spiritual journey.</p>

      {booking ? (
        <div style={{ marginTop: '2rem', background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3>Your Selected Package: {booking.title}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <p><strong>Total Cost:</strong> {booking.cost} BDT</p>
            <p><strong>Amount Paid:</strong> {booking.amount_paid} BDT</p>
            <p><strong>Duration:</strong> {booking.duration}</p>
            <p><strong>Current Status:</strong> <span style={{ color: '#064e3b', fontWeight: 'bold' }}>{booking.status.replace(/_/g, ' ')}</span></p>
          </div>

          {/* Progress Tracker UI */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Journey Progress</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.5' }}>
              
              <li style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCheckCircle /> Step 1: Registered & Approved
              </li>
              
              <li style={{ color: booking.status !== 'PENDING_APPROVAL' ? 'green' : 'gray', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {booking.status !== 'PENDING_APPROVAL' ? <FaCheckCircle /> : <FaHourglassHalf />} 
                Step 2: Documents Verified
              </li>
              
              <li style={{ color: ['PROCESSING_VISA', 'READY_TO_TRAVEL'].includes(booking.status) ? 'green' : 'gray', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {['PROCESSING_VISA', 'READY_TO_TRAVEL'].includes(booking.status) ? <FaCheckCircle /> : <FaHourglassHalf />} 
                Step 3: Payment Cleared
              </li>
              
              <li style={{ color: booking.status === 'READY_TO_TRAVEL' ? 'green' : 'gray', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {booking.status === 'READY_TO_TRAVEL' ? <FaCheckCircle /> : <FaHourglassHalf />} 
                Step 4: Visa Processed & Ready to Travel
              </li>

            </ul>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3>No Active Bookings</h3>
          <p>You have not been assigned to a package yet. The Admin is currently processing your request.</p>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;