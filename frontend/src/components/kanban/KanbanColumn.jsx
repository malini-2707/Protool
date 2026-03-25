import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreVertical } from 'lucide-react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  onTaskEdit, 
  onTaskDelete,
  onAddTask,
}) => {
  const statusColors = {
    TODO: 'border-slate-800 bg-slate-900/40 text-slate-400',
    IN_PROGRESS: 'border-indigo-900/50 bg-indigo-950/20 text-indigo-400',
    DONE: 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400',
  };

  const headerColors = {
    TODO: 'bg-slate-800/40',
    IN_PROGRESS: 'bg-indigo-500/10',
    DONE: 'bg-emerald-500/10',
  };

  return (
    <div className={`flex-1 min-w-[320px] max-w-[400px] flex flex-col h-full rounded-2xl border ${statusColors[status].split(' ')[0]} ${statusColors[status].split(' ')[1]}`}>
      {/* Column Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${statusColors[status].split(' ')[0]} ${headerColors[status]}`}>
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider">{title}</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onAddTask(status)} className="p-1 hover:bg-white/5 rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white/5 rounded transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-3 flex-1 overflow-y-auto min-h-[500px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}
          >
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
              {provided.placeholder}
            </div>

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={() => onAddTask(status)}
                className="w-full py-6 mt-2 border-2 border-dashed border-white/5 rounded-xl text-slate-600 hover:text-slate-400 hover:border-white/10 hover:bg-white/[0.02] flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Add task</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
