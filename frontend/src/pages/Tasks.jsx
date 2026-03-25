import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import PageShell from '../components/PageShell';
import { CheckCircle2, Clock, AlertCircle, Plus, Search, Filter } from 'lucide-react';

const statusStyles = {
  TODO: 'bg-slate-500/10 text-slate-400 border border-slate-400/20',
  IN_PROGRESS: 'bg-indigo-500/10 text-indigo-300 border border-indigo-400/20',
  DONE: 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20',
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const res = await projectService.getUserProjects({ page: 1, limit: 100 });
      if (res.success) {
        // Flatten tasks from all projects
        const allTasks = [];
        res.data.projects.forEach((project) => {
          if (project.tasks) {
            project.tasks.forEach((task) => {
              allTasks.push({
                ...task,
                projectName: project.name,
                projectId: project.id,
              });
            });
          }
        });
        setTasks(allTasks);
      } else {
        setError(res.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err.error || 'An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus, projectId) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await projectService.updateTask(taskId, { status: newStatus });
    } catch (err) {
      // Revert on error
      fetchAllTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'ALL' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageShell breadcrumb={[{ label: 'Tasks' }]}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">All Tasks</h1>
            <p className="text-slate-400 mt-1 text-sm">Monitor and manage your workload across all projects</p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 text-indigo-400 border-2 border-current border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-400/20 text-rose-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-white mb-1">No tasks found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Task Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Project</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className={`w-4 h-4 ${task.status === 'DONE' ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/projects/${task.projectId}`)}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {task.projectName}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value, task.projectId)}
                          className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border bg-transparent outline-none cursor-pointer transition-all ${statusStyles[task.status] || statusStyles.TODO}`}
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/projects/${task.projectId}`)}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Tasks;
