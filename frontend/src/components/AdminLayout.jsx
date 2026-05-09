import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('pothik_token');
    localStorage.removeItem('pothik_user');
    navigate('/login');
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Ultra-Fast Admin Header */}
      <header style={{ background: '#0f172a', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8' }}>Pothik Bondhu | Secure Admin</h2>
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaSignOutAlt /> Secure Logout
        </button>
      </header>

      {/* Admin Pages (AdminDashboard) will load here */}
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;