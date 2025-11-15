# GitHub Issues — Ready to Create

This file lists issues you can create in the repository. Titles are suggested, each entry includes a concise English description, related files, a short manual test or verification note, and suggested labels. Use the entries to populate your GitHub Project.

---

## Backend — Implemented (create as 'Done' issues)

Backend: Auth — Register & Login routes
Implement `register` and `login` endpoints to provide a working JWT-based authentication flow for users.
  - Files: `server/src/routes/auth/register.ts`, `server/src/routes/auth/login.ts`, `server/src/middleware/auth.ts`
  - Manual test: Register a new user, then login and verify JWT is issued and protected endpoints accept it.
  - Suggested labels: `backend`, `auth`, `done`

Backend: Get current user & Profile update
Provide `GET /me` and `PUT /me` endpoints to read and update the authenticated user's profile.
  - Files: `server/src/routes/auth/get-user.ts`, `server/src/routes/profile/get-me.ts`, `server/src/routes/profile/put-me.ts`
  - Manual test: Authenticate and call `/me` to view and update profile fields.
  - Suggested labels: `backend`, `profile`, `done`

Backend: Accounts CRUD
Implement full CRUD for accounts (list, create, update, delete) used by the admin interface.
  - Files: `server/src/routes/accounts/get-accounts.ts`, `post-accounts.ts`, `put-accounts.ts`, `delete-accounts.ts`, `server/src/models/account.ts`
  - Manual test: Use the client admin pages or API client to create, edit, list and delete accounts.
  - Suggested labels: `backend`, `accounts`, `done`

Backend: Days CRUD
Implement CRUD endpoints for calendar days management (list, create, update, delete).
  - Files: `server/src/routes/days/get-days.ts`, `post-days.ts`, `put-days.ts`, `delete-days.ts`, `server/src/models/day.ts`, `post_days_from_csv.py`
  - Manual test: Create and edit days via API or client, and verify CSV import script loads `days.csv` correctly.
  - Suggested labels: `backend`, `days`, `done`

Backend: Opening Requests CRUD
Implement endpoints for users to create opening requests and for admins to manage them.
  - Files: `server/src/routes/opening-requests/get-opening-requests.ts`, `post-opening-requests.ts`, `put-opening-requests.ts`, `delete-opening-requests.ts`, `server/src/models/opening-request.ts`
  - Manual test: Submit opening request from client and perform approve/reject actions via admin API.
  - Suggested labels: `backend`, `opening-requests`, `done`

Backend: Images upload and serving
Add endpoints and middleware to upload images and serve them from `uploads/`.
  - Files: `server/src/routes/images/post-image.ts`, `server/src/routes/images/get-images.ts`, `server/src/middleware/upload.ts`, `server/uploads/`
  - Manual test: Upload an image through the client component and verify it is saved and retrievable.
  - Suggested labels: `backend`, `images`, `done`

Backend: Middleware — Auth & Upload
Authentication middleware and file upload middleware are implemented to protect endpoints and handle multipart uploads.
  - Files: `server/src/middleware/auth.ts`, `server/src/middleware/upload.ts`
  - Manual test: Check protected endpoints reject unauthenticated requests and accept valid JWTs; verify upload middleware enforces storage location.
  - Suggested labels: `backend`, `middleware`, `done`

Backend: Database config & seeds
MongoDB configuration and initial data seeds are provided to bootstrap the app with sample accounts and days.
  - Files: `server/src/config/database.ts`, `mongo-init/epicalendar.accounts.json`, `mongo-init/epicalendar.days.json`, `mongo-init/init.sh`
  - Manual test: Run `init.sh` against a local Mongo instance and confirm collections are populated.
  - Suggested labels: `infra`, `database`, `done`

Backend: Dockerfiles and docker-compose
Dockerfiles for server and top-level `docker-compose.yml` files are provided to build and run services locally and in prod mode.
  - Files: `server/Dockerfile`, `server/Dockerfile.prod`, `docker-compose.yml`, `docker-compose.prod.yml`
  - Manual test: Build and run containers using `docker-compose up --build` and verify services start.
  - Suggested labels: `devops`, `docker`, `done`


## Frontend — Implemented (create as 'Done' issues)

