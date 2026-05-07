import { useEffect, useState } from 'react';
import { FaCheckCircle, FaUserClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch users when the page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-user/${userId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        alert('User Approved!');
        fetchUsers(); // Refresh the list automatically
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Agency Control Center</h2>
      <p>Manage your pilgrims and their statuses.</p>

      <div
        style={{
          marginTop: '2rem',
          background: 'white',
          padding: '1rem',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h3>Registered Pilgrims</h3>

        <table
          style={{
            width: '100%',
            textAlign: 'left',
            marginTop: '1rem',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', color: '#064e3b' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  {user.is_approved ? (
                    <span
                      style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <FaCheckCircle /> Approved
                    </span>
                  ) : (
                    <span
                      style={{ color: 'orange', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <FaUserClock /> Pending
                    </span>
                  )}
                </td>
                <td>
                  {!user.is_approved && (
                    <button
                      onClick={() => handleApprove(user.id)}
                      style={{
                        background: '#064e3b',
                        color: 'white',
                        padding: '5px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                  )}
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
