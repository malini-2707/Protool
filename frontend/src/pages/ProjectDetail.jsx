import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/projectService-prisma';
import { ArrowLeft, Edit3, CheckCircle2, LayoutTemplate, Box, Settings, Plus } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Task inline creation state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await projectService.getProjectById(id);
      if (res.success && res.data) {
        setProject(res.data);
      } else {
        setError(res.error || 'Project not found');
      }
    } catch (err) {
      setError(err.error || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmittingTask(true);
    try {
      const res = await projectService.createTask(id, {
        title: newTaskTitle.trim(),
        priority: 'MEDIUM'
      });
      if (res.success) {
        setNewTaskTitle('');
        setIsAddingTask(false);
        fetchProject(); // Refresh the board with the new task
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create task: ' + (err.error || 'Unknown error'));
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    // Optimistic UI Update
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      };
    });

    try {
      const res = await projectService.updateTask(taskId, { status: newStatus });
      if (!res.success) {
        fetchProject(); // Revert on arbitrary failure flag
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
      fetchProject(); // Revert on crash
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading project board...</div>;
  if (error || !project) return <div className="p-10 text-center text-red-600 font-medium">{error || 'Project not found'}</div>;

  const key = project.name ? project.name.substring(0, 3).toUpperCase() : 'PRJ';

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#172B4D]">
      {/* Header */}
      <header className="bg-white border-b border-[#DFE1E6] px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#5E6C84]" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0052CC] to-[#0065FF] text-white flex items-center justify-center font-bold shadow-sm">
              {key}
            </div>
            <div>
              <h1 className="text-xl font-semibold leading-tight">{project.name}</h1>
              <p className="text-xs font-medium text-[#5E6C84] mt-0.5">{project.status || 'ACTIVE'}</p>
            </div>
          </div>
        </div>
        
        {/* EDIT BUTTON (Per User Request) */}
        <button 
          onClick={() => navigate(`/projects/${id}/edit`)}
          className="flex items-center px-4 py-2 bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#42526E] rounded-[3px] text-sm font-semibold transition-colors border border-[#DFE1E6]"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Project Details
        </button>
      </header>

      {/* Main Board View */}
      <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col xl:flex-row gap-8">
        
        {/* Center Canvas */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded border border-[#DFE1E6] p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 flex items-center"><LayoutTemplate className="w-5 h-5 mr-2 text-[#0052CC]" /> Board Overview</h2>
            <p className="text-sm text-[#42526E] mb-6">{project.description || 'No description provided for this project.'}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#EBECF0] p-4 rounded text-center">
                <div className="text-2xl font-bold text-[#172B4D]">{project.tasks?.length || 0}</div>
                <div className="text-xs font-bold text-[#5E6C84] uppercase mt-1">Total Tasks</div>
              </div>
              <div className="bg-[#E3FCEF] p-4 rounded text-center">
                <div className="text-2xl font-bold text-[#006644]">{project.tasks?.filter(t => t.status === 'DONE').length || 0}</div>
                <div className="text-xs font-bold text-[#00875A] uppercase mt-1">Completed</div>
              </div>
              <div className="bg-[#DEEBFF] p-4 rounded text-center">
                <div className="text-2xl font-bold text-[#0052CC]">{project.tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0}</div>
                <div className="text-xs font-bold text-[#0065FF] uppercase mt-1">In Progress</div>
              </div>
              <div className="bg-[#FFFAE6] p-4 rounded text-center">
                <div className="text-2xl font-bold text-[#FF8B00]">{project.tasks?.filter(t => t.status === 'TODO').length || 0}</div>
                <div className="text-xs font-bold text-[#FF991F] uppercase mt-1">To Do</div>
              </div>
            </div>

            {/* Kanban Placeholder */}
            <div className="border-t border-[#DFE1E6] pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#5E6C84] uppercase">Recent Activity</h3>
                {!isAddingTask && (
                  <button 
                    onClick={() => setIsAddingTask(true)}
                    className="flex items-center px-3 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white rounded-[3px] text-sm font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create issue
                  </button>
                )}
              </div>

              {isAddingTask && (
                <form onSubmit={handleCreateTask} className="mb-4 bg-[#FAFBFC] border-2 border-[#4C9AFF] rounded-[3px] p-3 shadow-sm shadow-[#4c9aff33]">
                  <input
                    type="text"
                    autoFocus
                    disabled={isSubmittingTask}
                    placeholder="What needs to be done?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#172B4D] outline-none font-medium mb-3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsAddingTask(false)} className="px-3 py-1.5 text-xs font-semibold text-[#42526E] hover:bg-gray-200 rounded-[3px] transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmittingTask || !newTaskTitle.trim()} className="px-3 py-1.5 text-xs font-semibold bg-[#0052CC] text-white hover:bg-[#0047B3] rounded-[3px] disabled:opacity-50 transition-colors">
                      {isSubmittingTask ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              )}

              {project.tasks?.length === 0 && !isAddingTask ? (
                <div className="text-center py-10 bg-[#FAFBFC] border border-dashed border-[#DFE1E6] rounded">
                  <p className="text-sm text-[#5E6C84]">No tasks exist yet. Get started by creating issues!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.tasks?.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-[#DFE1E6] rounded bg-[#FAFBFC] hover:bg-white transition-colors cursor-pointer group">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-[#0052CC] mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-[#172B4D] group-hover:text-[#0052CC] transition-colors">{task.title}</span>
                      </div>
                      
                      {/* Interactive Status Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-bold tracking-wider px-2 py-1 rounded outline-none cursor-pointer text-center ml-4 transition-colors ${
                          task.status === 'DONE' ? 'bg-[#E3FCEF] text-[#006644] hover:bg-[#D3F9E8]' :
                          task.status === 'IN_PROGRESS' ? 'bg-[#DEEBFF] text-[#0052CC] hover:bg-[#Cce0ff]' :
                          'bg-[#DFE1E6] text-[#42526E] hover:bg-[#C1C7D0]'
                        }`}
                        style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
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
        </div>

        {/* Right Sidebar */}
        <div className="xl:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded border border-[#DFE1E6] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#5E6C84] uppercase mb-4 border-b border-[#DFE1E6] pb-2">About Project</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-[#5E6C84] text-xs mb-1">Project Lead</span>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mr-2">
                    {project.owner?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-[#172B4D]">{project.owner?.name || 'Unknown'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="block text-[#5E6C84] text-xs mb-0.5">Start Date</span>
                  <span className="text-[#172B4D]">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not Set'}</span>
                </div>
                <div>
                  <span className="block text-[#5E6C84] text-xs mb-0.5">End Date</span>
                  <span className="text-[#172B4D]">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not Set'}</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="block text-[#5E6C84] text-xs mb-2">Enabled Features</span>
                <div className="flex flex-wrap gap-2">
                  {project.features?.map(f => (
                    <span key={f.id || f.feature} className="px-2 py-1 bg-[#EBECF0] text-[#42526E] text-xs rounded font-medium">
                      {(f.feature || f).replace('_', ' ')}
                    </span>
                  ))}
                  {(!project.features || project.features.length === 0) && <span className="text-xs text-gray-400">Standard</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
