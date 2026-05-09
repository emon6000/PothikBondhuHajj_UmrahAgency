import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaUserClock, FaPlaneDeparture } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // --- ACTIONS ---
  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-user/${userId}`, { method: 'PUT' });
      if (response.ok) {
        alert("User Approved!");
        fetchUsers(); 
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-booking-status/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Refresh the bookings table to show the new status
        fetchBookings();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handlePaymentUpdate = async (bookingId, currentPaid, totalCost) => {
    // A simple browser prompt to ask the Admin for the new total paid amount
    const newAmountStr = prompt(`Total Cost is ${totalCost} BDT.\nCurrently paid: ${currentPaid} BDT.\n\nEnter the NEW total amount paid:`, currentPaid);
    
    if (newAmountStr === null) return; // Admin clicked Cancel
    
    const newAmount = parseInt(newAmountStr);
    if (isNaN(newAmount) || newAmount < 0 || newAmount > totalCost) {
      return alert("Please enter a valid amount that does not exceed the total cost.");
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-payment/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_paid: newAmount })
      });
      
      if (response.ok) {
        fetchBookings(); // Refresh the table to show the new money!
      } else {
        alert("Failed to update payment.");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Agency Control Center</h2>
      <p>Manage your pilgrims and their journey progress.</p>

      {/* SECTION 1: Pending User Approvals */}
      <div style={{ marginTop: '2rem', background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>1. New Registrations (Pending Approval)</h3>
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#064e3b' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => !u.is_approved).map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.name}</td>
                <td>{user.email}</td>
                <td><span style={{ color: 'orange' }}><FaUserClock/> Pending</span></td>
                <td>
                  <button onClick={() => handleApprove(user.id)} style={{ background: '#064e3b', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Approve Account
                  </button>
                </td>
              </tr>
            ))}
            {users.filter(u => !u.is_approved).length === 0 && (
              <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: 'gray' }}>No pending approvals.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SECTION 2: Active Journey Tracker */}
      <div style={{ marginTop: '2rem', background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>2. Active Bookings Tracker</h3>
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#064e3b' }}>
              <th style={{ padding: '10px' }}>Pilgrim Name</th>
              <th>Phone</th>
              <th>Package</th>
              <th>Finances</th> {/* <-- NEW HEADER */}
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{booking.client_name}</td>
                <td>{booking.phone}</td>
                <td>{booking.package_name}</td>
                
                {/* --- NEW FINANCES COLUMN --- */}
                <td>
                  <div style={{ fontSize: '0.9em', marginBottom: '5px' }}>
                    Paid: <strong>{booking.amount_paid}</strong> / {booking.total_cost}
                  </div>
                  <button 
                    onClick={() => handlePaymentUpdate(booking.id, booking.amount_paid, booking.total_cost)}
                    style={{ background: '#ca8a04', color: 'white', padding: '3px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}
                  >
                    Log Payment
                  </button>
                </td>
                {/* --------------------------- */}

                <td>
                  <select 
                    value={booking.status} 
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', background: booking.status === 'READY_TO_TRAVEL' ? '#dcfce7' : 'white' }}
                  >
                    <option value="PENDING_APPROVAL">1. Pending Approval</option>
                    <option value="DOCUMENTS_NEEDED">2. Documents Verified</option>
                    <option value="PROCESSING_VISA">3. Processing Visa & Payments</option>
                    <option value="READY_TO_TRAVEL">4. Ready to Travel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;