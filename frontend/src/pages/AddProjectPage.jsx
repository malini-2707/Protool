import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import { LayoutTemplate, AlignLeft, Users, Calendar, ArrowLeft, Layers, CheckCircle2, ChevronRight, Check } from 'lucide-react';

/**
 * Add Project Page Component - Jira Premium Aesthetic
 */
const AddProjectPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    key: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    features: ['backlog', 'kanban_board'] // defaults like Jira Software
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate Jira-style Project Key from Title
  useEffect(() => {
    if (formData.title && !formData.key) {
      const words = formData.title.split(' ');
      let generatedKey = '';
      if (words.length === 1) {
        generatedKey = words[0].substring(0, 3).toUpperCase();
      } else {
        generatedKey = words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
      }
      setFormData(prev => ({ ...prev, key: generatedKey }));
    }
  }, [formData.title]);

  const availableFeatures = [
    { id: 'backlog', label: 'Backlog', description: 'Plan and prioritize work over time.' },
    { id: 'sprint_management', label: 'Sprints', description: 'Iterative work cycles for agile teams.' },
    { id: 'issue_tracking', label: 'Issue Tracking', description: 'Track bugs, tasks, and sub-tasks.' },
    { id: 'kanban_board', label: 'Kanban Board', description: 'Visual pipeline for continuous flow.' },
    { id: 'reports', label: 'Reports', description: 'Real-time agile metrics and insights.' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim() || formData.title.length < 3) {
      setError('Project name is required and must be at least 3 characters.');
      return false;
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End Date cannot be before Start Date.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        features: formData.features
      };
      const response = await projectService.createProject(projectData);
      if (response.success) {
        navigate('/projects');
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
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#172B4D]">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/projects')}>Projects</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">Create project</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Column: Form */}
        <div className="flex-1 lg:max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[#172B4D] mb-8">Add project details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Required Field: Name */}
            <div>
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] focus:ring-0 rounded-[3px] px-3 py-2 text-sm text-[#172B4D] transition-colors outline-none"
                placeholder="Try a team name, project goal, etc."
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Auto-gen Field: Key */}
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5 flex items-center justify-between">
                Key <span className="font-normal text-xs text-gray-400">Auto-generated</span>
              </label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] rounded-[3px] px-3 py-2 text-sm uppercase text-[#172B4D] font-medium outline-none"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] rounded-[3px] px-3 py-2 text-sm text-[#172B4D] transition-colors outline-none resize-y"
                placeholder="Describe this project's purpose..."
                disabled={loading}
              />
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Start Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] rounded-[3px] pl-9 pr-3 py-2 text-sm text-[#172B4D] outline-none"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Target End Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                    className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] rounded-[3px] pl-9 pr-3 py-2 text-sm text-[#172B4D] outline-none"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-medium flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <div className="pt-6 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-4 py-2 bg-transparent text-[#42526E] hover:bg-gray-200 hover:text-[#172B4D] rounded-[3px] text-sm font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#0052CC] hover:bg-[#0047B3] text-white rounded-[3px] text-sm font-semibold transition-colors flex items-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Creating...
                  </span>
                ) : 'Create project'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Template Preview Sidebar */}
        <div className="flex-1 lg:pl-12 lg:border-l border-gray-200">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-[#5E6C84] uppercase tracking-wider mb-4">Template preview</h3>
            <div className="bg-white border border-[#DFE1E6] rounded-md shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#0052CC] rounded flex items-center justify-center mr-4 shadow-inner">
                  <LayoutTemplate className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#172B4D]">Software Development</h4>
                  <p className="text-xs text-[#5E6C84]">Plan, track, and release great software.</p>
                </div>
              </div>
              <p className="text-sm text-[#42526E] mb-6 leading-relaxed">
                Includes issue tracking, agile boards, and customizable workflows tailored for complex software projects.
              </p>
              
              <h5 className="text-xs font-bold text-[#5E6C84] uppercase my-3">Included Features</h5>
              <div className="space-y-3">
                {availableFeatures.map(feat => {
                  const isActive = formData.features.includes(feat.id);
                  return (
                    <div 
                      key={feat.id} 
                      onClick={() => handleFeatureToggle(feat.id)}
                      className={`flex items-start p-2 -mx-2 rounded cursor-pointer transition-colors ${
                        isActive ? 'bg-[#E6FCFF] text-[#0065FF]' : 'hover:bg-gray-50 text-[#42526E]'
                      }`}
                    >
                      <div className="mt-0.5 mr-3">
                        {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${isActive ? 'text-[#0052CC]' : 'text-[#172B4D]'}`}>{feat.label}</div>
                        <div className={`text-xs ${isActive ? 'text-[#0065FF]' : 'text-[#5E6C84]'}`}>{feat.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-800 text-xs p-4 rounded flex items-start leading-relaxed">
              <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>You form the foundation for tracking. Later, you can customize workflows and invite team members to this workspace.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddProjectPage;
