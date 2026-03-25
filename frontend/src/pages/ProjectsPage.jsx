import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext-clean';
import { projectService } from '../services/projectService-prisma';
import PageShell from '../components/PageShell';

const statusColors = {
  ACTIVE:     'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20',
  PLANNING:   'bg-sky-500/10 text-sky-300 border border-sky-400/20',
  ON_HOLD:    'bg-amber-500/10 text-amber-300 border border-amber-400/20',
  COMPLETED:  'bg-indigo-500/10 text-indigo-300 border border-indigo-400/20',
  ARCHIVED:   'bg-slate-500/10 text-slate-400 border border-slate-400/20',
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set';

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const loadProjects = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await projectService.getUserProjects({ page, limit: pagination.limit });
      if (res.success) {
        setProjects(res.data.projects);
        setPagination(res.data.pagination);
      } else setError(res.error || 'Failed to load projects');
    } catch (err) {
      setError(err.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await projectService.deleteProject(id);
      if (res.success) loadProjects(pagination.page);
      else setError(res.error || 'Failed to delete');
    } catch (err) {
      setError(err.error || 'Failed to delete project');
    }
  };

  return (
    <PageShell breadcrumb={[{ label: 'Projects' }]}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage all your active workspaces</p>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-400/20 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-rose-400 hover:text-rose-200">×</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🗂️</div>
            <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-slate-400 text-sm mb-6">Get started by creating your first project</p>
            <button
              onClick={() => navigate('/projects/new')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Create Project
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 shadow-lg cursor-pointer group"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow shadow-indigo-500/30">
                      {project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[project.status] ?? statusColors.ACTIVE}`}>
                      {project.status || 'ACTIVE'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">{project.description}</p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>📅 {formatDate(project.startDate)}</span>
                    <span>✅ {project._count?.tasks ?? 0} tasks</span>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center justify-between pt-3 border-t border-white/5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-slate-600">{new Date(project.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors"
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => loadProjects(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-1.5 text-sm border border-white/10 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                >
                  ← Prev
                </button>
                <span className="text-sm text-slate-400 px-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => loadProjects(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-1.5 text-sm border border-white/10 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
};

export default ProjectsPage;
