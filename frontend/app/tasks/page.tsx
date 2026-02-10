/**
 * Tasks Page
 *
 * Protected page displaying user's task list with create functionality
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { taskAPI, APIError } from '@/lib/api';
import { Task } from '@/lib/types';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useToast } from '@/lib/toast';

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
          // Handle 401 Unauthorized - redirect to login
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

  // Handle task creation with optimistic update
  const handleCreateTask = async (title: string, description: string) => {
    if (!user) return;

    // Create temporary task for optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      user_id: user.id,
      title,
      description: description || '',
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update: immediately add task to UI
    setTasks((prev) => [tempTask, ...prev]);
    setShowCreateForm(false);

    try {
      // Create task via API in background
      const task = await taskAPI.createTask(user.id, {
        title,
        description,
      });

      // Replace temporary task with real task from server
      setTasks((prev) => prev.map((t) => (t.id === tempId ? task : t)));

      // Show success toast
      showToast('Task created successfully!', 'success');
    } catch (err) {
      // Rollback: remove temporary task on error
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setShowCreateForm(true); // Reopen form so user can retry

      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to create task. Please try again.', 'error');
      }
      throw err; // Re-throw to let form handle it
    }
  };

  // Handle task completion toggle with optimistic update
  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    if (!user) return;

    // Store previous state for rollback
    const previousTasks = [...tasks];

    // Optimistic update: immediately toggle the task status
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: !currentStatus }
          : task
      )
    );

    try {
      // Call API to update task
      await taskAPI.updateTask(user.id, taskId, {
        is_completed: !currentStatus,
      });
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);

      // Show error toast
      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to update task. Please try again.', 'error');
      }

      throw err;
    }
  };

  // Handle task deletion with optimistic update
  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    // Store previous state for rollback
    const previousTasks = [...tasks];

    // Optimistic update: immediately remove task from list
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      // Call API to delete task
      await taskAPI.deleteTask(user.id, taskId);

      // Show success toast
      showToast('Task deleted successfully!', 'success');
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);

      // Show error toast
      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to delete task. Please try again.', 'error');
      }

      throw err;
    }
  };

  // Show loading spinner during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-2 text-gray-600">
              Manage your tasks and stay organized
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px] font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {showCreateForm ? 'Cancel' : 'Create Task'}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Task
            </h2>
            <TaskForm
              mode="create"
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
}
