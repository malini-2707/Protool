import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import { Calendar, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import PageShell from '../components/PageShell';

const availableFeatures = [
  { id: 'backlog', label: 'Backlog', description: 'Plan and prioritize work over time.' },
  { id: 'sprint_management', label: 'Sprints', description: 'Iterative work cycles for agile teams.' },
  { id: 'issue_tracking', label: 'Issue Tracking', description: 'Track bugs, tasks, and sub-tasks.' },
  { id: 'kanban_board', label: 'Kanban Board', description: 'Visual pipeline for continuous flow.' },
  { id: 'reports', label: 'Reports', description: 'Real-time agile metrics and insights.' },
];

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50';
const labelCls = 'block text-sm font-medium text-slate-400 mb-1.5';

const AddProjectPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    key: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    features: ['backlog', 'kanban_board'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate key
  useEffect(() => {
    if (formData.title && !formData.key) {
      const words = formData.title.split(' ');
      const key = words.length === 1
        ? words[0].substring(0, 3).toUpperCase()
        : words.map((w) => w[0]).join('').substring(0, 4).toUpperCase();
      setFormData((prev) => ({ ...prev, key }));
    }
  }, [formData.title]);

  const handleChange = (e) => { setFormData((p) => ({ ...p, [e.target.name]: e.target.value })); setError(''); };
  const toggleFeature = (id) =>
    setFormData((p) => ({ ...p, features: p.features.includes(id) ? p.features.filter((f) => f !== id) : [...p.features, id] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.title.length < 3) { setError('Project name must be at least 3 characters.'); return; }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) { setError('End date cannot be before start date.'); return; }
    setLoading(true);
    try {
      const res = await projectService.createProject({ title: formData.title.trim(), description: formData.description.trim(), startDate: formData.startDate || null, endDate: formData.endDate || null, features: formData.features });
      if (res.success) navigate('/projects');
      else setError(res.error || 'Failed to create project');
    } catch (err) {
      setError(err.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: 'Create Project' }]}>
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">

        {/* Left: Form */}
        <div className="flex-1 lg:max-w-xl">
          <h1 className="text-2xl font-bold text-white mb-7">Add project details</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className={labelCls}>Name <span className="text-rose-400">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={loading} autoFocus placeholder="e.g. Marketing Campaign" className={inputCls} />
            </div>

            {/* Key */}
            <div className="w-1/2">
              <label className={`${labelCls} flex items-center justify-between`}>
                Key <span className="text-xs font-normal text-slate-600">Auto-generated</span>
              </label>
              <input type="text" name="key" value={formData.key} onChange={handleChange} disabled={loading} className={`${inputCls} uppercase font-medium tracking-widest`} />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} disabled={loading} placeholder="Describe this project's purpose…" className={`${inputCls} resize-y`} />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              {[{ name: 'startDate', label: 'Start Date' }, { name: 'endDate', label: 'Target End Date' }].map(({ name, label }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                    <input type="date" name={name} value={formData[name]} onChange={handleChange} min={name === 'endDate' ? formData.startDate : undefined} disabled={loading} className={`${inputCls} pl-9`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-400/20 text-rose-300 text-sm px-4 py-2.5 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/projects')} disabled={loading}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-60">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Creating…' : 'Create project'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Feature Selector */}
        <div className="flex-1 lg:pl-8 lg:border-l border-white/5">
          <div className="sticky top-24">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Included Features</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              {availableFeatures.map((feat) => {
                const active = formData.features.includes(feat.id);
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-500/10 border border-indigo-400/20' : 'hover:bg-white/5 border border-transparent'}`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {active
                        ? <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        : <div className="w-4 h-4 border-2 border-slate-500 rounded-full" />}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${active ? 'text-indigo-300' : 'text-slate-300'}`}>{feat.label}</div>
                      <div className="text-xs text-slate-500">{feat.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs px-4 py-3 rounded-xl leading-relaxed">
              ✨ You can customize workflows and invite team members after creating the project.
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default AddProjectPage;
