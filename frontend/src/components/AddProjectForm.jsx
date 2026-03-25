import React, { useState } from 'react';
import { projectService } from '../services/projectService';

const AddProjectForm = ({ onProjectCreated, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    features: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available Jira-style features
  const availableFeatures = [
    { id: 'backlog', label: 'Backlog', description: 'Product backlog management' },
    { id: 'sprint_management', label: 'Sprint Management', description: 'Agile sprint planning' },
    { id: 'issue_tracking', label: 'Issue Tracking', description: 'Bug and issue tracking' },
    { id: 'kanban_board', label: 'Kanban Board', description: 'Visual task management' },
    { id: 'reports', label: 'Reports', description: 'Analytics and reporting' },
    { id: 'time_tracking', label: 'Time Tracking', description: 'Time logging and tracking' },
    { id: 'team_management', label: 'Team Management', description: 'Team collaboration' },
    { id: 'notifications', label: 'Notifications', description: 'Email and in-app notifications' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Handle feature selection
  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
    setError('');
  };

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Project title is required');
      return false;
    }

    if (formData.title.trim().length < 3) {
      setError('Project title must be at least 3 characters');
      return false;
    }

    if (formData.title.length > 100) {
      setError('Project title cannot exceed 100 characters');
      return false;
    }

    if (formData.description && formData.description.length > 500) {
      setError('Description cannot exceed 500 characters');
      return false;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start > end) {
        setError('End date must be after start date');
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || null,
        features: formData.features
      };

      const response = await projectService.createProject(projectData);
      
      if (response.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          features: []
        });
        
        // Notify parent component
        onProjectCreated(response.data);
        
      } else {
        setError(response.error || 'Failed to create project');
      }
    } catch (err) {
      setError(err.error || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">3-100 characters</p>
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Optional, max 500 characters</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Project Features
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  formData.features.includes(feature.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleFeatureToggle(feature.id)}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{feature.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;
