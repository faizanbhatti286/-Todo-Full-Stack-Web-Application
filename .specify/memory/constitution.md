<!-- SYNC IMPACT REPORT
Version change: N/A → 1.0.0
Modified principles: None (new constitution)
Added sections: All sections
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ pending
  - README.md ⚠ pending
Follow-up TODOs: None
-->

# Todo Full-Stack Web Application (Hackathon Phase-2) Constitution

## Core Principles

### Spec-Driven Development
All features are implemented via clearly defined specs, plans, and tasks—no manual coding. Every implementation must follow the defined specification and be tracked through the planned tasks before any code is written.

### Accuracy & Correctness
All API endpoints, authentication flows, and UI behaviors must function according to the spec. Every feature must behave exactly as specified in the requirements document, with no deviations in functionality or user experience.

### Security & User Isolation
Users can only access and modify their own data; JWT authentication must be correctly enforced. The system must implement proper access controls to ensure data privacy and security between different users.

### Reproducibility
Application setup, database schema, and deployment steps must be clearly documented and reproducible. Anyone should be able to set up the complete development environment and deploy the application following the provided documentation.

### Responsive Design
Frontend interface works consistently across desktop and mobile devices. The user interface must provide an optimal viewing and interaction experience across different screen sizes and device types.

### Tech Stack Compliance
All development must use the specified technology stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, and Better Auth for authentication. No alternative technologies may be introduced without explicit approval.

## Key Standards

- RESTful API endpoints must follow spec naming and behavior with consistent HTTP methods and status codes.
- JWT authentication must securely verify user identity in all API requests after initial login.
- Database persistence must ensure data integrity for all CRUD operations with proper validation and constraints.
- Frontend must integrate with backend APIs correctly, reflecting all task operations with real-time updates.
- Error handling and UX feedback must be consistent and user-friendly with appropriate messaging and graceful failure handling.
- All development must follow the specified tech stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth for authentication.

## Constraints

- API must enforce JWT authentication on all endpoints after login, returning 401 Unauthorized for unauthenticated requests.
- Task operations limited to authenticated users only, with proper validation that users can only modify their own data.
- Frontend must support responsive layouts for desktop and mobile, adhering to accessibility standards.
- Shared secret for JWT signing (`BETTER_AUTH_SECRET`) must be consistently applied across all services for proper authentication.
- Project must be completed using Claude Code + Spec-Kit Plus workflow—no manual coding outside the defined process is allowed.

## Success Criteria

- All API endpoints correctly implement CRUD functionality with proper validation and error handling.
- JWT authentication works end-to-end; unauthenticated requests return 401 Unauthorized and authenticated users can access protected resources.
- Users can only access and modify their own tasks, with proper enforcement of data isolation between users.
- Frontend properly displays, creates, updates, deletes, and completes tasks with appropriate UI feedback and state management.
- Application can be deployed and tested successfully with reproducible setup documented in the deployment guides.
- All specs, plans, and tasks are documented clearly for hackathon review and future maintenance.

## Governance

All development activities must comply with the principles and standards outlined in this constitution. The constitution serves as the authoritative source for development practices and supersedes any conflicting guidance. Any amendments to the constitution must be formally documented and approved by the project stakeholders. All pull requests and code reviews must verify compliance with these principles before approval. Development teams must ensure that all implementation decisions align with these principles and can justify any exceptions with clear business reasoning.

**Version**: 1.0.0 | **Ratified**: 2026-02-09 | **Last Amended**: 2026-02-09
