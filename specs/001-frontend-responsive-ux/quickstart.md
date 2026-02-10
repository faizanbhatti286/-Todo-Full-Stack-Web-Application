# Quickstart Guide: Frontend Interface & Responsive UX

**Feature**: 001-frontend-responsive-ux
**Date**: 2026-02-10
**Status**: Ready for implementation

## Overview

This guide provides step-by-step instructions for setting up, developing, and deploying the Next.js 16+ frontend for the Todo Full-Stack Web Application.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (LTS recommended)
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **npm** or **yarn**: Package manager
  - npm comes with Node.js
  - Check version: `npm --version`
  - Yarn (optional): `npm install -g yarn`

- **Git**: Version control
  - Check version: `git --version`

- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## Project Setup

### 1. Create Next.js Project

```bash
# Navigate to project root
cd /path/to/hackathon-2-phase2

# Create Next.js app with TypeScript and App Router
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Navigate to frontend directory
cd frontend
```

**Configuration prompts**:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: No (we'll use app/ directly)
- ✅ App Router: Yes
- ✅ Import alias: Yes (@/*)

### 2. Install Dependencies

```bash
# Core dependencies
npm install @better-auth/react

# Development dependencies
npm install -D @types/node @types/react @types/react-dom

# Testing dependencies (optional, for later)
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 3. Environment Configuration

Create `.env.local` file in the `frontend/` directory:

```bash
# Copy example file
cp .env.local.example .env.local
```

**`.env.local.example`** (template):
```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Better Auth Configuration
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000/auth
BETTER_AUTH_SECRET=your-secret-key-here-must-match-backend

# Application Configuration
NEXT_PUBLIC_APP_NAME=Todo App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**:
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `BETTER_AUTH_SECRET` must match the backend configuration
- Never commit `.env.local` to version control (already in `.gitignore`)

### 4. Project Structure

After setup, your frontend directory should look like this:

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── tasks/              # Task management pages
├── components/             # React components
├── lib/                    # Utilities and services
├── public/                 # Static assets
├── .env.local              # Environment variables (not committed)
├── .env.local.example      # Environment template (committed)
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Workflow

### 1. Start Development Server

```bash
# From frontend/ directory
npm run dev

# Server starts at http://localhost:3000
```

**Expected output**:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### 2. Verify Backend Connection

Before developing frontend features, ensure the backend API is running:

```bash
# In a separate terminal, navigate to backend directory
cd ../backend

# Start FastAPI backend (command may vary)
uvicorn main:app --reload --port 8000

# Backend should be accessible at http://localhost:8000
```

**Test backend connection**:
```bash
# Check backend health
curl http://localhost:8000/health

# Expected response: {"status": "ok"}
```

### 3. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linter
npm run lint

# Run tests (after test setup)
npm test

# Type check
npx tsc --noEmit
```

## Implementation Order

Follow this order to implement features according to the spec priorities:

### Phase 1: Authentication (P1 dependency)
1. Set up Better Auth provider in root layout
2. Create login page (`app/login/page.tsx`)
3. Create signup page (`app/signup/page.tsx`)
4. Implement auth context and hooks (`lib/auth.ts`)
5. Test authentication flow

### Phase 2: Task Viewing (P1)
1. Create API client with JWT handling (`lib/api.ts`)
2. Create task list page (`app/tasks/page.tsx`)
3. Create TaskList component (`components/TaskList.tsx`)
4. Create TaskItem component (`components/TaskItem.tsx`)
5. Test task viewing with authenticated user

### Phase 3: Task Creation (P2)
1. Create TaskForm component (`components/TaskForm.tsx`)
2. Add create task functionality to task list page
3. Implement form validation
4. Test task creation flow

### Phase 4: Task Completion (P3)
1. Add completion toggle to TaskItem component
2. Implement optimistic updates
3. Handle API errors with revert
4. Test completion toggle

### Phase 5: Task Management (P4)
1. Add edit functionality to TaskForm
2. Create task detail/edit page (`app/tasks/[id]/page.tsx`)
3. Add delete functionality with confirmation
4. Test full CRUD workflow

### Phase 6: Responsive Design & Error Handling (P5)
1. Add responsive styles with Tailwind breakpoints
2. Implement error boundary
3. Create toast notification system
4. Add loading states and spinners
5. Test on multiple screen sizes

## Key Files to Create

### 1. API Client (`lib/api.ts`)

Core functionality:
- Base fetch wrapper with JWT injection
- Error handling and parsing
- Request/response interceptors
- Type-safe API methods

### 2. Auth Context (`lib/auth.ts`)

Core functionality:
- Better Auth integration
- Session state management
- Login/signup/logout methods
- Protected route logic

### 3. Type Definitions (`lib/types.ts`)

Copy from `specs/001-frontend-responsive-ux/contracts/types.ts`

### 4. Components

Priority components:
- `AuthForm.tsx`: Login/signup form
- `TaskList.tsx`: Task list display
- `TaskItem.tsx`: Individual task item
- `TaskForm.tsx`: Create/edit task form
- `ErrorMessage.tsx`: Error display
- `LoadingSpinner.tsx`: Loading indicator

## Testing

### Unit Tests (Component Testing)

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests (Optional)

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui
```

## Debugging

### Common Issues

**Issue**: "Cannot connect to backend API"
- **Solution**: Ensure backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Verify CORS is configured on backend

**Issue**: "401 Unauthorized on all API requests"
- **Solution**: Check JWT token is being sent in Authorization header
- Verify `BETTER_AUTH_SECRET` matches between frontend and backend
- Check token expiration

**Issue**: "Module not found" errors
- **Solution**: Run `npm install` to ensure all dependencies are installed
- Check import paths use `@/` alias correctly
- Restart development server

**Issue**: "Tailwind styles not applying"
- **Solution**: Ensure `globals.css` imports Tailwind directives
- Check `tailwind.config.js` content paths include all component files
- Restart development server

### Development Tools

**React DevTools**:
- Install browser extension for React debugging
- Inspect component tree and props
- Monitor state changes

**Network Tab**:
- Monitor API requests and responses
- Check request headers (Authorization token)
- Verify response status codes

**Console Logs**:
- Add `console.log()` for debugging
- Use `console.error()` for errors
- Remove logs before committing

## Building for Production

### 1. Build the Application

```bash
# Create optimized production build
npm run build

# Output will be in .next/ directory
```

### 2. Test Production Build Locally

```bash
# Start production server
npm start

# Access at http://localhost:3000
```

### 3. Environment Variables for Production

Update `.env.production` (or configure in deployment platform):

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.yourdomain.com/auth
BETTER_AUTH_SECRET=production-secret-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Deployment

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to configure project
```

**Configuration**:
- Framework: Next.js
- Root Directory: `frontend/`
- Build Command: `npm run build`
- Output Directory: `.next`
- Environment Variables: Add from `.env.production`

### Other Platforms

- **Netlify**: Supports Next.js with adapter
- **AWS Amplify**: Full-stack deployment
- **Docker**: Create Dockerfile for containerized deployment

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Formatting (Prettier)

```bash
# Install Prettier
npm install -D prettier

# Format all files
npx prettier --write .
```

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

## Performance Optimization

### Best Practices

1. **Use Server Components**: Default in App Router, faster initial load
2. **Optimize Images**: Use Next.js `<Image>` component
3. **Code Splitting**: Automatic with Next.js, use dynamic imports for large components
4. **Caching**: Leverage Next.js caching strategies
5. **Bundle Analysis**: Use `@next/bundle-analyzer` to identify large dependencies

### Monitoring

```bash
# Analyze bundle size
npm install -D @next/bundle-analyzer

# Add to next.config.js and run build
ANALYZE=true npm run build
```

## Next Steps

1. ✅ Complete project setup following this guide
2. ⏳ Implement features in priority order (P1 → P5)
3. ⏳ Test each feature before moving to next
4. ⏳ Run `/sp.tasks` to generate detailed implementation tasks
5. ⏳ Execute implementation via `/sp.implement`

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Better Auth Documentation**: https://better-auth.com/docs
- **TypeScript Documentation**: https://www.typescriptlang.org/docs

## Troubleshooting

For issues during implementation:
1. Check this quickstart guide
2. Review API contracts in `contracts/api-endpoints.md`
3. Consult data model in `data-model.md`
4. Review research decisions in `research.md`
5. Check project constitution in `.specify/memory/constitution.md`
