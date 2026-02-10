# Component Contracts: Frontend Interface & Responsive UX

**Feature**: 003-responsive-frontend
**Date**: 2026-02-09
**Purpose**: Define component interfaces, props, behaviors, and integration specifications

---

## Overview

This document specifies the contract for all React components in the task management frontend. Each component has defined props, behaviors, and responsibilities to ensure consistent implementation and easy testing.

---

## Task Management Components

### TaskList Component

**Purpose**: Container component that displays a list of tasks with loading and error states.

**Location**: `src/components/tasks/TaskList.tsx`

**Props**:
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

**Behavior**:
- Display loading spinner when `loading` is true
- Display error message when `error` is not null
- Display empty state when `tasks` is empty array and not loading
- Display task items when `tasks` has items
- Provide "Create Task" button that calls `onCreateClick`
- Pass event handlers to child TaskItem components
- Handle responsive layout (grid on desktop, list on mobile)

**Acceptance Criteria**:
- Shows loading spinner during initial fetch
- Shows error message on fetch failure
- Shows empty state when no tasks exist
- Renders all tasks in the array
- Create button is always visible and accessible
- Responsive layout adapts to screen size

**Example Usage**:
```typescript
<TaskList
  tasks={tasks}
  loading={isLoading}
  error={error}
  onCreateClick={() => setShowCreateModal(true)}
  onTaskUpdate={handleUpdateTask}
  onTaskDelete={handleDeleteTask}
  onTaskToggle={handleToggleTask}
/>
```

---

### TaskItem Component

**Purpose**: Display a single task with interactive controls for edit, delete, and completion toggle.

**Location**: `src/components/tasks/TaskItem.tsx`

**Props**:
```typescript
interface TaskItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isUpdating?: boolean;
}
```

**Behavior**:
- Display task title prominently
- Display task description if present
- Show completion checkbox
- Show edit and delete buttons
- Apply completed styling (strikethrough) when `task.is_completed` is true
- Disable interactions when `isUpdating` is true
- Show loading indicator when `isUpdating` is true
- Call appropriate handler on user interaction

**Acceptance Criteria**:
- Title and description are clearly visible
- Completed tasks have visual distinction (strikethrough, checkmark)
- Checkbox toggles completion status
- Edit button opens edit form
- Delete button shows confirmation dialog
- All buttons meet 44x44px touch target minimum
- Responsive layout on mobile and desktop

**Example Usage**:
```typescript
<TaskItem
  task={task}
  onEdit={(id) => openEditModal(id)}
  onDelete={(id) => openDeleteDialog(id)}
  onToggleComplete={(id) => toggleTaskComplete(id)}
  isUpdating={updatingTaskId === task.id}
/>
```

---

### TaskForm Component

**Purpose**: Reusable form for creating and editing tasks with validation.

**Location**: `src/components/tasks/TaskForm.tsx`

**Props**:
```typescript
interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface TaskFormValues {
  title: string;
  description: string;
}
```

**Behavior**:
- Pre-fill form with `initialValues` in edit mode
- Validate title is not empty on submit
- Validate title length (max 200 characters)
- Validate description length (max 1000 characters)
- Show validation errors inline
- Disable submit button when `isSubmitting` is true
- Show loading state on submit button when `isSubmitting` is true
- Call `onSubmit` with form values on valid submission
- Call `onCancel` when cancel button clicked
- Prevent form submission on Enter key in description field

**Acceptance Criteria**:
- Form fields are pre-filled in edit mode
- Validation errors appear immediately on submit
- Submit button disabled during submission
- Cancel button always enabled
- Form clears after successful submission (create mode)
- Responsive layout on mobile and desktop
- Touch-friendly input fields on mobile

**Example Usage**:
```typescript
// Create mode
<TaskForm
  mode="create"
  onSubmit={handleCreateTask}
  onCancel={() => setShowModal(false)}
  isSubmitting={isCreating}
/>

// Edit mode
<TaskForm
  mode="edit"
  initialValues={{ title: task.title, description: task.description || '' }}
  onSubmit={handleUpdateTask}
  onCancel={() => setShowEditModal(false)}
  isSubmitting={isUpdating}
/>
```

---

### EmptyState Component

**Purpose**: Display a friendly message when the task list is empty.

**Location**: `src/components/tasks/EmptyState.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Behavior**:
- Display title and description centered
- Show action button if `actionLabel` and `onAction` provided
- Use friendly, encouraging messaging
- Include relevant icon or illustration
- Responsive layout

**Acceptance Criteria**:
- Message is clearly visible and centered
- Action button is prominent and accessible
- Works on all screen sizes
- Encourages user to create first task

**Example Usage**:
```typescript
<EmptyState
  title="No tasks yet"
  description="Create your first task to get started with managing your todos."
  actionLabel="Create Task"
  onAction={() => setShowCreateModal(true)}
