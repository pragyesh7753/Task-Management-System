'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '@/src/types/task';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  task?: Task | null;
}

export default function TaskFormModal({ isOpen, onClose, onSubmit, task }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {task ? '✏️ Edit Task' : '✨ Create New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter task title"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>
          {error && <p className="mb-4 text-sm text-rose-600 font-medium">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
