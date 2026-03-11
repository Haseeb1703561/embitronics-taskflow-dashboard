# AI Usage Log

This file captures the main AI-assisted development interactions used while building the EmbiTronics assessment project. The goal was to use AI to speed up implementation while still reviewing, structuring, and refining the output carefully.

## 1. Project architecture planning

- What I asked the AI to do:
  Define a fast, interview-safe architecture for the assessment with clear stack choices and delivery trade-offs.
- What it gave me:
  A plan using Next.js App Router, NextAuth with JWT sessions, MongoDB Atlas, Mongoose, Tailwind CSS, and Recharts.
- What I changed and why:
  I kept the suggested stack, but deliberately chose dropdown-based task status updates instead of drag-and-drop to reduce risk and keep the implementation more stable within the assessment timeline.

## 2. Project scaffolding strategy

- What I asked the AI to do:
  Set up the project from scratch in an empty workspace.
- What it gave me:
  A standard Next.js project scaffold approach.
- What I changed and why:
  The workspace name caused an npm naming conflict when attempting a standard scaffold, so the setup was adjusted to a manual project bootstrap in the root folder. This kept the project structure clean and avoided nesting the application in an extra directory.

## 3. Authentication flow

- What I asked the AI to do:
  Implement registration, login, JWT sessions, protected routes, and user-aware API access.
- What it gave me:
  NextAuth credentials-based authentication, password hashing with bcrypt, and route protection logic.
- What I changed and why:
  I kept the credentials + JWT flow, added a dedicated registration route, and used dashboard protection plus per-route auth checks so the app remains easy to explain and secure enough for the assessment scope.

## 4. API design and validation

- What I asked the AI to do:
  Build project and task APIs with consistent responses and validation.
- What it gave me:
  Route handlers, Zod validation, response helpers, and MongoDB model usage.
- What I changed and why:
  I kept the response format `{ success, data, error }`, added ownership checks on all project/task queries, and included a dashboard stats endpoint so the overview page could stay clean and focused.

## 5. Dashboard and task management UI

- What I asked the AI to do:
  Create a polished dashboard, auth screens, and a project/task management experience.
- What it gave me:
  Reusable UI primitives, dashboard layout, overview metrics, charting, forms, filters, and task cards.
- What I changed and why:
  I favored a two-panel workspace with project controls on the left and task management on the right because it felt more professional and easier to navigate than placing everything into a single long page.

## 6. Build and deployment readiness

- What I asked the AI to do:
  Verify the app builds successfully and prepare submission documentation.
- What it gave me:
  Build verification, environment variable guidance, README structure, and deployment steps.
- What I changed and why:
  I fixed a runtime configuration issue in the database helper, removed a build-time issue caused by `useSearchParams`, and updated the route protection file to the current Next.js `proxy` convention so the project is cleaner and easier to run.
