import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import { Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import PageShell from '../components/PageShell';

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50';
const labelCls = 'block text-sm font-medium text-slate-400 mb-1.5';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', key: '', description: '', startDate: '', endDate: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await projectService.getProjectById(id);
        if (res.success && res.data) {
          const p = res.data;
          setFormData({
            title: p.name || '',
            key: p.name ? p.name.substring(0, 3).toUpperCase() : '',
            description: p.description || '',
            startDate: p.startDate ? p.startDate.split('T')[0] : '',
            endDate: p.endDate ? p.endDate.split('T')[0] : '',
            status: p.status || 'ACTIVE',
          });
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => { setFormData((p) => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.title.length < 3) { setError('Project name must be at least 3 characters.'); return; }
    setSaving(true);
    try {
      const res = await projectService.updateProject(id, {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        status: formData.status,
      });
      if (res.success) navigate(`/projects/${id}`);
      else setError(res.error || 'Failed to update project');
    } catch (err) {
      setError(err.error || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <PageShell breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: formData.key || 'Project', to: `/projects/${id}` }, { label: 'Edit' }]}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-7">Edit project details</h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className={labelCls}>Name <span className="text-rose-400">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={saving} className={inputCls} />
            </div>

            {/* Key (read-only) */}
            <div className="w-1/2">
              <label className={`${labelCls} flex justify-between`}>
                Key <span className="text-xs font-normal text-slate-600">Read-only</span>
              </label>
              <input type="text" value={formData.key} readOnly className={`${inputCls} uppercase tracking-widest opacity-50 cursor-not-allowed`} />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} disabled={saving} className={`${inputCls} resize-y`} />
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} disabled={saving}
                className={`${inputCls} bg-slate-900`}>
                {['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'].map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              {[{ name: 'startDate', label: 'Start Date' }, { name: 'endDate', label: 'Target End Date' }].map(({ name, label }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                    <input type="date" name={name} value={formData[name]} onChange={handleChange}
                      min={name === 'endDate' ? formData.startDate : undefined}
                      disabled={saving} className={`${inputCls} pl-9`} />
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

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(`/projects/${id}`)} disabled={saving}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-60">
                {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
};

export default EditProjectPage;
