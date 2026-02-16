'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { taskAPI, APIError } from '@/lib/api';
import { Task } from '@/lib/types';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useToast } from '@/lib/toast';
import { AuthFooter } from '@/components/AuthFooter';

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Authentication check and redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const tasks = await taskAPI.getTasks(user.id);
        setTasks(tasks);
      } catch (err) {
        if (err instanceof APIError) {
          if (err.status === 401) {
            router.push('/login');
            return;
          }
          setError(err.message);
        } else {
          setError('Failed to load tasks. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, router]);

  // Memoized filtered tasks for performance
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return tasks;
    if (activeFilter === 'pending') return tasks.filter(t => !t.is_completed);
    if (activeFilter === 'completed') return tasks.filter(t => t.is_completed);
    return tasks;
  }, [tasks, activeFilter]);

  // Memoized counters
  const taskCounts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => !t.is_completed).length,
    completed: tasks.filter(t => t.is_completed).length,
  }), [tasks]);

  // Handle task creation with optimistic update
  const handleCreateTask = async (title: string, description: string, category: string) => {
    if (!user) return;

    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      user_id: user.id,
      title,
      description: description || '',
      is_completed: false,
      category: category || 'general',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [tempTask, ...prev]);
    setShowCreateForm(false);

    try {
      const task = await taskAPI.createTask(user.id, { title, description, category });
      setTasks((prev) => prev.map((t) => (t.id === tempId ? task : t)));
      showToast('Task created successfully!', 'success');
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setShowCreateForm(true);
      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to create task. Please try again.', 'error');
      }
      throw err;
    }
  };

  // Handle task completion toggle
  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    if (!user) return;

    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, is_completed: !currentStatus } : task
      )
    );

    try {
      await taskAPI.updateTask(user.id, taskId, { is_completed: !currentStatus });
    } catch (err) {
      setTasks(previousTasks);
      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to update task. Please try again.', 'error');
      }
      throw err;
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      await taskAPI.deleteTask(user.id, taskId);
      showToast('Task deleted successfully!', 'success');
    } catch (err) {
      setTasks(previousTasks);
      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to delete task. Please try again.', 'error');
      }
      throw err;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Task Counters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
              <p className="mt-2 text-gray-600">
                Manage your tasks and stay organized
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-11 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showCreateForm ? 'Cancel' : 'Create Task'}
            </button>
          </div>

          {/* Task Counters */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-gray-900">{taskCounts.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
              <div className="text-2xl font-bold text-red-600">{taskCounts.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
              <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-2 flex gap-2">
          {[
            { value: 'all', label: 'All Tasks' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value as 'all' | 'pending' | 'completed')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === filter.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {showCreateForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6 animate-slideDown">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>
            <TaskForm mode="create" onSubmit={handleCreateTask} onCancel={() => setShowCreateForm(false)} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md ${
                  task.is_completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <button
                    onClick={() => handleToggleComplete(task.id, task.is_completed)}
                    className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {task.is_completed ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">✔️</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">❌</span>
                      </div>
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-medium ${
                        task.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`mt-1 text-sm ${task.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {task.category && task.category !== 'general' && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {task.category}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          task.is_completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {task.is_completed ? '✔️ Completed' : '❌ Pending'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