/>
```

---

### DeleteConfirmDialog Component

**Purpose**: Confirmation dialog to prevent accidental task deletion.

**Location**: `src/components/tasks/DeleteConfirmDialog.tsx`

**Props**:
```typescript
interface DeleteConfirmDialogProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}
```

**Behavior**:
- Display modal overlay when `isOpen` is true
- Show task title in confirmation message
- Provide "Delete" and "Cancel" buttons
- Disable buttons when `isDeleting` is true
- Show loading state on Delete button when `isDeleting` is true
- Call `onConfirm` when Delete clicked
- Call `onCancel` when Cancel clicked or overlay clicked
- Close on Escape key press

**Acceptance Criteria**:
- Modal appears centered on screen
- Task title is clearly shown in message
- Delete button has danger styling (red)
- Cancel button is easily accessible
- Buttons disabled during deletion
- Modal closes on cancel or successful deletion
- Responsive on mobile and desktop

**Example Usage**:
```typescript
<DeleteConfirmDialog
  isOpen={deleteDialogOpen}
  taskTitle={taskToDelete?.title || ''}
  onConfirm={handleConfirmDelete}
  onCancel={() => setDeleteDialogOpen(false)}
  isDeleting={isDeleting}
/>
```

---

## UI Components

### Button Component

**Purpose**: Reusable button with consistent styling and variants.

**Location**: `src/components/ui/Button.tsx`

**Props**:
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

**Variants**:
- `primary`: Blue background, white text (default)
- `secondary`: Gray background, dark text
- `danger`: Red background, white text (for delete actions)
- `ghost`: Transparent background, colored text

**Sizes**:
- `sm`: Compact button (min 36px height)
- `md`: Standard button (min 44px height) - default
- `lg`: Large button (min 52px height)

**Behavior**:
- Show loading spinner when `loading` is true
- Disable interaction when `disabled` or `loading` is true
- Apply hover and active states
- Meet minimum touch target size (44x44px for md and lg)
- Support keyboard navigation (focus states)

**Example Usage**:
```typescript
<Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
  Create Task
</Button>

<Button variant="danger" onClick={handleDelete} disabled={!canDelete}>
  Delete
</Button>
```

---

### Input Component

**Purpose**: Reusable text input with label and error display.

**Location**: `src/components/ui/Input.tsx`

**Props**:
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

**Behavior**:
- Display label above input field
- Show required indicator (*) if `required` is true
- Display error message below input if `error` is provided
- Apply error styling (red border) when error exists
- Call `onChange` with new value on input change
- Call `onBlur` when input loses focus
- Enforce `maxLength` if provided
- Disable input when `disabled` is true

**Acceptance Criteria**:
- Label is clearly associated with input
- Error messages are visible and descriptive
- Input is appropriately sized for touch on mobile
- Placeholder text is visible but not confused with value
- Required indicator is clear

**Example Usage**:
```typescript
<Input
  label="Task Title"
  name="title"
  value={formValues.title}
  onChange={(value) => setFormValues({ ...formValues, title: value })}
  onBlur={() => validateField('title')}
  error={errors.title}
  required
  maxLength={200}
  placeholder="Enter task title"
/>
```

---

### Checkbox Component

**Purpose**: Reusable checkbox for task completion toggle.

**Location**: `src/components/ui/Checkbox.tsx`

**Props**:
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}
```

**Behavior**:
- Display checkbox with checkmark when `checked` is true
- Call `onChange` with new state when clicked
- Display label next to checkbox if provided
- Disable interaction when `disabled` is true
- Meet minimum touch target size (44x44px)
- Support keyboard navigation (Space to toggle)

**Acceptance Criteria**:
- Checkbox is clearly visible and accessible
- Checkmark appears immediately on click
- Touch target is large enough for mobile
- Works with keyboard navigation
- Label is clickable to toggle checkbox

**Example Usage**:
```typescript
<Checkbox
  checked={task.is_completed}
  onChange={(checked) => handleToggleComplete(task.id)}
  label="Mark as complete"
/>
```

---

### Modal Component

**Purpose**: Reusable modal dialog for forms and confirmations.

**Location**: `src/components/ui/Modal.tsx`

**Props**:
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

**Sizes**:
- `sm`: 400px max width
- `md`: 600px max width (default)
- `lg`: 800px max width
- `xl`: 1000px max width

**Behavior**:
- Display modal centered on screen when `isOpen` is true
- Show overlay behind modal
- Display title in header
- Render `children` in body
- Render `footer` if provided
- Call `onClose` when close button clicked
- Call `onClose` when overlay clicked (if `closeOnOverlayClick` is true)
- Call `onClose` when Escape key pressed
- Prevent body scroll when modal is open
- Trap focus within modal
- Responsive on mobile (full screen on small devices)

**Acceptance Criteria**:
- Modal appears centered and prominent
- Overlay dims background content
- Close button is clearly visible
- Modal is scrollable if content exceeds viewport
- Works on all screen sizes
- Keyboard accessible (Tab, Escape)

**Example Usage**:
```typescript
<Modal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  title="Create New Task"
  size="md"
  closeOnOverlayClick={false}
>
  <TaskForm
    mode="create"
    onSubmit={handleCreateTask}
    onCancel={() => setShowCreateModal(false)}
    isSubmitting={isCreating}
  />
</Modal>
```

---

### Toast Component

