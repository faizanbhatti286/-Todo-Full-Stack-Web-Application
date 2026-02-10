# Data Model: Frontend Interface & Responsive UX

**Feature**: 003-responsive-frontend
**Date**: 2026-02-09
**Purpose**: Define frontend state structures, component interfaces, and data types

---

## Frontend State Structures

### Task Entity

Represents a todo item in the frontend application.

```typescript
interface Task {
  id: string;                    // UUID from backend
  title: string;                 // Required, max 200 characters
  description: string | null;    // Optional, max 1000 characters
  is_completed: boolean;         // Completion status
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
  user_id: string;               // Owner UUID (for reference)
}
```

**Validation Rules**:
- `title`: Required, non-empty after trim, max 200 characters
- `description`: Optional, max 1000 characters if provided
- `is_completed`: Boolean, defaults to false for new tasks
- All IDs are UUIDs in string format

**State Transitions**:
- New → Incomplete (is_completed: false)
- Incomplete → Complete (is_completed: true)
- Complete → Incomplete (is_completed: false)
- Any state → Deleted (removed from list)

### Task List State

Represents the collection of tasks and their loading state.

```typescript
interface TaskListState {
  tasks: Task[];                 // Array of task objects
  loading: boolean;              // True during initial fetch
  error: string | null;          // Error message if fetch fails
  lastFetched: Date | null;      // Timestamp of last successful fetch
}
```

**Operations**:
- `fetchTasks()`: Load all tasks from API
- `addTask(task: Task)`: Add new task to list
- `updateTask(id: string, updates: Partial<Task>)`: Update existing task
- `removeTask(id: string)`: Remove task from list
- `toggleComplete(id: string)`: Toggle task completion status

### Form State

Represents the state of create/edit task forms.

```typescript
interface TaskFormState {
  values: TaskFormValues;        // Current form values
  errors: TaskFormErrors;        // Validation errors
  touched: TaskFormTouched;      // Fields that have been interacted with
  isSubmitting: boolean;         // True during API submission
  mode: 'create' | 'edit';       // Form mode
}

interface TaskFormValues {
  title: string;
  description: string;
}

interface TaskFormErrors {
  title?: string;
  description?: string;
}

interface TaskFormTouched {
  title: boolean;
  description: boolean;
}
```

**Validation Rules**:
- Show errors only for touched fields
- Validate on blur and on submit
- Clear errors when field is corrected

### UI State

Represents global UI state for modals, toasts, and loading indicators.

```typescript
interface UIState {
  modals: {
    createTask: boolean;         // Create task modal open
    editTask: string | null;     // Edit task modal open (task ID)
    deleteConfirm: string | null; // Delete confirmation (task ID)
  };
  toasts: Toast[];               // Active toast notifications
  globalLoading: boolean;        // Global loading indicator
}

interface Toast {
  id: string;                    // Unique toast ID
  message: string;               // Toast message
  type: 'success' | 'error' | 'info'; // Toast type
  duration: number;              // Auto-dismiss duration (ms)
  dismissible: boolean;          // Can be manually dismissed
}
```

---

## Component Prop Interfaces

### TaskList Component

```typescript
interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onCreateClick: () => void;
  onTaskUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  onTaskToggle: (id: string) => Promise<void>;
}
```

### TaskItem Component

```typescript
interface TaskItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isUpdating?: boolean;          // Show loading state
}
```

### TaskForm Component

```typescript
interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
```

### EmptyState Component

```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

### DeleteConfirmDialog Component

```typescript
interface DeleteConfirmDialogProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}
```

---

## UI Component Interfaces

### Button Component

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

### Input Component

```typescript
interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  className?: string;
}
```

### Checkbox Component

```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}
```

### Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}
```

### Toast Component

```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
  duration?: number;
  dismissible?: boolean;
}
```

### LoadingSpinner Component

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

---

## API Request/Response Types

### Task API Types

