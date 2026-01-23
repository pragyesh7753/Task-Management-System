'use client';

import { Task } from '@/src/types/task';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete, onToggle }: TaskItemProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className={`text-lg font-semibold ${
              task.status === 'COMPLETED' 
                ? 'text-slate-400 line-through' 
                : 'text-slate-900'
            }`}>
              {task.title}
            </h3>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {task.status === 'COMPLETED' ? '✓ Completed' : '⏳ Pending'}
            </span>
          </div>
          {task.description && (
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{task.description}</p>
          )}
          <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <span>📅</span> {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => onToggle(task.id)}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {task.status === 'COMPLETED' ? '↩ Pending' : '✓ Complete'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-rose-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-rose-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
