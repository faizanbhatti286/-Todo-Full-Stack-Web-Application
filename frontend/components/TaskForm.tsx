/**
 * TaskForm Component
 *
 * Form for creating and editing tasks with validation
 */

'use client';

import { useState, FormEvent } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface TaskFormProps {
  mode?: 'create' | 'edit';
  initialTitle?: string;
  initialDescription?: string;
  initialCategory?: string;
  onSubmit: (title: string, description: string, category: string) => Promise<void>;
  onCancel?: () => void;
}

export default function TaskForm({
  mode = 'create',
  initialTitle = '',
  initialDescription = '',
  initialCategory = 'general',
  onSubmit,
  onCancel
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { title?: string; description?: string; category?: string } = {};

    // Title validation: required, 1-200 characters
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length < 1 || title.length > 200) {
      errors.title = 'Title must be between 1 and 200 characters';
    }

    // Description validation: max 1000 characters
    if (description.length > 1000) {
      errors.description = 'Description must not exceed 1000 characters';
    }

    // Category validation: max 50 characters
    if (category.length > 50) {
      errors.category = 'Category must not exceed 50 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(title.trim(), description.trim(), category.trim());

      // Clear form after successful creation (only in create mode)
      if (mode === 'create') {
        setTitle('');
        setDescription('');
        setCategory('general');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save task. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
          placeholder="Enter task title"
        />
        {validationErrors.title && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/200 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
          maxLength={50}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
          placeholder="e.g., work, personal, shopping"
        />
        {validationErrors.category && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {category.length}/50 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          maxLength={1000}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base resize-none"
          placeholder="Enter task description (optional)"
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/1000 characters
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-h-[44px] flex items-center justify-center"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="border-white border-t-white/30" />
          ) : (
            mode === 'create' ? 'Create Task' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
