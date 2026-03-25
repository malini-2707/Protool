import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import { ArrowLeft, Edit3, CheckCircle2, LayoutTemplate, Plus } from 'lucide-react';
import PageShell from '../components/PageShell';

const statusStyle = {
  DONE:        'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20',
  IN_PROGRESS: 'bg-indigo-500/10 text-indigo-300 border border-indigo-400/20',
  TODO:        'bg-slate-500/10 text-slate-400 border border-slate-400/20',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await projectService.getProjectById(id);
      if (res.success && res.data) setProject(res.data);
      else setError(res.error || 'Project not found');
    } catch (err) {
      setError(err.error || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsSubmittingTask(true);
    try {
      const res = await projectService.createTask(id, { title: newTaskTitle.trim(), priority: 'MEDIUM' });
      if (res.success) { setNewTaskTitle(''); setIsAddingTask(false); fetchProject(); }
    } catch (err) {
      alert('Failed to create task: ' + (err.error || 'Unknown error'));
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setProject((prev) => prev ? { ...prev, tasks: prev.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t) } : prev);
    try {
      const res = await projectService.updateTask(taskId, { status: newStatus });
      if (!res.success) fetchProject();
    } catch { fetchProject(); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );

  if (error || !project) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center text-rose-300">
      {error || 'Project not found'}
    </div>
  );

  const key = project.name ? project.name.substring(0, 3).toUpperCase() : 'PRJ';

  const statCards = [
    { label: 'Total Tasks', value: project.tasks?.length || 0, color: 'bg-slate-500/10 text-slate-300' },
    { label: 'Completed',   value: project.tasks?.filter((t) => t.status === 'DONE').length || 0, color: 'bg-emerald-500/10 text-emerald-300' },
    { label: 'In Progress', value: project.tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0, color: 'bg-indigo-500/10 text-indigo-300' },
    { label: 'To Do',       value: project.tasks?.filter((t) => t.status === 'TODO').length || 0, color: 'bg-amber-500/10 text-amber-300' },
  ];

  return (
    <PageShell breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: project.name }]}>
      {/* Sub-header */}
      <div className="px-6 md:px-8 py-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm shadow shadow-indigo-500/30">
            {key}
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">{project.name}</h1>
            <p className="text-xs text-slate-500">{project.status || 'ACTIVE'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/projects/${id}/edit`)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col xl:flex-row gap-6">

        {/* Main Canvas */}
        <div className="flex-1 space-y-5">
          {/* Overview Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-400" /> Board Overview
            </h2>
            <p className="text-sm text-slate-400 mb-5">{project.description || 'No description provided.'}</p>

            {/* Stat chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statCards.map(({ label, value, color }) => (
                <div key={label} className={`p-4 rounded-xl text-center ${color} border border-white/5`}>
                  <div className="text-2xl font-extrabold">{value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-70">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tasks</h3>
              {!isAddingTask && (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> New issue
                </button>
              )}
            </div>

            {/* Inline task form */}
            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="mb-4 bg-white/5 border-2 border-indigo-500/50 rounded-xl p-3">
                <input
                  type="text"
                  autoFocus
                  disabled={isSubmittingTask}
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder-slate-500 mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-white/5 rounded-lg transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmittingTask || !newTaskTitle.trim()}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 transition-all">
                    {isSubmittingTask ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            {project.tasks?.length === 0 && !isAddingTask ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                <p className="text-sm text-slate-500">No tasks yet. Create your first issue to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {project.tasks?.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] transition-all group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">{task.title}</span>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-full outline-none cursor-pointer ml-4 flex-shrink-0 border transition-all ${statusStyle[task.status] ?? statusStyle.TODO}`}
                      style={{ appearance: 'none' }}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-72 flex-shrink-0 space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">About Project</h3>
            <div className="space-y-4 text-sm">
              {/* Lead */}
              <div>
                <span className="block text-xs text-slate-500 mb-1">Project Lead</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-400/20">
                    {project.owner?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-slate-200">{project.owner?.name || 'Unknown'}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                {[['Start Date', project.startDate], ['End Date', project.endDate]].map(([lbl, val]) => (
                  <div key={lbl}>
                    <span className="block text-xs text-slate-500 mb-0.5">{lbl}</span>
                    <span className="text-slate-300 text-xs">{val ? new Date(val).toLocaleDateString() : 'Not set'}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <span className="block text-xs text-slate-500 mb-2">Enabled Features</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.features?.map((f) => (
                    <span key={f.id || f.feature} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 text-xs rounded-full">
                      {(f.feature || f).replace('_', ' ')}
                    </span>
                  ))}
                  {(!project.features || project.features.length === 0) && (
                    <span className="text-xs text-slate-500">Standard</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
