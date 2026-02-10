# Todo App - Frontend

A modern, responsive task management application built with Next.js 16, TypeScript, and TailwindCSS.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Completion**: Toggle task completion status with visual feedback
- **Responsive Design**: Optimized for mobile (320px+), tablet, and desktop
- **Real-time Feedback**: Toast notifications for all operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Optimistic Updates**: Instant UI updates with automatic rollback on failure
- **Session Persistence**: Maintain authentication across page refreshes

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4
- **Authentication**: Better Auth with JWT
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running (default: http://localhost:8000)

## Quick Start

### 1. Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_NAME=Todo App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Copy from the example file:
```bash
cp .env.local.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home/landing page
│   ├── globals.css          # Global styles and animations
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── tasks/               # Task management pages
│       ├── page.tsx         # Task list page
│       └── [id]/page.tsx    # Task detail/edit page
├── components/              # Reusable React components
│   ├── AuthForm.tsx         # Authentication form
│   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   ├── ErrorMessage.tsx     # Error display component
│   ├── LoadingSpinner.tsx   # Loading indicator
│   ├── Navigation.tsx       # Navigation bar
│   ├── TaskForm.tsx         # Task create/edit form
│   ├── TaskItem.tsx         # Individual task display
│   └── TaskList.tsx         # Task list container
├── lib/                     # Utility libraries
│   ├── api.ts              # API client with JWT handling
│   ├── auth.tsx            # Authentication context
│   ├── toast.tsx           # Toast notification system
│   └── types.ts            # TypeScript type definitions
├── public/                  # Static assets
├── .env.local.example       # Environment variables template
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Key Features Implementation

### Authentication

- JWT-based authentication with sessionStorage
- Automatic token injection in API requests
- 401 error handling with redirect to login
- Session persistence across page refreshes

### Task Management

- **Create**: Form validation (title 1-200 chars, description max 1000 chars)
- **Read**: Protected task list with loading states
- **Update**: Edit task details and toggle completion status
- **Delete**: Confirmation dialog with optimistic updates

### Responsive Design

- **Mobile**: 320px - 767px (touch-optimized, 44x44px targets)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+ (enhanced layouts)

### Error Handling

- Network errors with retry options
- Validation errors with field-specific messages
- API errors with user-friendly messages
- React Error Boundary for unexpected errors

### User Experience

- Optimistic updates for instant feedback
- Toast notifications (auto-dismiss after 3 seconds)
- Loading indicators for all async operations
- Smooth animations and transitions

## API Integration

The frontend communicates with the backend API using the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Tasks
- `GET /api/users/{userId}/tasks` - List all tasks
- `GET /api/users/{userId}/tasks/{taskId}` - Get single task
- `POST /api/users/{userId}/tasks` - Create task
- `PATCH /api/users/{userId}/tasks/{taskId}` - Update task
- `DELETE /api/users/{userId}/tasks/{taskId}` - Delete task

All authenticated requests include `Authorization: Bearer <token>` header.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `BETTER_AUTH_SECRET` | Authentication secret key | Required |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Todo App` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- JWT tokens stored in sessionStorage
- XSS protection with React's built-in escaping
- Input validation on all forms
- Secure HTTP headers (configured in backend)

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatible
- Touch targets minimum 44x44px

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**API requests fail with CORS errors**
- Verify backend CORS configuration
- Check `NEXT_PUBLIC_API_BASE_URL` is correct

**Authentication not persisting**
- Check browser sessionStorage is enabled
- Verify JWT token is being stored correctly

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [Implementation Summary](./IMPLEMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](../specs/001-frontend-responsive-ux/contracts/)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
