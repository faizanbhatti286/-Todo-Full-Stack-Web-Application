/**
 * TaskItem Component
 *
 * Displays an individual task with completion toggle, edit, and delete actions
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: string, currentStatus: boolean) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleToggle = async () => {
    if (!onToggleComplete || isToggling) return;

    setIsToggling(true);
    try {
      await onToggleComplete(task.id, task.is_completed);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    router.push(`/tasks/${task.id}`);
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox - minimum 44x44px touch target */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={task.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              task.is_completed
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {task.is_completed && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-medium sm:text-lg transition-all ${
              task.is_completed
                ? 'text-gray-500 line-through'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 text-sm sm:text-base line-clamp-2 transition-all ${
                task.is_completed ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <span>Created {formattedDate}</span>
            {task.is_completed && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Completed
                </span>
              </>
            )}
          </div>

          {/* Action buttons - mobile friendly */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px] sm:min-h-0 sm:py-1.5"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-0 sm:py-1.5"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            ) : (
              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-gray-600">Delete this task?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-0 sm:py-1.5"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-0 sm:py-1.5"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
