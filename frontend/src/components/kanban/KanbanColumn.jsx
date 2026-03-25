import React from 'react';
import { useDroppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

/**
 * Kanban Column Component
 * Represents a single column in the Kanban board
 */
const KanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  onTaskEdit, 
  onTaskDelete,
  onAddTask,
  color = 'gray'
}) => {
  const { isOver, setNodeRef } = useDroppable({
    droppableId: status,
  });

  const columnColors = {
    TODO: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      header: 'bg-gray-100',
      title: 'text-gray-700',
      count: 'bg-gray-200 text-gray-700'
    },
    IN_PROGRESS: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      header: 'bg-blue-100',
      title: 'text-blue-700',
      count: 'bg-blue-200 text-blue-700'
    },
    DONE: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      header: 'bg-green-100',
      title: 'text-green-700',
      count: 'bg-green-200 text-green-700'
    }
  };

  const currentColor = columnColors[status] || columnColors.TODO;

  return (
    <div className={`
      flex-1 min-w-0 bg-white rounded-xl shadow-sm border-2
      ${currentColor.border} ${currentColor.bg}
      ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
      transition-all duration-200
    `}>
      {/* Column Header */}
      <div className={`
        px-4 py-3 border-b flex items-center justify-between
        ${currentColor.header}
      `}>
        <div className="flex items-center space-x-2">
          <h2 className={`font-semibold text-sm ${currentColor.title}`}>
            {title}
          </h2>
          <span className={`
            text-xs font-medium px-2 py-1 rounded-full
            ${currentColor.count}
          `}>
            {tasks.length}
          </span>
        </div>
        
        {/* Add Task Button */}
        <button
          onClick={() => onAddTask(status)}
          className={`
            p-1 rounded-md hover:bg-white hover:bg-opacity-60
            transition-colors duration-200
            ${currentColor.title}
          `}
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`
          p-4 min-h-[400px] transition-colors duration-200
          ${isOver ? currentColor.bg : ''}
        `}
      >
        {tasks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8">
            <div className={`
              w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center
              ${currentColor.header}
            `}>
              <Plus className={`w-8 h-8 ${currentColor.title}`} />
            </div>
            <p className={`text-sm ${currentColor.title} mb-2`}>
              No tasks in {title.toLowerCase()}
            </p>
            <button
              onClick={() => onAddTask(status)}
              className={`
                text-sm font-medium hover:underline
                ${currentColor.title}
              `}
            >
              Add your first task
            </button>
          </div>
        ) : (
          /* Task List */
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))}
          </div>
        )}
        
        {/* Drop Indicator */}
        {isOver && (
          <div className={`
            border-2 border-dashed rounded-lg p-4 text-center
            ${currentColor.border}
          `}>
            <p className={`text-sm ${currentColor.title}`}>
              Drop task here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
