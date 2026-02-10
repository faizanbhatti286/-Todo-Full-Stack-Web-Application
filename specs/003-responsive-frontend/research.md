# Research: Frontend Interface & Responsive UX

**Feature**: 003-responsive-frontend
**Date**: 2026-02-09
**Purpose**: Document technology decisions, patterns, and best practices for implementing the responsive task management frontend

---

## Research Topic 1: Next.js 16+ App Router Best Practices

### Decision: Use Client Components for Interactive Task Management

**Rationale**:
- Task list requires real-time interactivity (create, edit, delete, complete)
- Need client-side state management for optimistic updates
- Form interactions and validation require client-side JavaScript
- Server Components better suited for static content, not interactive CRUD operations

**Pattern**:
```typescript
// app/tasks/page.tsx - Client Component
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import TaskList from '@/components/tasks/TaskList';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  // ... implementation
}
```

**Alternatives Considered**:
- Server Components with Server Actions: Rejected because requires page refresh for updates, doesn't support optimistic UI
- Hybrid approach (Server + Client): Adds complexity without significant benefit for this use case

### Decision: JWT Authentication via Middleware and API Client

**Rationale**:
- Centralize authentication logic in API client
- Middleware protects routes at the edge
- Token stored in localStorage for persistence
- Automatic 401 handling and redirect

**Pattern**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  if (!token && request.nextUrl.pathname.startsWith('/tasks')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

// lib/api.ts
async function apiRequest(endpoint, options) {
  const token = getToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/signin?expired=true';
  }

  return response;
}
```

**Alternatives Considered**:
- Cookies only: Rejected because requires server-side session management
- No middleware: Rejected because allows unauthorized access before client-side check

### Decision: Loading and Error States with Suspense Boundaries

**Rationale**:
- Consistent loading UX across the application
- Error boundaries catch and display errors gracefully
- Suspense provides declarative loading states

**Pattern**:
```typescript
// app/tasks/page.tsx
<Suspense fallback={<LoadingSpinner />}>
  <TaskList />
</Suspense>

// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  // Catch errors and display user-friendly message
}
```

---

## Research Topic 2: Responsive Design Patterns

### Decision: Mobile-First Tailwind CSS with Breakpoint Strategy

**Rationale**:
- Mobile-first ensures core functionality works on smallest screens
- Tailwind provides utility classes for responsive design
- Breakpoints align with common device sizes
- Progressive enhancement for larger screens

**Breakpoint Strategy**:
- Base (default): 320px-639px (mobile)
- sm: 640px+ (large mobile/small tablet)
- md: 768px+ (tablet)
- lg: 1024px+ (desktop)
- xl: 1280px+ (large desktop)
- 2xl: 1536px+ (extra large desktop)

**Pattern**:
```typescript
// Mobile-first responsive classes
<div className="
  grid grid-cols-1           // Mobile: single column
  md:grid-cols-2             // Tablet: two columns
  lg:grid-cols-3             // Desktop: three columns
  gap-4                      // Consistent spacing
  p-4 md:p-6 lg:p-8         // Progressive padding
">
  {tasks.map(task => <TaskItem key={task.id} task={task} />)}
</div>
```

**Alternatives Considered**:
- Desktop-first: Rejected because harder to scale down than scale up
- CSS-in-JS (styled-components): Rejected because Tailwind is already in project
- Custom media queries: Rejected because Tailwind provides better consistency

### Decision: Touch-Friendly Interactions (44x44px Minimum)

**Rationale**:
- Apple and Google recommend 44x44px minimum touch targets
- Prevents accidental taps on mobile devices
- Improves accessibility for users with motor impairments

**Pattern**:
```typescript
// Button component with touch-friendly sizing
<button className="
  min-h-[44px] min-w-[44px]  // Minimum touch target
  px-4 py-2                   // Comfortable padding
  text-base                   // Readable text size
  rounded-lg                  // Rounded corners
  active:scale-95             // Touch feedback
  transition-transform        // Smooth animation
">
  {children}
</button>
```

### Decision: Responsive Form Design with Adaptive Layouts

**Rationale**:
- Forms should be easy to fill on mobile (single column)
- Desktop can show side-by-side fields for efficiency
- Labels above inputs on mobile, inline on desktop

**Pattern**:
```typescript
<form className="
  flex flex-col              // Mobile: stack vertically
  md:flex-row md:gap-4       // Desktop: horizontal layout
  space-y-4 md:space-y-0     // Vertical spacing on mobile only
">
  <Input label="Title" className="flex-1" />
  <Input label="Description" className="flex-1" />
</form>
```

---

## Research Topic 3: State Management for Task Operations

### Decision: Local State with Optimistic Updates

**Rationale**:
- Simple state management for CRUD operations
- Optimistic updates provide instant feedback
- Rollback on error maintains data consistency
- No need for complex state management library (Redux, Zustand) for this scope

**Pattern**:
```typescript
const [tasks, setTasks] = useState<Task[]>([]);

