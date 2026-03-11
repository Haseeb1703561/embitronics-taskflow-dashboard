# EmbiTronics TaskFlow Dashboard

A full-stack task management application built for the EmbiTronics technical assessment. It allows users to register, sign in with JWT-based sessions, manage projects, create and update tasks, filter work by status and priority, and monitor delivery health from a dashboard with status analytics.

## Live URL

Add your deployed Vercel URL here before submission:

`https://your-project-name.vercel.app`

## Tech Stack

- `Next.js 16` with App Router and TypeScript
  Reason: one codebase for frontend and backend route handlers, fast setup, and simple Vercel deployment.
- `Tailwind CSS`
  Reason: fast iteration with a consistent design system and responsive styling.
- `NextAuth` with Credentials provider and JWT sessions
  Reason: satisfies the JWT-based authentication requirement while keeping auth secure and easy to explain.
- `MongoDB Atlas` + `Mongoose`
  Reason: hosted database option that works well with Vercel and keeps setup lightweight.
- `Recharts`
  Reason: quick way to add a clean task distribution chart on the dashboard.

## Features

- User registration and login
- Protected dashboard routes
- Project create, list, edit, and delete
- Task create, edit, delete, and quick status/priority updates
- Task filtering by status and priority
- Dashboard overview with total projects, total tasks, overdue task count, and task status chart
- Responsive UI with loading, empty, and error states

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
copy .env.local.example .env.local
```

3. Update `.env.local` with your own values:
- `MONGODB_URI`: your MongoDB Atlas connection string
- `MONGODB_DB_NAME`: database name you want to use
- `NEXTAUTH_SECRET`: a long random secret string
- `NEXTAUTH_URL`: `http://localhost:3000`

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## MongoDB Atlas Setup

1. Create a new project in MongoDB Atlas.
2. Create a cluster.
3. Add a database user.
4. In `Network Access`, allow your IP address.
5. Copy the connection string and place it in `MONGODB_URI`.
6. Set `MONGODB_DB_NAME` to a name such as `embitronics_assessment`.

## Environment Variables

Use `.env.local.example` as the template:

```env
MONGODB_URI=...
MONGODB_DB_NAME=embitronics_assessment
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## Folder Structure

```text
src/
  app/
    api/                 # Route handlers for auth, dashboard, projects, and tasks
    dashboard/           # Protected dashboard pages
    login/ register/     # Auth pages
  components/
    auth/                # Login and registration UI
    dashboard/           # Dashboard and task management UI
    providers/           # Session + toast providers
    ui/                  # Reusable UI primitives
  lib/                   # Auth config, DB connection, helpers, validation, constants
  models/                # Mongoose schemas
  types/                 # Shared TypeScript types
```

## Architecture Decisions and Trade-Offs

- Used Next.js route handlers instead of a separate Express/Fastify API to keep deployment simpler and reduce project overhead.
- Used MongoDB Atlas because it is easy to provision quickly and works well for a short assessment timeline.
- Implemented dropdown-based task status updates instead of drag-and-drop because the assessment allows either approach and the dropdown flow is faster to stabilize.
- Kept forms client-driven with fetch-based mutations for clarity and a simpler mental model.

## API Response Format

All API routes return a consistent shape:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

or

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Something went wrong"
  }
}
```

## What I Would Improve With More Time

- Add drag-and-drop task movement between status columns
- Add integration and end-to-end tests
- Add pagination and search for larger datasets
- Add finer-grained project analytics and activity history
- Add user profile details and password reset flow

## Deployment to Vercel

1. Push this project to a GitHub repository.
2. Import the repository into Vercel.
3. Add the same environment variables from `.env.local` into the Vercel project settings.
4. Set `NEXTAUTH_URL` to your production Vercel URL, for example:
   `https://your-project-name.vercel.app`
5. Deploy the project.
6. Copy the production URL into the `Live URL` section above before submission.

## Submission Checklist

- Push the code to a public GitHub repository
- Deploy the app to Vercel
- Replace the `Live URL` placeholder in this README
- Keep `README.md` and `AI_LOG.md` in the project root
- Share the GitHub repository link with EmbiTronics
