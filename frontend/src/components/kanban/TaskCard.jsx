import React from 'react';
import { useDraggable } from '@hello-pangea/dnd';
import { Clock, Edit2, Trash2 } from 'lucide-react';

/**
 * Task Card Component
 * Displays individual task information with drag functionality
 */
const TaskCard = ({ task, index, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDraggable({
    id: task.id,
    index,
  });

  const statusColors = {
    TODO: 'border-gray-300 bg-gray-50',
    IN_PROGRESS: 'border-blue-300 bg-blue-50',
    DONE: 'border-green-300 bg-green-50'
  };

  const statusIcons = {
    TODO: <Clock className="w-4 h-4 text-gray-500" />,
    IN_PROGRESS: <Clock className="w-4 h-4 text-blue-500" />,
    DONE: <Clock className="w-4 h-4 text-green-500" />
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div
      ref={drag}
      className={`
        relative bg-white rounded-lg shadow-sm border-2 p-4 mb-3 
        hover:shadow-md transition-all duration-200 cursor-move
        ${statusColors[task.status] || statusColors.TODO}
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {statusIcons[task.status]}
          <span className={`
            text-xs font-semibold px-2 py-1 rounded-full
            ${task.status === 'TODO' ? 'bg-gray-200 text-gray-700' : ''}
            ${task.status === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-700' : ''}
            ${task.status === 'DONE' ? 'bg-green-200 text-green-700' : ''}
          `}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit task"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Created {formatDate(task.createdAt)}
        </span>
        {task.updatedAt !== task.createdAt && (
          <span>
            Updated {formatDate(task.updatedAt)}
          </span>
        )}
      </div>

      {/* Drag Handle Indicator */}
      <div className="absolute top-2 left-2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