// Optimistic create
const createTask = async (newTask: TaskCreateRequest) => {
  const tempId = `temp-${Date.now()}`;
  const optimisticTask = { ...newTask, id: tempId, is_completed: false };

  // Immediately update UI
  setTasks(prev => [...prev, optimisticTask]);

  try {
    const createdTask = await api.post('/tasks', newTask);
    // Replace temp task with real task
    setTasks(prev => prev.map(t => t.id === tempId ? createdTask : t));
  } catch (error) {
    // Rollback on error
    setTasks(prev => prev.filter(t => t.id !== tempId));
    showError('Failed to create task');
  }
};
```

**Alternatives Considered**:
- React Query / SWR: Rejected because adds dependency and complexity for simple CRUD
- Redux: Rejected because overkill for this feature scope
- Server state only: Rejected because no optimistic updates, poor UX

### Decision: Error Recovery with Rollback Strategy

**Rationale**:
- Failed operations should revert UI to previous state
- User should see clear error message
- Preserve user input for retry

**Pattern**:
```typescript
const updateTask = async (id: string, updates: Partial<Task>) => {
  const previousTasks = [...tasks];

  // Optimistic update
  setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

  try {
    await api.patch(`/tasks/${id}`, updates);
  } catch (error) {
    // Rollback to previous state
    setTasks(previousTasks);
    showError('Failed to update task. Please try again.');
  }
};
```

---

## Research Topic 4: API Integration with JWT

### Decision: Centralized API Client with Automatic Token Handling

**Rationale**:
- Single source of truth for API requests
- Automatic token attachment to all requests
- Centralized error handling (401, 403, network errors)
- Easy to mock for testing

**Pattern**:
```typescript
// lib/api.ts
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin?expired=true';
      }
      throw new Error('Your session has expired. Please sign in again.');
    }

    // Handle other errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
```

**Alternatives Considered**:
- Axios: Rejected because fetch is native and sufficient
- Manual token handling per request: Rejected because error-prone and repetitive
- No centralized client: Rejected because leads to inconsistent error handling

### Decision: Request Timeout and Retry Strategy

**Rationale**:
- Prevent indefinite waiting on slow networks
- Retry transient failures automatically
- Give up after reasonable attempts

**Pattern**:
```typescript
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw error;
  }
};

// Retry logic for transient failures
const retryRequest = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## Research Topic 5: Form Validation and UX

### Decision: Client-Side Validation with Immediate Feedback

**Rationale**:
- Instant feedback improves UX
- Reduces unnecessary API calls
- Validates before submission
- Server-side validation still required for security

**Pattern**:
```typescript
const validateTaskForm = (values: TaskFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title || values.title.trim() === '') {
    errors.title = 'Title is required';
  }

  if (values.title && values.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }

  if (values.description && values.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less';
  }

  return errors;
};

// In component
const [errors, setErrors] = useState<FormErrors>({});

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const validationErrors = validateTaskForm(formValues);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // Proceed with submission
  await createTask(formValues);
};
```

**Alternatives Considered**:
- Form libraries (Formik, React Hook Form): Rejected because adds dependency for simple forms
- No client-side validation: Rejected because poor UX (wait for server response)
- Schema validation (Zod, Yup): Rejected because overkill for simple validation rules

### Decision: Loading States with Button Disable

**Rationale**:
- Prevents duplicate submissions
- Provides visual feedback that action is in progress
- Improves perceived performance

**Pattern**:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await createTask(formValues);
    onSuccess();
  } catch (error) {
    setError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    {/* form fields */}
    <Button
      type="submit"
      disabled={isSubmitting}
      className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
    >
      {isSubmitting ? 'Creating...' : 'Create Task'}
    </Button>
  </form>
);
```

### Decision: Toast Notifications for Success/Error Messages

**Rationale**:
- Non-intrusive feedback
- Auto-dismiss for success (3 seconds)
- Persistent for errors (manual dismiss)
- Consistent UX across all operations

**Pattern**:
```typescript
// Toast context for global access
const ToastContext = createContext<ToastContextType>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// Usage in components
const { showToast } = useToast();

const createTask = async (data: TaskCreateRequest) => {
  try {
    await api.post('/tasks', data);
    showToast('Task created successfully', 'success');
  } catch (error) {
    showToast('Failed to create task. Please try again.', 'error');
  }
};
```

---

## Summary of Key Decisions

| Decision Area | Choice | Rationale |
|--------------|--------|-----------|
| Component Type | Client Components | Interactive CRUD requires client-side state |
| Authentication | JWT via API client + Middleware | Centralized, secure, automatic handling |
| State Management | Local state with optimistic updates | Simple, fast UX, no external library needed |
| Responsive Design | Mobile-first Tailwind CSS | Progressive enhancement, consistent utilities |
| API Client | Centralized class with error handling | DRY, consistent, easy to test |
| Form Validation | Client-side with immediate feedback | Better UX, reduces API calls |
| Error Handling | Toast notifications + rollback | Non-intrusive, maintains data consistency |
| Loading States | Button disable + spinners | Prevents duplicates, clear feedback |

---

## Implementation Priorities

1. **Phase 1 (P1)**: View Task List - Foundation for all features
2. **Phase 2 (P2)**: Create Task - Core functionality
3. **Phase 3 (P3)**: Mark Complete - Essential task management
4. **Phase 4 (P4)**: Edit Task - Data maintenance
5. **Phase 5 (P5)**: Delete Task - Cleanup capability
6. **Phase 6 (P6)**: Responsive Design - Universal accessibility
7. **Phase 7 (P7)**: Error Handling - Professional polish

Each phase builds on the previous, ensuring incremental delivery of value.

---

## References

- Next.js 16+ App Router Documentation: https://nextjs.org/docs/app
- Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design
- React Best Practices: https://react.dev/learn
- Web Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Touch Target Sizes: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
