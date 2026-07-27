import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEdit,
  FaHistory,
  FaMoneyBillWave,
  FaReceipt,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaTrashAlt,
  FaUserClock,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchId, setSearchId] = useState('');

  // Track if we are editing an existing package
  const [editingPkgId, setEditingPkgId] = useState(null);

  const [pkgForm, setPkgForm] = useState({
    title: '',
    type: 'hajj',
    duration: '',
    cost: '',
    features: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    fetchPackages();
  }, []);

  const getToken = () => localStorage.getItem('pothik_token');

  const handleLogout = () => {
    localStorage.removeItem('pothik_token');
    navigate('/login'); // Adjust this to match your actual login route
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) setUsers(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) setBookings(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/packages`);
      if (response.ok) setPackages(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPaymentHistory = async (booking) => {
    setSelectedBooking(booking);
    try {
      const response = await fetch(`${API_URL}/api/admin/payments/${booking.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        setPaymentHistory(await response.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchById = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/track/${searchId.trim()}`);
      const data = await res.json();
      if (res.ok) {
        fetchPaymentHistory(data);
        setSearchId('');
      } else {
        alert('ID not found');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/approve-user/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        fetchUsers();
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject and delete this registration?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        fetchUsers();
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (
      !window.confirm(
        'Warning: Are you sure you want to completely cancel and remove this active booking? This action cannot be undone.'
      )
    )
      return;
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        fetchBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/update-booking-status/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOfflinePayment = async (booking) => {
    const remaining = booking.total_cost - booking.amount_paid;
    if (remaining <= 0) return alert('This package is already fully paid!');

    const newAmountStr = prompt(
      `Total Cost: ${booking.total_cost} BDT.\nRemaining Balance: ${remaining} BDT.\n\nEnter amount collected in OFFLINE CASH:`
    );
    if (newAmountStr === null) return;

    const amount = parseInt(newAmountStr);
    if (isNaN(amount) || amount <= 0 || amount > remaining) return alert('Invalid amount.');

    try {
      const response = await fetch(`${API_URL}/api/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ bookingId: booking.id, amount: amount, method: 'Offline Cash' }),
      });
      if (response.ok) {
        fetchBookings();
        if (selectedBooking && selectedBooking.id === booking.id) fetchPaymentHistory(booking);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (bookingId) => {
    navigator.clipboard.writeText(bookingId);
    alert(`Tracking ID Copied: ${bookingId}`);
  };

  // --- CRUD Operations for Packages --- //

  const handleEditClick = (pkg) => {
    setEditingPkgId(pkg.id);
    setPkgForm({
      title: pkg.title,
      type: pkg.type,
      duration: pkg.duration,
      cost: pkg.cost,
      features: pkg.features || '', // Handle arrays/nulls gracefully if needed
    });
  };

  const handleCancelEdit = () => {
    setEditingPkgId(null);
    setPkgForm({ title: '', type: 'hajj', duration: '', cost: '', features: '' });
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      // Determine if we are updating (PUT) or creating (POST)
      const method = editingPkgId ? 'PUT' : 'POST';
      const url = editingPkgId 
        ? `${API_URL}/api/admin/packages/${editingPkgId}` 
        : `${API_URL}/api/admin/packages`;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(pkgForm),
      });

      if (response.ok) {
        alert(`Package ${editingPkgId ? 'updated' : 'added'} successfully!`);
        handleCancelEdit(); // Reset form and ID
        fetchPackages();
      } else {
        alert('Failed to save package.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackage = async (pkgId) => {
    if (!window.confirm('Are you sure? This will delete the package from the website.')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/packages/${pkgId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '2rem', paddingRight: '380px', width: '100%' }}>
        
        {/* Header with Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Agency Control Center</h2>
            <p style={{ color: '#64748b' }}>Manage your pilgrims, finances, and website packages.</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)'
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div
          style={{
            marginTop: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
            1. New Registrations
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                textAlign: 'left',
                marginTop: '1rem',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr style={{ color: '#064e3b' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => !u.is_approved)
                  .map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span
                          style={{
                            color: '#d97706',
                            background: '#fef3c7',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85em',
                          }}
                        >
                          <FaUserClock /> Pending
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleApprove(user.id)}
                            style={{
                              background: '#064e3b',
                              color: 'white',
                              padding: '6px 15px',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              padding: '6px 15px',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {users.filter((u) => !u.is_approved).length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}
                    >
                      No pending registrations.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
            2. Active Bookings Tracker
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                textAlign: 'left',
                marginTop: '1rem',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr style={{ color: '#064e3b' }}>
                  <th style={{ padding: '10px' }}>Pilgrim Name</th>
                  <th>Package</th>
                  <th>Finances</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: selectedBooking?.id === booking.id ? '#f8fafc' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ display: 'block', fontSize: '1.05em' }}>
                        {booking.client_name}
                      </strong>
                      <button
                        onClick={() => handleCopyLink(booking.id)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8em',
                          marginTop: '5px',
                          cursor: 'pointer',
                          color: '#475569',
                        }}
                      >
                        📋 Copy ID
                      </button>
                    </td>
                    <td style={{ color: '#475569' }}>{booking.package_name}</td>
                    <td>
                      <div style={{ fontSize: '0.9em', marginBottom: '8px' }}>
                        <span
                          style={{
                            color:
                              booking.amount_paid >= booking.total_cost ? '#16a34a' : '#d97706',
                            fontWeight: 'bold',
                          }}
                        >
                          {booking.amount_paid} BDT
                        </span>{' '}
                        / {booking.total_cost}
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleOfflinePayment(booking)}
                          style={{
                            background: '#ca8a04',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.8em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FaMoneyBillWave /> Pay
                        </button>
                        <button
                          onClick={() => fetchPaymentHistory(booking)}
                          style={{
                            background: '#334155',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.8em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FaHistory /> Ledger
                        </button>
                      </div>
                    </td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        style={{
                          padding: '6px',
                          borderRadius: '5px',
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          color: '#1e293b',
                        }}
                      >
                        <option value="PENDING_APPROVAL">1. Pending Approval</option>
                        <option value="DOCUMENTS_NEEDED">2. Documents Verified</option>
                        <option value="PROCESSING_VISA">3. Processing Visa</option>
                        <option value="READY_TO_TRAVEL">4. Ready to Travel</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '8px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                        title="Cancel Booking"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
            3. Dynamic Package Management
          </h3>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            
            {/* DYNAMIC FORM: Creates OR Updates based on state */}
            <form
              onSubmit={handleSavePackage}
              style={{
                flex: '1',
                background: editingPkgId ? '#fefce8' : '#f8fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                minWidth: '300px',
                border: editingPkgId ? '1px solid #fde047' : '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ margin: '0 0 1rem 0', color: editingPkgId ? '#ca8a04' : '#0f172a' }}>
                {editingPkgId ? 'Edit Package' : 'Add New Package'}
              </h4>
              <input
                type="text"
                placeholder="Package Title"
                required
                value={pkgForm.title}
                onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                }}
              />
              <select
                value={pkgForm.type}
                onChange={(e) => setPkgForm({ ...pkgForm, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                }}
              >
                <option value="hajj">Hajj</option>
                <option value="umrah">Umrah</option>
              </select>
              <input
                type="text"
                placeholder="Duration"
                required
                value={pkgForm.duration}
                onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="number"
                placeholder="Cost"
                required
                value={pkgForm.cost}
                onChange={(e) => setPkgForm({ ...pkgForm, cost: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                }}
              />
              <textarea
                placeholder="Features"
                value={pkgForm.features}
                onChange={(e) => setPkgForm({ ...pkgForm, features: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  height: '80px',
                  borderRadius: '5px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                }}
              ></textarea>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: '1',
                    background: editingPkgId ? '#ca8a04' : '#064e3b',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {editingPkgId ? 'Update Package' : 'Publish Package'}
                </button>
                
                {editingPkgId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      flex: '1',
                      background: '#64748b',
                      color: 'white',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div style={{ flex: '2', minWidth: '300px' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Live Website Packages</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'white',
                      border: editingPkgId === pkg.id ? '2px solid #fde047' : '1px solid #e2e8f0',
                      padding: '15px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.1em' }}>{pkg.title}</strong>
                      <span
                        style={{
                          fontSize: '0.7em',
                          background: pkg.type === 'hajj' ? '#064e3b' : '#d97706',
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          marginLeft: '8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {pkg.type}
                      </span>
                      <div style={{ fontSize: '0.9em', color: '#64748b', marginTop: '6px' }}>
                        {pkg.duration} | {pkg.cost} BDT
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditClick(pkg)}
                        style={{
                          color: '#0284c7',
                          background: '#e0f2fe',
                          padding: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                        title="Edit Package"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        style={{
                          color: '#ef4444',
                          background: '#fee2e2',
                          padding: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                        title="Delete Package"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED SIDEBAR: Finance Ledger */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          background: '#0f172a',
          color: 'white',
          padding: '2rem 1.5rem',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          zIndex: 100,
        }}
      >
        <div
          style={{
            borderBottom: '1px solid #334155',
            paddingBottom: '15px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <FaReceipt size={24} color="#38bdf8" />
          <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem' }}>Finance Ledger</h2>
        </div>

        <form
          onSubmit={handleSearchById}
          style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}
        >
          <input
            type="text"
            placeholder="Search Tracking ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              padding: '0 15px',
              cursor: 'pointer',
            }}
          >
            <FaSearch size={14} />
          </button>
        </form>

        {selectedBooking ? (
          <div className="fade-in">
            <div
              style={{
                background: '#1e293b',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                borderLeft: '4px solid #38bdf8',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.8em',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Client Profile
                  </p>
                  <strong style={{ fontSize: '1.1em', color: '#f8fafc' }}>
                    {selectedBooking.client_name}
                  </strong>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '4px',
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div style={{ fontSize: '0.9em', color: '#cbd5e1' }}>
                Total: {selectedBooking.total_cost} BDT
              </div>
              <div style={{ fontSize: '0.9em', color: '#4ade80', fontWeight: 'bold' }}>
                Paid: {selectedBooking.amount_paid} BDT
              </div>
            </div>

            <h4
              style={{
                color: '#64748b',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                marginBottom: '10px',
              }}
            >
              Transaction History
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paymentHistory.length === 0 ? (
                <div
                  style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    background: '#1e293b',
                    borderRadius: '8px',
                    color: '#64748b',
                  }}
                >
                  No payments logged yet.
                </div>
              ) : (
                paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      background: '#1e293b',
                      padding: '15px',
                      borderRadius: '8px',
                      borderLeft: payment.method.includes('Offline')
                        ? '4px solid #ca8a04'
                        : '4px solid #2563eb',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '5px',
                      }}
                    >
                      <strong style={{ color: '#f8fafc', fontSize: '1.1em' }}>
                        +{payment.amount} BDT
                      </strong>
                      <span style={{ fontSize: '0.75em', color: '#94a3b8' }}>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.85em',
                        color: payment.method.includes('Offline') ? '#fde047' : '#93c5fd',
                      }}
                    >
                      {payment.method}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7em',
                        color: '#64748b',
                        marginTop: '8px',
                        fontFamily: 'monospace',
                      }}
                    >
                      TXN: {payment.transaction_id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div
            style={{ textAlign: 'center', color: '#475569', marginTop: '4rem', padding: '20px' }}
          >
            <FaHistory size={50} style={{ marginBottom: '15px', opacity: 0.5 }} />
            <p>Select "Ledger" from any booking row or search by Tracking ID.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;