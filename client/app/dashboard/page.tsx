'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/src/lib/api';
import { Task, TasksResponse, TaskStatus, CreateTaskData, UpdateTaskData } from '@/src/types/task';
import { toast } from 'sonner';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import Navbar from '@/src/components/Navbar';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import TaskList from '@/src/components/TaskList';
import Pagination from '@/src/components/Pagination';
import TaskFormModal from '@/src/components/TaskFormModal';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (status !== 'ALL') {
        params.append('status', status);
      }

      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }

      const response = await apiFetch<TasksResponse>(`/tasks?${params.toString()}`);
      setTasks(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = (value: TaskStatus | 'ALL') => {
    setStatus(value);
    setPage(1);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = async (data: CreateTaskData | UpdateTaskData) => {
    if (editingTask) {
      await apiFetch(`/tasks/${editingTask.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      toast.success('Task updated successfully');
    } else {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Task created successfully');
    }
    fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await apiFetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleToggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;

    const newStatus = taskToUpdate.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    ));

    try {
      await apiFetch(`/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      toast.success('Task status updated');
    } catch (error: unknown) {
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, status: taskToUpdate.status } : t
      ));
      toast.error(error instanceof Error ? error.message : 'Failed to toggle task');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col bg-linear-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">My Tasks</h1>
          <SearchFilterBar
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTask}
          />
          <div className="flex-1 overflow-y-auto">
            <TaskList
              tasks={tasks}
              loading={loading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </main>
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitTask}
          task={editingTask}
        />
      </div>
    </ProtectedRoute>
  );
}
