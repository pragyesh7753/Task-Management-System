'use client';

import { Task } from '@/src/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskList({ tasks, loading, onEdit, onDelete, onToggle }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gradient-to-r from-slate-200 to-slate-100"></div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 py-16">
        <div className="rounded-full bg-slate-200 p-4">
          <svg
            className="h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="mt-6 text-lg font-semibold text-slate-900">No tasks found</p>
        <p className="mt-2 text-sm text-slate-500">Get started by creating a new task</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
