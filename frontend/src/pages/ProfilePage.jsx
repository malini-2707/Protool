import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext-clean';
import { projectService } from '../services/projectService-prisma';
import PageShell from '../components/PageShell';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available';

const roleLabel = { MEMBER: 'Team Member', PROJECT_MANAGER: 'Project Manager', ADMIN: 'Administrator' };
const roleStyle = {
  ADMIN: 'bg-rose-500/20 text-rose-300 border border-rose-400/30',
  MEMBER: 'bg-sky-500/20 text-sky-300 border border-sky-400/30',
  PROJECT_MANAGER: 'bg-violet-500/20 text-violet-300 border border-violet-400/30',
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await projectService.getUserProjects({ page: 1, limit: 6 });
        if (res.success) setProjects(res.data?.projects || []);
        else setError(res.error || 'Failed to load');
      } catch (err) {
        setError(err.error || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const initials = (user?.name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <PageShell breadcrumb={[{ label: 'Profile' }]}>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user?.name || 'User'}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
              <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${roleStyle[user?.role] ?? roleStyle.MEMBER}`}>
                {roleLabel[user?.role] || user?.role || 'Member'}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-white/5 pt-5">
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email Address', value: user?.email },
              { label: 'Account Created', value: formatDate(user?.createdAt) },
              { label: 'Last Updated', value: formatDate(user?.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-white">{value || 'Not available'}</p>
              </div>
            ))}
          </div>

          {/* Account status */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500 mb-1">Account Status</p>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">
              Active
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-white/5">
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              View Projects
            </button>
            <button
              onClick={() => navigate('/projects/new')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Create Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-rose-400/30 text-rose-300 hover:bg-rose-500/10 text-sm font-semibold rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-400/20 text-rose-300 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-rose-400 hover:text-rose-200">×</button>
          </div>
        )}

        {/* Recent Projects */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Recent Projects</h2>
            <button onClick={() => navigate('/projects')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              View all →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <svg className="animate-spin h-7 w-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm mb-4">No projects yet</p>
              <button
                onClick={() => navigate('/projects/new')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                    {p.title || p.name}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{new Date(p.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs text-indigo-400 font-medium">View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default ProfilePage;