CLIENT: Base layout and global styles
Application layout and global CSS are implemented for consistent page structure and base styling.
  - Files: `client/src/app/layout.tsx`, `client/src/app/styles.css`
  - Manual test: Open the app root and check consistent header/footer and styles on multiple pages.
  - Suggested labels: `frontend`, `ui`, `done`

CLIENT: Public pages & calendar view
Implement a public-facing pages including the main calendar view.

CLIENT: Authentication pages & context
Implement a login and registration pages with auth context and client-side service to authenticate users.

CLIENT: Admin Dashboard and nested admin pages
Implement dashboard and admin pages for managing accounts, days and opening requests (list/add/edit/display).

CLIENT: Manage Accounts pages
Implement pages and forms to create, edit, view and delete accounts and connect it to the API.

CLIENT: Manage Days pages
Implement pages to add, edit, view and delete calendar days and integrate it with backend days API.

CLIENT: Opening Requests pages
Implement pages for users to submit opening requests and for admins to manage them.

CLIENT: Profile pages
Implement a profile view and edit forms and connect it to profile endpoints.

CLIENT: Reusable components and API wrapper
Implement shared components (header, client layout, image upload, loader) and a centralized API client.

## Infrastructure & Tooling — Implemented

Client and Server project configurations
TypeScript, Next.js and ESLint configurations are present in `client/` and the server has a `tsconfig` and `package.json`.

Docker & deployment files
Dockerfiles for client and server and compose files exist to containerize the app for local and production use.

Seed data and DB init script
Seed JSON files and a small shell script to populate MongoDB are included.

Documentation: README files
Basic README files exist at the root and in `client/` describing local setup and project structure.


## Improvements / To Do (create as actionable issues)

Docs: Document API endpoints (Auth, Accounts, Days, Images, Requests, Profile)
Add comprehensive API documentation with example requests/responses and auth requirements.
  - Suggested checklist:
    - [ ] Add endpoint list
    - [ ] Provide request/response examples
    - [ ] Describe authentication flow
  - Suggested labels: `docs`, `backend`, `enhancement`

Tests: Add backend unit and integration tests
Add Jest (or preferred) tests for routes, models and services to ensure regressions are caught early.
  - Suggested checklist:
    - [ ] Unit tests for services
    - [ ] Integration tests for critical endpoints
  - Suggested labels: `tests`, `backend`, `priority-medium`

Tests: Add frontend E2E tests
Add Playwright or Cypress tests to cover critical user flows (login, CRUD for accounts/days/requests).
  - Suggested labels: `tests`, `frontend`, `e2e`

Backend: Add request validation and standardized error responses
Use `zod`/`joi` to validate payloads and return consistent error objects to the client.
  - Suggested labels: `backend`, `validation`, `bug`

Security: Rate limiting, input sanitization and upload hardening
Protect endpoints from abuse (rate limiting), sanitize inputs and validate uploads (MIME/type & size limits).
  - Suggested labels: `security`, `backend`, `infra`

Feature: Pagination & filtering for list endpoints
Add pagination and filter parameters to accounts/days/requests endpoints and update UI to use them.
  - Suggested labels: `backend`, `frontend`, `enhancement`

CLIENT: Add client-side form validation
Improve UX by adding form validations (register, login, create/edit forms) and inline error messages.
  - Suggested labels: `frontend`, `ux`, `enhancement`

CLIENT: Accessibility audit and fixes (a11y)
Run an accessibility audit and fix high-priority issues to improve keyboard and screen-reader support.
  - Suggested labels: `frontend`, `a11y`, `quality`

CI: Add GitHub Actions pipeline
Add workflows to run lint, tests and build on pull requests and on push to main.
  - Suggested labels: `ci`, `automation`, `priority-high`

Monitoring & Logging
Add structured logging and optionally a basic monitoring setup (Sentry or similar) for error visibility.
  - Suggested labels: `infra`, `monitoring`, `enhancement`

Docs: Architecture diagrams & contributor guide
Add a short architecture diagram and a contributor guide with local dev steps and common commands.
  - Suggested labels: `docs`, `onboarding`


---

If you want, I can:
- generate GitHub issues automatically (requires a token),
- create a `GitHub Project` board and populate it, or
- split the high-priority improvement tasks into separate issues with owners/estimates.

File created: `GH_issues_ready.md`
