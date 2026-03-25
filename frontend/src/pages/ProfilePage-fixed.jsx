import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext-fixed';
import { projectService } from '../services/projectService-prisma';

/**
 * Profile Page Component - FIXED VERSION
 * Uses React Router for navigation - NO PAGE RELOADS
 * Handles undefined state safely
 */
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // ✅ Fixed: Initialize with proper defaults
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user projects on component mount
  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user]); // Only re-run when user changes

  const fetchUserProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await projectService.getUserProjects();
      
      if (response.success) {
        // ✅ Fixed: Safe array access with optional chaining
        setProjects(response.data?.projects || []);
      } else {
        setError(response.error || 'Failed to load projects');
      }
    } catch (err) {
      setError(err.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout - NO PAGE RELOAD
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Navigate to projects - NO PAGE RELOAD
  const handleNavigateToProjects = () => {
    navigate('/projects');
  };

  // Navigate to add project - NO PAGE RELOAD
  const handleNavigateToAddProject = () => {
    navigate('/projects/new');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      'MEMBER': 'Team Member',
      'PROJECT_MANAGER': 'Project Manager',
      'ADMIN': 'Administrator'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ProTool Prisma</h1>
              <span className="ml-2 text-sm text-gray-500">Project Management Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-lg text-gray-900">{user?.name || 'Not available'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-lg text-gray-900">{user?.email || 'Not available'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-lg text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {getRoleDisplayName(user?.role)}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-lg text-gray-900">{formatDate(user?.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-lg text-gray-900">{formatDate(user?.updatedAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Status</label>
                <p className="mt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleNavigateToProjects}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                View Projects
              </button>
              <button
                onClick={handleNavigateToAddProject}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                Create Project
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
            <button
              onClick={handleNavigateToProjects}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View All Projects
            </button>
          </div>

          {/* ✅ Fixed: Safe rendering with defensive checks */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading projects...</p>
              </div>
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first project</p>
              <button
                onClick={handleNavigateToAddProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ✅ Fixed: Safe array mapping with null check */}
              {projects.slice(0, 6).map((project) => (
                <div key={project._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${project._id}/edit`)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
