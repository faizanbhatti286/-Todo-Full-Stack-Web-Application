# Quickstart Guide: Frontend Interface & Responsive UX

**Feature**: 003-responsive-frontend
**Date**: 2026-02-09
**Purpose**: Setup and development guide for the responsive task management frontend

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see specs/001-todo-web-app and specs/002-user-authentication)
- Git for version control

---

## Environment Setup

### 1. Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

**Key Dependencies**:
- Next.js 16+ (App Router)
- React 18+
- TypeScript 5.x
- Tailwind CSS
- Jest & React Testing Library (testing)
- Playwright (E2E testing)

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Secret (must match backend)
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
```

**Important**:
- `NEXT_PUBLIC_API_URL` must point to your running FastAPI backend
- `BETTER_AUTH_SECRET` must match the secret configured in the backend for JWT verification
- Never commit `.env.local` to version control

### 3. Verify Backend Connection

Ensure the backend API is running and accessible:

```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy"}
```

---

## Development Workflow

### Running the Development Server

Start the Next.js development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

**Development Features**:
- Hot module replacement (HMR) for instant updates
- Fast refresh for React components
- TypeScript type checking in real-time
- Tailwind CSS JIT compilation

### Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── tasks/              # Task management pages
│   │   │   ├── page.tsx        # Task list view
│   │   │   └── [id]/           # Task detail/edit
│   │   ├── signin/             # Authentication pages
│   │   ├── signup/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/             # Reusable components
│   │   ├── tasks/              # Task-specific components
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── DeleteConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── ui/                 # Generic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       └── Container.tsx
│   │
│   ├── lib/                    # Utilities and services
│   │   ├── api.ts              # API client with JWT auth
│   │   ├── auth.ts             # Auth utilities
│   │   └── validation.ts       # Form validation
│   │
│   ├── types/                  # TypeScript definitions
│   │   ├── task.ts             # Task types
│   │   ├── api.ts              # API types
│   │   └── ui.ts               # UI component types
│   │
│   └── styles/                 # Global styles
│       └── globals.css         # Tailwind and custom CSS
│
├── public/                     # Static assets
├── tests/                      # Test files
├── .env.local                  # Environment variables (not committed)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## Development Tasks

### Creating New Components

1. Create component file in appropriate directory:
   - Task-specific: `src/components/tasks/`
   - Generic UI: `src/components/ui/`
   - Layout: `src/components/layout/`

2. Use TypeScript for type safety:
```typescript
// src/components/tasks/TaskItem.tsx
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  // Component implementation
}
```

3. Export from index file if needed for cleaner imports

### Adding New Pages

1. Create page file in `src/app/` directory following App Router conventions
2. Use `'use client'` directive for interactive pages
3. Implement loading and error states

### Styling with Tailwind CSS

Use Tailwind utility classes for responsive design:

```typescript
<div className="
  grid grid-cols-1           // Mobile: single column
  md:grid-cols-2             // Tablet: two columns
  lg:grid-cols-3             // Desktop: three columns
  gap-4                      // Consistent spacing
  p-4 md:p-6 lg:p-8         // Progressive padding
">
  {/* Content */}
</div>
```

**Responsive Breakpoints**:
- Base: 320px-639px (mobile)
- sm: 640px+ (large mobile)
- md: 768px+ (tablet)
- lg: 1024px+ (desktop)
- xl: 1280px+ (large desktop)

---

## Testing

### Unit Tests (Jest + React Testing Library)

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

**Example Test**:
```typescript
// tests/components/tasks/TaskItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '@/components/tasks/TaskItem';

