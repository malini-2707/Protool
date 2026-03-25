import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import AddProjectForm from './AddProjectForm';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Load projects
  const loadProjects = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await projectService.getUserProjects({ page, limit: pagination.limit });
      
      if (response.success) {
        setProjects(response.data.projects);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load projects');
      }
    } catch (err) {
      setError(err.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Handle project creation
  const handleProjectCreated = (newProject) => {
    setShowAddForm(false);
    loadProjects(1); // Reload first page to show new project
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await projectService.deleteProject(projectId);
      
      if (response.success) {
        loadProjects(pagination.page); // Reload current page
      } else {
        setError(response.error || 'Failed to delete project');
      }
    } catch (err) {
      setError(err.error || 'Failed to delete project');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get feature label
  const getFeatureLabel = (featureId) => {
    const featureMap = {
      backlog: 'Backlog',
      sprint_management: 'Sprint Management',
      issue_tracking: 'Issue Tracking',
      kanban_board: 'Kanban Board',
      reports: 'Reports',
      time_tracking: 'Time Tracking',
      team_management: 'Team Management',
      notifications: 'Notifications'
    };
    return featureMap[featureId] || featureId;
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      planning: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      on_hold: 'bg-orange-100 text-orange-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <AddProjectForm
            onProjectCreated={handleProjectCreated}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage your Jira-style projects</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first project</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {projects.map((project) => (
                    <div key={project._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                      <div className="p-6">
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {project.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>

                        {/* Project Description */}
                        {project.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        {/* Project Dates */}
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>

                        {/* Features */}
                        {project.features && project.features.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {project.features.slice(0, 3).map((feature) => (
                                <span
                                  key={feature}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                >
                                  {getFeatureLabel(feature)}
                                </span>
                              ))}
                              {project.features.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                  +{project.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Project Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-xs text-gray-500">
                            Created {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              onClick={() => window.location.href = `/projects/${project._id}`}
                            >
                              View
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                              onClick={() => handleDeleteProject(project._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => loadProjects(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => loadProjects(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
