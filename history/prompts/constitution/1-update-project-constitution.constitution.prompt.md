---
id: 1
title: Update Project Constitution
stage: constitution
date: 2026-02-09
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: main
user: Admin
command: /sp.constitution
labels: [constitution, hackathon, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - none
---

## Prompt

# /sp.constitution

## Project
**Todo Full-Stack Web Application (Hackathon Phase-2)**

## Core principles
- **Spec-Driven Development:** All features are implemented via clearly defined specs, plans, and tasks—no manual coding.
- **Accuracy & Correctness:** All API endpoints, authentication flows, and UI behaviors must function according to the spec.
- **Security & User Isolation:** Users can only access and modify their own data; JWT authentication must be correctly enforced.
- **Reproducibility:** Application setup, database schema, and deployment steps must be clearly documented and reproducible.
- **Responsive Design:** Frontend interface works consistently across desktop and mobile devices.

## Key standards
- RESTful API endpoints must follow spec naming and behavior.
- JWT authentication must securely verify user identity in all API requests.
- Database persistence must ensure data integrity for all CRUD operations.
- Frontend must integrate with backend APIs correctly, reflecting all task operations.
- Error handling and UX feedback must be consistent and user-friendly.
- Tech stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth for authentication.

## Constraints
- API must enforce JWT authentication on all endpoints after login.
- Task operations limited to authenticated users only.
- Frontend must support responsive layouts for desktop and mobile.
- Shared secret for JWT signing (`BETTER_AUTH_SECRET`) must be consistently applied across services.
- Project must be completed using Claude Code + Spec-Kit Plus workflow—no manual coding.

## Success criteria
- All API endpoints correctly implement CRUD functionality.
- JWT authentication works end-to-end; unauthenticated requests return 401 Unauthorized.
- Users can only access and modify their own tasks.
- Frontend properly displays, creates, updates, deletes, and completes tasks.
- Application can be deployed and tested successfully with reproducible setup.
- All specs, plans, and tasks are documented clearly for hackathon review.

## Response snapshot

I've successfully created and updated the project constitution file according to your specifications. Here's what was accomplished:

1. Created a comprehensive constitution file at `.specify/memory/constitution.md` that includes:
   - All your specified core principles
   - Key standards for the project
   - Constraints for implementation
   - Success criteria
   - Governance structure

2. Updated related template files to ensure consistency with the new constitution:
   - Modified `.specify/templates/plan-template.md` to include constitution checks that reflect the new principles
   - Updated `.specify/templates/spec-template.md` with functional requirements that align with your tech stack
   - Enhanced `.specify/templates/tasks-template.md` with specific tasks related to your required technologies (FastAPI, SQLModel, Neon PostgreSQL, Better Auth, Next.js)

The constitution now clearly defines your project requirements, including the specific tech stack (Next.js, FastAPI, SQLModel, Neon PostgreSQL, Better Auth), security requirements for JWT authentication and user data isolation, and the workflow constraints that require using Claude Code + Spec-Kit Plus with no manual coding.

All templates have been updated to ensure that future generated specs, plans, and tasks will align with these constitutional principles, maintaining consistency across your entire development process.

## Outcome

- ✅ Impact: Established foundational project constitution with tech-stack compliance and security requirements
- 🧪 Tests: None required for documentation update
- 📁 Files: Updated constitution.md and 3 template files to ensure consistency
- 🔁 Next prompts: Ready to proceed with spec generation using /sp.specify
- 🧠 Reflection: Constitution provides clear governance framework for hackathon project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A for documentation
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate feature specification based on constitution