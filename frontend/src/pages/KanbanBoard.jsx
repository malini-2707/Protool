import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, RefreshCw, Layers } from 'lucide-react';
import { kanbanService } from '../services/kanbanService';
import { projectService } from '../services/projectService-prisma';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskModal from '../components/kanban/TaskModal';
import PageShell from '../components/PageShell';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Column configuration
  const columns = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' }
  ];

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await projectService.getUserProjects();
      if (res.success && res.data.projects.length > 0) {
        setProjects(res.data.projects);
        const firstProjId = res.data.projects[0].id;
        setSelectedProjectId(firstProjId);
        await fetchTasks(firstProjId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(err.error || 'Failed to load projects');
      setLoading(false);
    }
  };

  const fetchTasks = async (pid) => {
    try {
      setError(null);
      const response = await kanbanService.getTasks(pid);
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task || task.status === destination.droppableId) return;

    try {
      setIsUpdating(true);
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: destination.droppableId } : t));
      
      const response = await kanbanService.updateTask(draggableId, { status: destination.droppableId });
      if (!response.success) fetchTasks(selectedProjectId);
    } catch (err) {
      fetchTasks(selectedProjectId);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await kanbanService.createTask({ ...taskData, projectId: selectedProjectId });
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err) { throw err; }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await kanbanService.updateTask(taskId, taskData);
      if (response.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
        setIsModalOpen(false);
        setEditingTask(null);
      }
    } catch (err) { throw err; }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const response = await kanbanService.deleteTask(taskId);
      if (response.success) setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) { setError(err.error || 'Failed to delete task'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <PageShell breadcrumb={[{ label: 'Kanban' }]}>
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Board</h1>
            <div className="relative">
              <Layers className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <select
                value={selectedProjectId}
                onChange={(e) => { setSelectedProjectId(e.target.value); setLoading(true); fetchTasks(e.target.value); }}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900">{p.name || p.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchTasks(selectedProjectId)}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-400/20 text-rose-300 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">×</button>
          </div>
        )}

        {/* Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={tasks.filter(t => t.status === column.id)}
                onTaskEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                onTaskDelete={handleDeleteTask}
                onAddTask={(status) => { setEditingTask({ status }); setIsModalOpen(true); }}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={editingTask?.id ? handleUpdateTask : handleCreateTask}
          task={editingTask}
          projectId={selectedProjectId}
        />
      </div>
    </PageShell>
  );
};

export default KanbanBoard;