```typescript
// GET /tasks - Response
type GetTasksResponse = Task[];

// POST /tasks - Request
interface CreateTaskRequest {
  title: string;
  description?: string;
}

// POST /tasks - Response
type CreateTaskResponse = Task;

// PATCH /tasks/{id} - Request
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

// PATCH /tasks/{id} - Response
type UpdateTaskResponse = Task;

// DELETE /tasks/{id} - Response
// 204 No Content (no response body)

// Error Response (all endpoints)
interface ErrorResponse {
  detail: string;
}
```

### Authentication Types (existing, for reference)

```typescript
interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

interface SigninRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
}
```

---

## Validation Rules

### Task Title Validation

```typescript
const validateTitle = (title: string): string | undefined => {
  if (!title || title.trim() === '') {
    return 'Title is required';
  }
  if (title.length > 200) {
    return 'Title must be 200 characters or less';
  }
  return undefined;
};
```

### Task Description Validation

```typescript
const validateDescription = (description: string): string | undefined => {
  if (description && description.length > 1000) {
    return 'Description must be 1000 characters or less';
  }
  return undefined;
};
```

### Form Validation

```typescript
const validateTaskForm = (values: TaskFormValues): TaskFormErrors => {
  const errors: TaskFormErrors = {};

  const titleError = validateTitle(values.title);
  if (titleError) {
    errors.title = titleError;
  }

  const descriptionError = validateDescription(values.description);
  if (descriptionError) {
    errors.description = descriptionError;
  }

  return errors;
};
```

---

## State Management Patterns

### Optimistic Update Pattern

```typescript
// Pattern for optimistic updates with rollback
const optimisticUpdate = async <T>(
  updateFn: () => Promise<T>,
  optimisticState: () => void,
  rollbackState: () => void,
  onSuccess?: (result: T) => void,
  onError?: (error: Error) => void
) => {
  // Apply optimistic update
  optimisticState();

  try {
    // Perform API call
    const result = await updateFn();
    // Call success callback if provided
    onSuccess?.(result);
    return result;
  } catch (error) {
    // Rollback on error
    rollbackState();
    // Call error callback if provided
    onError?.(error as Error);
    throw error;
  }
};
```

### Usage Example

```typescript
const toggleTaskComplete = async (taskId: string) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const previousTasks = [...tasks];
  const updatedTask = { ...task, is_completed: !task.is_completed };

  await optimisticUpdate(
    // API call
    () => api.patch(`/tasks/${taskId}`, { is_completed: updatedTask.is_completed }),
    // Optimistic state
    () => setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t)),
    // Rollback state
    () => setTasks(previousTasks),
    // Success callback
    () => showToast('Task updated successfully', 'success'),
    // Error callback
    () => showToast('Failed to update task', 'error')
  );
};
```

---

## Data Flow Diagram

```
User Action → Component Event Handler → State Update (Optimistic)
                                              ↓
                                         API Request
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              Success               Error
                                    ↓                   ↓
                          Confirm State         Rollback State
                                    ↓                   ↓
                          Show Success Toast   Show Error Toast
```

---

## Type Exports

All types should be exported from centralized type files:

```typescript
// types/task.ts
export type {
  Task,
  TaskListState,
  TaskFormState,
  TaskFormValues,
  TaskFormErrors,
  TaskFormTouched,
};

// types/api.ts
export type {
  GetTasksResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  ErrorResponse,
};

// types/ui.ts
export type {
  UIState,
  Toast,
  ButtonProps,
  InputProps,
  CheckboxProps,
  ModalProps,
  ToastProps,
  LoadingSpinnerProps,
};
```

---

## Summary

This data model defines:
- **4 core state structures**: Task, TaskListState, TaskFormState, UIState
- **6 component prop interfaces**: TaskList, TaskItem, TaskForm, EmptyState, DeleteConfirmDialog, and UI components
- **8 API request/response types**: Covering all CRUD operations
- **Validation rules**: For title and description fields
- **State management patterns**: Optimistic updates with rollback

All types are strongly typed with TypeScript for type safety and better developer experience.
