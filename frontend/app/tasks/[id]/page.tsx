/**
 * Task Detail/Edit Page
 *
 * Page for viewing and editing a single task
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { taskAPI, APIError } from '@/lib/api';
import { Task } from '@/lib/types';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useToast } from '@/lib/toast';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication check and redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch task when user is authenticated
  useEffect(() => {
    const fetchTask = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const task = await taskAPI.getTask(user.id, taskId);
        setTask(task);
      } catch (err) {
        if (err instanceof APIError) {
          // Handle 401 Unauthorized - redirect to login
          if (err.status === 401) {
            router.push('/login');
            return;
          }
          // Handle 404 Not Found
          if (err.status === 404) {
            setError('Task not found. It may have been deleted.');
          } else {
            setError(err.message);
          }
        } else {
          setError('Failed to load task. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && taskId) {
      fetchTask();
    }
  }, [user, taskId, router]);

  // Handle task update
  const handleUpdateTask = async (title: string, description: string) => {
    if (!user || !task) return;

    try {
      const updatedTask = await taskAPI.updateTask(user.id, task.id, {
        title,
        description,
      });

      // Update local state
      setTask(updatedTask);

      // Show success toast
      showToast('Task updated successfully!', 'success');

      // Navigate back to tasks list
      router.push('/tasks');
    } catch (err) {
      if (err instanceof APIError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to update task. Please try again.', 'error');
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
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/tasks')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Tasks
          </button>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Task</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => router.push('/tasks')}
          />
        ) : task ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <TaskForm
              mode="edit"
              initialTitle={task.title}
              initialDescription={task.description || ''}
              onSubmit={handleUpdateTask}
              onCancel={() => router.push('/tasks')}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