**Purpose**: Non-intrusive notification for success and error messages.

**Location**: `src/components/ui/Toast.tsx`

**Props**:
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
  duration?: number;
  dismissible?: boolean;
}
```

**Types**:
- `success`: Green background, checkmark icon
- `error`: Red background, error icon
- `info`: Blue background, info icon

**Behavior**:
- Display toast at top-right of screen (desktop) or top of screen (mobile)
- Auto-dismiss after `duration` milliseconds (default: 3000 for success, manual for error)
- Show close button if `dismissible` is true
- Call `onDismiss` when dismissed
- Animate in from top
- Animate out when dismissed
- Stack multiple toasts vertically

**Acceptance Criteria**:
- Toast is clearly visible but not intrusive
- Success toasts auto-dismiss after 3 seconds
- Error toasts require manual dismissal
- Close button is accessible
- Works on all screen sizes
- Multiple toasts stack properly

**Example Usage**:
```typescript
// Success toast (auto-dismiss)
<Toast
  message="Task created successfully"
  type="success"
  onDismiss={() => removeToast(toast.id)}
  duration={3000}
  dismissible={true}
/>

// Error toast (manual dismiss)
<Toast
  message="Failed to create task. Please try again."
  type="error"
  onDismiss={() => removeToast(toast.id)}
  dismissible={true}
/>
```

---

### LoadingSpinner Component

**Purpose**: Visual indicator for loading states.

**Location**: `src/components/ui/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

**Sizes**:
- `sm`: 16px diameter
- `md`: 24px diameter (default)
- `lg`: 48px diameter

**Behavior**:
- Display animated spinning circle
- Use provided color or default theme color
- Center within parent container
- Accessible (aria-label="Loading")

**Example Usage**:
```typescript
// Full page loading
<div className="flex items-center justify-center h-screen">
  <LoadingSpinner size="lg" />
</div>

// Button loading
<Button loading={isSubmitting}>
  {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : 'Submit'}
</Button>
```

---

## Layout Components

### Header Component

**Purpose**: Application header with navigation and user info.

**Location**: `src/components/layout/Header.tsx`

**Props**:
```typescript
interface HeaderProps {
  user?: {
    email: string;
  };
  onSignout: () => void;
}
```

**Behavior**:
- Display app logo/title
- Show user email if authenticated
- Provide signout button
- Responsive (hamburger menu on mobile)
- Sticky at top of page

**Example Usage**:
```typescript
<Header
  user={{ email: 'user@example.com' }}
  onSignout={handleSignout}
/>
```

---

### Container Component

**Purpose**: Responsive container for page content.

**Location**: `src/components/layout/Container.tsx`

**Props**:
```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}
```

**Behavior**:
- Center content horizontally
- Apply responsive max-width
- Add horizontal padding
- Responsive breakpoints:
  - Mobile: 100% width with 16px padding
  - Tablet: 768px max width
  - Desktop: 1200px max width

**Example Usage**:
```typescript
<Container>
  <TaskList tasks={tasks} {...handlers} />
</Container>
```

---

## Component Integration Patterns

### Parent-Child Communication

**Pattern**: Props down, events up
```typescript
// Parent component
function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    // Update logic
  };

  return (
    <TaskList
      tasks={tasks}
      onTaskUpdate={handleUpdateTask}
      // ... other props
    />
  );
}

// Child component
function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={(id) => onTaskUpdate(id, { is_completed: !task.is_completed })}
        />
      ))}
    </div>
  );
}
```

### State Management Pattern

**Pattern**: Lift state to common ancestor
```typescript
// Page component manages all state
function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // All handlers defined here
  const handleCreateTask = async (values: TaskFormValues) => { /* ... */ };
  const handleUpdateTask = async (id: string, updates: Partial<Task>) => { /* ... */ };
  const handleDeleteTask = async (id: string) => { /* ... */ };

  // Pass state and handlers to children
  return (
    <>
      <TaskList tasks={tasks} onCreateClick={() => setShowCreateModal(true)} {...handlers} />
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <TaskForm mode="create" onSubmit={handleCreateTask} {...props} />
      </Modal>
    </>
  );
}
```

---

## Testing Contracts

### Component Testing Pattern

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskItem from '@/components/tasks/TaskItem';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    is_completed: false,
    created_at: '2026-02-09T00:00:00Z',
    updated_at: '2026-02-09T00:00:00Z',
    user_id: 'user-1'
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onToggleComplete: jest.fn()
  };

  it('renders task information', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onToggleComplete when checkbox clicked', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith('1');
  });

  it('calls onEdit when edit button clicked', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1');
  });
});
```

---

## Summary

This contract defines:
- **5 task management components**: TaskList, TaskItem, TaskForm, EmptyState, DeleteConfirmDialog
- **6 UI components**: Button, Input, Checkbox, Modal, Toast, LoadingSpinner
- **2 layout components**: Header, Container
- **Component props and behaviors**: Clear interfaces for all components
- **Integration patterns**: Parent-child communication and state management
- **Testing contracts**: Consistent testing approach for all components

All implementations must adhere to these contracts to ensure consistent behavior and easy integration.
