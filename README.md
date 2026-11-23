# Pipeline

A minimalist, monochrome job application tracker built with React, TanStack Router, TanStack Query, Drizzle ORM, Tailwind CSS, and Zod. Designed with a clean Zinc palette and responsive layout across mobile and desktop viewports.

## Features

* **Pipeline Overview & Summary Strip:** Track total applications, active interviews, offers, and response rate at a glance.

* **Status Filtering, Search & Sorting:** Filter applications across `All`, `Applied`, `Interview`, `Offer`, and `Rejected` tabs, search by company or role, and sort results.

* **Application Drawer & Interview Rounds:** Inspect application details, update statuses, add/edit/delete interview rounds, and commit changes with confirmation.

* **Contextual Empty States:** Displays tailored illustrations and guidance per status tab (`all`, `applied`, `interview`, `offer`, `rejected`) as well as for empty search results.

* **Responsive Layout:** Adapts cleanly between mobile screens and wider desktop viewports.

## Tech Stack

* **Frontend:** React, Tailwind CSS

* **Routing & Data Fetching:** TanStack Router, TanStack Query (with server functions)

* **Database & ORM:** PostgreSQL, Drizzle ORM

* **Validation:** Zod

## Project Structure (Overview)

* `src/routes/__root.tsx` — Root layout and `notFoundComponent`

* `src/routes/index.tsx` — Main Pipeline dashboard route

* `src/components/applications/` — Table, toolbar, drawers, dialogs, and `empty-state.tsx`

* `src/server/applications.ts` — Server functions for querying and saving applications and interview rounds

* `src/lib/validators.ts` — Zod schemas for application and interview round payloads

* `public/empty-states/` — Empty-state illustrations (`all`, `applied`, `interview`, `offer`, `rejected`)

* `.env.example` — Template environment variables for local setup

* `docker-compose.yaml` — Local PostgreSQL service configuration

## Getting Started

1. **Install dependencies:**

   ```
   pnpm install
   
   ```

2. **Configure environment variables:**

   Copy `.env.example` to `.env` and adjust values if needed:

   ```
   cp .env.example .env
   
   ```

   Example `.env.example`:

   ```
   DATABASE_NAME=
   DATABASE_USER=
   DATABASE_PASSWORD=
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
   
   ```

3. **Start PostgreSQL and push database schema:**

   ```
   docker compose up -d
   npx drizzle-kit push
   
   ```

4. **Start the development server:**

   ```
   pnpm dev
   
   ```
