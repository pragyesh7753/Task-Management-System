'use client';

import { TaskStatus } from '@/src/types/task';

interface SearchFilterBarProps {
  search: string;
  status: TaskStatus | 'ALL';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | 'ALL') => void;
  onAddTask: () => void;
}

export default function SearchFilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddTask,
}: SearchFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'ALL')}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Tasks</option>
          <option value="PENDING">⏳ Pending</option>
          <option value="COMPLETED">✓ Completed</option>
        </select>
      </div>
      <button
        onClick={onAddTask}
        className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        ✨ Add Task
      </button>
    </div>
  );
}
