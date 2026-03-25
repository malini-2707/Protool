import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api-fixed';
import ProjectsList from './components/ProjectsList';
import LoginFixed from './components/Login-fixed';
import RegisterFixed from './components/Register-fixed';

const AppMERN = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'projects'

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentView('projects');
      } catch (error) {
        // Invalid stored user data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Handle successful login
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('projects');
  };

  // Handle successful registration
  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('projects');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
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

  // Render based on current view
  switch (currentView) {
    case 'login':
      return <LoginFixed onLogin={handleLogin} />;
    
    case 'register':
      return <RegisterFixed onRegister={handleRegister} />;
    
    case 'projects':
      return (
        <div>
          {/* Navigation Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">ProTool MERN</h1>
                  <span className="ml-2 text-sm text-gray-500">Project Management</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Welcome, {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>
            <ProjectsList />
          </main>
        </div>
      );
    
    default:
      return <LoginFixed onLogin={handleLogin} />;
  }
};

export default AppMERN;