describe('TaskItem', () => {
  it('renders task title and description', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      is_completed: false,
      created_at: '2026-02-09T00:00:00Z',
      updated_at: '2026-02-09T00:00:00Z',
      user_id: 'user-1'
    };

    render(<TaskItem task={task} onEdit={jest.fn()} onDelete={jest.fn()} onToggleComplete={jest.fn()} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

Run E2E tests:

```bash
npm run test:e2e
```

Run E2E tests in UI mode:

```bash
npm run test:e2e:ui
```

**Example E2E Test**:
```typescript
// tests/e2e/task-management.spec.ts
import { test, expect } from '@playwright/test';

test('user can create and complete a task', async ({ page }) => {
  // Sign in
  await page.goto('http://localhost:3000/signin');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Create task
  await page.click('button:has-text("Create Task")');
  await page.fill('input[name="title"]', 'New Task');
  await page.fill('textarea[name="description"]', 'Task description');
  await page.click('button:has-text("Save")');

  // Verify task appears
  await expect(page.locator('text=New Task')).toBeVisible();

  // Mark complete
  await page.click('input[type="checkbox"]');
  await expect(page.locator('text=New Task')).toHaveClass(/line-through/);
});
```

---

## Building for Production

### Create Production Build

```bash
npm run build
```

This will:
- Compile TypeScript
- Optimize React components
- Generate static pages where possible
- Minify JavaScript and CSS
- Optimize images

### Run Production Server

```bash
npm run start
```

The production server will run on `http://localhost:3000`

### Production Checklist

- [ ] All environment variables configured
- [ ] Backend API accessible from production environment
- [ ] HTTPS enabled for production
- [ ] CORS configured correctly on backend
- [ ] Error tracking configured (optional)
- [ ] Performance monitoring configured (optional)

---

## Common Issues and Troubleshooting

### Issue: "Cannot connect to backend API"

**Symptoms**: Network errors, 404 responses, CORS errors

**Solutions**:
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is configured on backend to allow frontend origin
4. Check browser console for specific error messages

### Issue: "Authentication token expired"

**Symptoms**: Redirected to signin page, 401 errors

**Solutions**:
1. Sign in again to get a new token
2. Check token expiry time in backend configuration
3. Verify `BETTER_AUTH_SECRET` matches between frontend and backend
4. Clear browser localStorage and cookies

### Issue: "Page not found (404)"

**Symptoms**: Next.js 404 page appears

**Solutions**:
1. Verify page file exists in `src/app/` directory
2. Check file naming conventions (page.tsx, layout.tsx)
3. Restart development server
4. Clear `.next` cache: `rm -rf .next && npm run dev`

### Issue: "TypeScript errors"

**Symptoms**: Type checking errors, red squiggles in IDE

**Solutions**:
1. Run `npm run type-check` to see all errors
2. Verify all types are properly imported
3. Check `tsconfig.json` configuration
4. Restart TypeScript server in IDE

### Issue: "Styles not applying"

**Symptoms**: Tailwind classes not working, layout broken

**Solutions**:
1. Verify Tailwind is configured in `tailwind.config.js`
2. Check `globals.css` imports Tailwind directives
3. Restart development server
4. Clear browser cache

### Issue: "Tests failing"

**Symptoms**: Jest or Playwright tests fail

**Solutions**:
1. Ensure all dependencies installed: `npm install`
2. Check test environment configuration
3. Verify mock data matches expected types
4. Run tests in verbose mode: `npm run test -- --verbose`

---

## Performance Optimization

### Code Splitting

Next.js automatically code-splits by route. For additional optimization:

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Disable server-side rendering if not needed
});
```

### Image Optimization

Use Next.js Image component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
  src="/icon.png"
  alt="Icon"
  width={24}
  height={24}
  priority // Load immediately for above-the-fold images
/>
```

### Bundle Analysis

Analyze bundle size:

```bash
npm run analyze
```

This generates a visual report of bundle composition.

---

## API Integration Reference

### Making API Requests

Use the centralized API client:

```typescript
import { api } from '@/lib/api';

// GET request
const tasks = await api.get<Task[]>('/tasks');

// POST request
const newTask = await api.post<Task>('/tasks', {
  title: 'New Task',
  description: 'Task description'
});

// PATCH request
const updatedTask = await api.patch<Task>(`/tasks/${taskId}`, {
  is_completed: true
});

// DELETE request
await api.delete(`/tasks/${taskId}`);
```

The API client automatically:
- Attaches JWT token to all requests
- Handles 401 errors (redirects to signin)
- Parses JSON responses
- Throws errors for non-2xx responses

### Error Handling

```typescript
try {
  const task = await api.post('/tasks', taskData);
  showToast('Task created successfully', 'success');
} catch (error) {
  if (error.message.includes('expired')) {
    // Token expired, user will be redirected
  } else if (error.message.includes('Network')) {
    showToast('Network error. Please check your connection.', 'error');
  } else {
    showToast('Failed to create task. Please try again.', 'error');
  }
}
```

---

## Next Steps

After completing the quickstart setup:

1. **Phase 1 (P1)**: Implement task list view
   - Create TaskList, TaskItem, EmptyState components
   - Integrate GET /tasks API endpoint
   - Add loading and error states

2. **Phase 2 (P2)**: Implement task creation
   - Create TaskForm component
   - Integrate POST /tasks API endpoint
   - Add form validation

3. **Phase 3 (P3)**: Implement task completion toggle
   - Add Checkbox component
   - Integrate PATCH /tasks/{id} API endpoint
   - Implement optimistic updates

4. **Phase 4 (P4)**: Implement task editing
   - Reuse TaskForm in edit mode
   - Pre-fill form with existing data
   - Handle update errors

5. **Phase 5 (P5)**: Implement task deletion
   - Create DeleteConfirmDialog component
   - Integrate DELETE /tasks/{id} API endpoint
   - Add confirmation flow

6. **Phase 6 (P6)**: Implement responsive design
   - Apply mobile-first Tailwind classes
   - Test on multiple screen sizes
   - Ensure touch-friendly interactions

7. **Phase 7 (P7)**: Implement error handling
   - Add Toast notification system
   - Handle all error scenarios
   - Add success feedback

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)

---

## Support

For issues or questions:
1. Check this quickstart guide
2. Review the feature spec: `specs/003-responsive-frontend/spec.md`
3. Review the implementation plan: `specs/003-responsive-frontend/plan.md`
4. Check the contracts: `specs/003-responsive-frontend/contracts/`
5. Consult the project constitution: `.specify/memory/constitution.md`
