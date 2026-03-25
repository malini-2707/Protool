import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api-fixed';
import { projectService } from './services/projectService';

// Import components
import LoginFixedNoReload from './components/Login-fixed-noreload';
import RegisterFixedNoReload from './components/Register-fixed-noreload';
import ProfileDashboard from './components/ProfileDashboard';

const AppFixed = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('login');

  // Check for existing user session on app load - NO infinite re-renders
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentView('profile');
      } catch (error) {
        // Invalid stored user data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []); // Empty dependency array - runs only once

  // Handle successful login - NO page reload
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('profile');
  };

  // Handle successful registration - NO page reload
  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('profile');
  };

  // Handle logout - NO page reload
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
  };

  // Navigate between views - NO page reload
  const navigateTo = (view) => {
    setCurrentView(view);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render based on current view - NO page reloads
  switch (currentView) {
    case 'login':
      return <LoginFixedNoReload onLogin={handleLogin} onNavigateToRegister={() => navigateTo('register')} />;
    
    case 'register':
      return <RegisterFixedNoReload onRegister={handleRegister} onNavigateToLogin={() => navigateTo('login')} />;
    
    case 'profile':
      return (
        <ProfileDashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateToLogin={() => navigateTo('login')}
        />
      );
    
    default:
      return <LoginFixedNoReload onLogin={handleLogin} onNavigateToRegister={() => navigateTo('register')} />;
  }
};

export default AppFixed;
