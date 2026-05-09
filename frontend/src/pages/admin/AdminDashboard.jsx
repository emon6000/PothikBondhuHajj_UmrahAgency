import React, { useState, useEffect } from 'react';
import { FaUserClock, FaTrashAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);

  // NEW PACKAGE FORM STATE
  const [pkgForm, setPkgForm] = useState({
    title: '', type: 'hajj', duration: '', cost: '', features: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    fetchPackages(); 
  }, []);

  // --- HELPER TO GET TOKEN ---
  const getToken = () => localStorage.getItem('pothik_token');

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) setUsers(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) setBookings(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchPackages = async () => {
    try {
      // Packages are usually public, so no token is strictly required here unless your backend demands it
      const response = await fetch('http://localhost:5000/api/packages');
      if (response.ok) setPackages(await response.json());
    } catch (err) { console.error(err); }
  };

  // --- ACTIONS ---
  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-user/${userId}`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) fetchUsers(); 
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-booking-status/${bookingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchBookings();
    } catch (err) { console.error(err); }
  };

  const handlePaymentUpdate = async (bookingId, currentPaid, totalCost) => {
    const newAmountStr = prompt(`Total Cost is ${totalCost} BDT.\nCurrently paid: ${currentPaid} BDT.\nEnter NEW total paid:`, currentPaid);
    if (newAmountStr === null) return; 
    
    const newAmount = parseInt(newAmountStr);
    if (isNaN(newAmount) || newAmount < 0 || newAmount > totalCost) return alert("Invalid amount.");

    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-payment/${bookingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ amount_paid: newAmount })
      });
      if (response.ok) fetchBookings(); 
    } catch (err) { console.error(err); }
  };

  const handleCopyLink = (bookingId) => {
    navigator.clipboard.writeText(bookingId);
    alert(`Tracking ID Copied: ${bookingId}`);
  };

  // --- PACKAGE MANAGEMENT ACTIONS ---
  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/packages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(pkgForm)
      });
      
      if (response.ok) {
        alert("Package added successfully!");
        setPkgForm({ title: '', type: 'hajj', duration: '', cost: '', features: '' });
        fetchPackages(); 
      } else {
        alert("Failed to add package. Check permissions.");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeletePackage = async (pkgId) => {
    if (!window.confirm("Are you sure? This will delete the package from the website.")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/packages/${pkgId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) fetchPackages();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Agency Control Center</h2>
      <p>Manage your pilgrims, finances, and website packages.</p>

      {/* SECTION 1: Pending Approvals */}
      <div style={{ marginTop: '2rem', background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>1. New Registrations</h3>
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#064e3b' }}>
              <th style={{ padding: '10px' }}>Name</th><th>Phone</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => !u.is_approved).map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.name}</td>
                <td>{user.phone}</td>
                <td><span style={{ color: 'orange' }}><FaUserClock/> Pending</span></td>
                <td>
                  <button onClick={() => handleApprove(user.id)} style={{ background: '#064e3b', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Approve</button>
                </td>
              </tr>
            ))}
            {users.filter(u => !u.is_approved).length === 0 && (
              <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>No pending registrations.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SECTION 2: Active Bookings */}
      <div style={{ marginTop: '2rem', background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>2. Active Bookings Tracker</h3>
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#064e3b' }}>
              <th style={{ padding: '10px' }}>Pilgrim Name</th><th>Package</th><th>Finances</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  <strong style={{ display: 'block', fontSize: '1.05em' }}>{booking.client_name}</strong>
                  <button onClick={() => handleCopyLink(booking.id)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', marginTop: '5px', cursor: 'pointer' }}>📋 Copy Tracking ID</button>
                </td>
                <td>{booking.package_name}</td>
                <td>
                  <div style={{ fontSize: '0.9em', marginBottom: '5px' }}>Paid: <strong>{booking.amount_paid}</strong> / {booking.total_cost}</div>
                  <button onClick={() => handlePaymentUpdate(booking.id, booking.amount_paid, booking.total_cost)} style={{ background: '#ca8a04', color: 'white', padding: '3px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}>Log Payment</button>
                </td>
                <td>
                  <select value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}>
                    <option value="PENDING_APPROVAL">1. Pending Approval</option>
                    <option value="DOCUMENTS_NEEDED">2. Documents Verified</option>
                    <option value="PROCESSING_VISA">3. Processing Visa</option>
                    <option value="READY_TO_TRAVEL">4. Ready to Travel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION 3: PACKAGE MANAGEMENT */}
      <div style={{ marginTop: '2rem', background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>3. Dynamic Package Management</h3>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {/* Create Form */}
          <form onSubmit={handleCreatePackage} style={{ flex: '1', background: '#f8fafc', padding: '1rem', borderRadius: '8px', minWidth: '300px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Add New Package</h4>
            <input type="text" placeholder="Package Title (e.g. VIP Hajj)" required value={pkgForm.title} onChange={e => setPkgForm({...pkgForm, title: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}/>
            <select value={pkgForm.type} onChange={e => setPkgForm({...pkgForm, type: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}>
              <option value="hajj">Hajj</option>
              <option value="umrah">Umrah</option>
            </select>
            <input type="text" placeholder="Duration (e.g. 14 Days)" required value={pkgForm.duration} onChange={e => setPkgForm({...pkgForm, duration: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}/>
            <input type="number" placeholder="Total Cost in BDT" required value={pkgForm.cost} onChange={e => setPkgForm({...pkgForm, cost: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}/>
            <textarea placeholder="Features (Comma separated: Visa, Flights, Hotel)" value={pkgForm.features} onChange={e => setPkgForm({...pkgForm, features: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '60px', boxSizing: 'border-box' }}></textarea>
            <button type="submit" style={{ width: '100%', background: '#064e3b', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Publish Package</button>
          </form>

          {/* List of Live Packages */}
          <div style={{ flex: '2', minWidth: '300px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Live Website Packages</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {packages.map(pkg => (
                <div key={pkg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '10px', borderRadius: '5px' }}>
                  <div>
                    <strong>{pkg.title}</strong> <span style={{ fontSize: '0.8em', background: '#e2e8f0', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px' }}>{pkg.type.toUpperCase()}</span>
                    <div style={{ fontSize: '0.9em', color: '#64748b', marginTop: '4px' }}>{pkg.duration} | {pkg.cost} BDT</div>
                  </div>
                  <button onClick={() => handleDeletePackage(pkg.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}><FaTrashAlt /></button>
                </div>
              ))}
              {packages.length === 0 && <p style={{ color: '#64748b' }}>No packages currently live on the site.</p>}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;