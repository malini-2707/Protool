import React from 'react';
import { useAuth } from '../context/AuthContext-clean';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Welcome, {user?.name || 'User'}!</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role || 'MEMBER'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#e0f2fe', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Projects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>0</p>
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Projects
          </button>
        </div>

        <div style={{ backgroundColor: '#dcfce7', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>0</p>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Tasks
          </button>
        </div>

        <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Profile</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>⚙️</p>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
