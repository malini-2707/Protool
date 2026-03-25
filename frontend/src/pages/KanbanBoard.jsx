import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, RefreshCw, Settings } from 'lucide-react';
import { kanbanService } from '../services/kanbanService';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskModal from '../components/kanban/TaskModal';

/**
 * Kanban Board Page
 * Main component for the Jira-style Kanban board
 */
const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Demo project ID - in real app, this would come from URL params or context
  const projectId = 'demo-project-123';

  // Column configuration
  const columns = [
    { id: 'TODO', title: 'To Do', color: 'gray' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'blue' },
    { id: 'DONE', title: 'Done', color: 'green' }
  ];

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetch all tasks for the project
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await kanbanService.getTasks(projectId);
      
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err.error || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle drag end event
   * Updates task status when dropped in a new column
   */
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped in the same place, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the task being moved
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // If the status hasn't changed, no need to update
    if (task.status === destination.droppableId) {
      return;
    }

    try {
      setIsUpdating(true);
      
      // Update task status in backend
      const response = await kanbanService.updateTaskStatus(
        draggableId, 
        destination.droppableId
      );

      if (response.success) {
        // Update local state with the updated task
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === draggableId 
              ? { ...t, status: destination.droppableId }
              : t
          )
        );
      } else {
        setError(response.error || 'Failed to update task status');
        // Revert the change by refetching
        fetchTasks();
      }
    } catch (err) {
      setError(err.error || 'Failed to update task status');
      // Revert the change by refetching
      fetchTasks();
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle creating a new task
   */
  const handleCreateTask = async (taskData) => {
    try {
      const response = await kanbanService.createTask(taskData);
      
      if (response.success) {
        setTasks(prevTasks => [response.data, ...prevTasks]);
        setIsModalOpen(false);
      } else {
        setError(response.error || 'Failed to create task');
      }
    } catch (err) {
      setError(err.error || 'Failed to create task');
      throw err; // Re-throw to let modal handle the error
    }
  };

  /**
   * Handle updating an existing task
   */
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await kanbanService.updateTask(taskId, taskData);
      
      if (response.success) {
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId ? response.data : t
          )
        );
        setIsModalOpen(false);
        setEditingTask(null);
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (err) {
      setError(err.error || 'Failed to update task');
      throw err; // Re-throw to let modal handle the error
    }
  };

  /**
   * Handle deleting a task
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await kanbanService.deleteTask(taskId);
      
      if (response.success) {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      } else {
        setError(response.error || 'Failed to delete task');
      }
    } catch (err) {
      setError(err.error || 'Failed to delete task');
    }
  };

  /**
   * Open modal for creating a new task
   */
  const handleAddTask = (status = 'TODO') => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing an existing task
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setError(null);
  };

  /**
   * Get tasks for a specific status
   */
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Kanban board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Kanban Board
              </h1>
              <span className="text-sm text-gray-500">
                Demo Project
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Refresh Button */}
              <button
                onClick={fetchTasks}
                disabled={isUpdating}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh tasks"
              >
                <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
              
              {/* Settings Button */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Add Task Button */}
              <button
                onClick={() => handleAddTask()}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={getTasksByStatus(column.id)}
                onTaskEdit={handleEditTask}
                onTaskDelete={handleDeleteTask}
                onAddTask={handleAddTask}
                color={column.color}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projectId={projectId}
      />

      {/* Updating Indicator */}
      {isUpdating && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Updating task...
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
