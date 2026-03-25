import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import { LayoutTemplate, AlignLeft, Calendar, ArrowLeft, ChevronRight, CheckCircle2, Check } from 'lucide-react';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    key: '',
    description: '',
    startDate: '',
    endDate: '',
    features: [],
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectById(id);
        if (response.success && response.data) {
          const p = response.data;
          setFormData({
            title: p.name || '',
            key: p.name ? p.name.substring(0, 3).toUpperCase() : '',
            description: p.description || '',
            startDate: p.startDate ? p.startDate.split('T')[0] : '',
            endDate: p.endDate ? p.endDate.split('T')[0] : '',
            features: p.features ? p.features.map(f => typeof f === 'object' ? f.feature : f) : [],
            status: p.status || 'ACTIVE'
          });
        }
      } catch (err) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setError('');
    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        status: formData.status
      };
      // Currently features are not handled by backend update endpoint natively, but passing just in case
      const response = await projectService.updateProject(id, updateData);
      if (response.success) {
        navigate(`/projects/${id}`);
      } else {
        setError(response.error || 'Failed to update project');
      }
    } catch (err) {
      setError(err.error || 'Failed to update project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FAFBFC] p-12 text-center text-[#5E6C84]">Loading project details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-[#172B4D]">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center shadow-sm">
        <button onClick={() => navigate(`/projects/${id}`)} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/projects')}>Projects</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Edit {formData.key || 'Project'}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 lg:max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[#172B4D] mb-8">Edit project details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Name <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] focus:ring-0 rounded-[3px] px-3 py-2 text-sm text-[#172B4D] outline-none" disabled={saving} />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5 flex justify-between">
                Key <span className="font-normal text-xs text-gray-400">Read-only</span>
              </label>
              <input type="text" name="key" value={formData.key} className="w-full bg-gray-100 border-2 border-[#DFE1E6] rounded-[3px] px-3 py-2 text-sm uppercase text-gray-500 font-medium outline-none cursor-not-allowed" readOnly />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] rounded-[3px] px-3 py-2 text-sm text-[#172B4D] outline-none resize-y" disabled={saving} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] rounded-[3px] px-3 py-2 text-sm text-[#172B4D] outline-none" disabled={saving}>
                <option value="PLANNING">PLANNING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_HOLD">ON HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Start Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] rounded-[3px] pl-9 pr-3 py-2 text-sm text-[#172B4D] outline-none" disabled={saving} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#42526E] mb-1.5">Target End Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} min={formData.startDate} className="w-full bg-[#FAFBFC] border-2 border-[#DFE1E6] hover:bg-gray-100 focus:bg-white focus:border-[#4C9AFF] rounded-[3px] pl-9 pr-3 py-2 text-sm text-[#172B4D] outline-none" disabled={saving} />
                </div>
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-medium">⚠️ {error}</div>}

            <div className="pt-6 flex space-x-3">
              <button type="button" onClick={() => navigate(`/projects/${id}`)} className="px-4 py-2 text-[#42526E] hover:bg-gray-200 rounded-[3px] text-sm font-medium" disabled={saving}>Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-[#0052CC] hover:bg-[#0047B3] text-white rounded-[3px] text-sm font-semibold flex items-center">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectPage;
