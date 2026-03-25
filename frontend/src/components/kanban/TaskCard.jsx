import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MessageSquare, Paperclip, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative bg-slate-900 border border-white/10 rounded-xl p-4 shadow-lg
            hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all duration-200
            ${snapshot.isDragging ? 'shadow-2xl border-indigo-500 ring-2 ring-indigo-500/20' : ''}
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              task.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              task.status === 'IN_PROGRESS' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
              'bg-slate-500/10 text-slate-400 border-slate-500/20'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-indigo-400">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{task.title}</h3>
          
          {/* Description */}
          {task.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4">{task.description}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3 text-slate-600">
              <span className="flex items-center gap-1 text-[10px] font-medium"><MessageSquare className="w-3 h-3" /> 2</span>
              <span className="flex items-center gap-1 text-[10px] font-medium"><Paperclip className="w-3 h-3" /> 1</span>
            </div>
            {/* Avatar placeholder */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">
              JD
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
