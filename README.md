# Car Wash Website

A full-stack car-wash booking application. Customers manage cars and book washes; washers update wash status; administrators manage users, categories, reports, and the opening schedule.

For a file-by-file code map, read [docs/CODEBASE_GUIDE.md](docs/CODEBASE_GUIDE.md).
For the infrastructure handoff procedure, read [docs/STAGING_RUNBOOK.md](docs/STAGING_RUNBOOK.md).

## Project Map

```text
CarWashApp/
  BE/       Express, MySQL, sessions, sockets, jobs
  FE/       React, Vite, React Query
shared/     Socket event names shared by both sides
test/       Backend unit and integration tests
```

## Local Setup

You need Node.js 20+, MySQL, and a `carwash_database` schema.

The runtime migration is at `database/migrations/001_runtime_tables.sql`. Run it against MariaDB before production deployment. The application still creates these two tables automatically in development for convenience.

1. Install root dependencies:

   ```powershell
   npm install
   ```

2. Install frontend dependencies:

   ```powershell
   cd CarWashApp/FE
   npm install
   cd ../..
   ```

3. Copy `.env.example` to `.env` and fill in local values. Never commit `.env`.

4. Start MySQL with the project database and tables.

5. Start the backend from the project root:

   ```powershell
   npm run dev
   ```

6. In another terminal, start the frontend:

   ```powershell
   cd CarWashApp/FE
   npm start
   ```

The frontend runs at `http://localhost:3000`; the backend runs at `http://localhost:5173`.

## Environment Variables

`.env.example` is the source of truth for configuration names. The important groups are:

- Runtime: `NODE_ENV`, `PORT`, `CLIENT_ORIGIN`
- Sessions: `SESSION_SECRET`, `SESH_EXPIRE_MS`, MariaDB `sessions` table
- Database: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Car lookup: `CAR_DATA_API_URL`, `CAR_DATA_API_RESOURCE`
- Verification email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`

Production requires a session secret, database password, MariaDB access, and complete SMTP configuration. Secrets belong in the deployment platform, not Git.

## How It Works

### Authentication and verification

Registration creates a six-digit email code. The backend stores only its hash, expires it after 10 minutes, and limits attempts. Users cannot log in or use protected routes until the code is verified. The backend middleware is the real security boundary; frontend redirects are only user experience.

### Booking

The backend validates session ownership, car ownership, category existence, and future booking time. A MySQL advisory lock plus a transaction prevents two simultaneous requests from booking the same time.

### Roles

- `customer`: manage personal cars, book washes, view personal washes
- `washer`: view all washes and update statuses
- `admin`: manage users, categories, reports, washes, and schedules

Authorization is enforced on the backend. Never rely on hiding a frontend button.

### Schedule

Admins upload `.xlsx` or `.csv` schedules. The frontend previews and normalizes spreadsheet times; the backend validates rows with Zod and replaces the schedule transactionally. Customers read the schedule through the shared schedule endpoint.

### Real-time updates

Socket.IO broadcasts new bookings and wash status changes. Event names live in `shared/events.js`, and client subscriptions live in `FE/src/Socket/`.

## Where to Work

- `BE/server.js`: middleware, sessions, health checks, routes, shutdown
- `BE/account_utils/`: accounts, passwords, email verification
- `BE/customer_services/`: customer cars, categories, washes, schedules
- `BE/admin_services/`: admin-only operations
- `BE/sql_utils/DBconnection.js`: MySQL pool
- `BE/sockets/`: Socket.IO server and events
- `FE/src/app/App.jsx`: route tree and query provider
- `FE/src/hooks/`: React Query queries and mutations
- `FE/src/services/`: Axios API functions
- `FE/src/components/Pages/`: user, staff, and admin screens

## Testing

Backend unit and integration tests:

```powershell
npm test
```

Frontend lint and production build:

```powershell
cd CarWashApp/FE
npm run lint
npm run build
```

Browser smoke test:

```powershell
npm run test:e2e
```

The Playwright test starts Vite automatically. Stop any stale process already using port `3000` before running it.

## Health Checks

- `GET /health/live`: process is running
- `GET /health/ready`: process can reach MySQL

Use `/health/ready` as the deployment readiness probe.

## Security Rules

- Keep `.env` ignored and untracked.
- Rotate secrets that have been exposed.
- Use the MariaDB-backed session store in production.
- Use HTTPS in production.
- Keep SQL values parameterized.
- Do not trust IDs, roles, or ownership values from the browser.
- Keep verification codes hashed, short-lived, and attempt-limited.
- Keep MySQL private to the backend network.

## Deployment Checklist

- [ ] Rotate `SESSION_SECRET` and configure production secrets.
- [ ] Configure managed MySQL backups and test a restore.
- [ ] Confirm the MariaDB-backed `sessions` table is included in backups.
- [ ] Configure SMTP and test a real verification email in staging.
- [ ] Run all files in `database/migrations/` against the production MariaDB database.
- [ ] Set `NODE_ENV=production` and the correct `CLIENT_ORIGIN`.
- [ ] Put frontend and backend behind HTTPS.
- [ ] Configure `/health/ready` as the readiness probe.
- [ ] Add centralized logs and error alerts.
- [ ] Run tests, lint, build, audits, and Playwright checks.
- [ ] Complete a staging deployment before going public.

## Troubleshooting

- `EADDRINUSE`: another process owns the port; stop it or choose another port.
- `401 Unauthorized`: the session cookie is missing or expired; log in again.
- `403 EMAIL_NOT_VERIFIED`: complete email verification, then log in again.
- Production startup failure: check session, database, and SMTP variables.
- Real database/SMTP checks: set production-like environment variables locally, then run integration tests with `RUN_LIVE_INTEGRATION=true`.

To run the live checks against a staging backend, provide a verified test account and SMTP-enabled backend:

```powershell
$env:RUN_LIVE_INTEGRATION="true"
$env:LIVE_API_URL="https://staging-api.example.com"
$env:LIVE_TEST_EMAIL="verified-test@example.com"
$env:LIVE_TEST_PASSWORD="test-account-password"
npm test
```

The live tests log in, read the session-backed `/account/me` endpoint, log out, verify the cookie is invalidated, and request a real verification email.

- Schedule upload rejection: use `.xlsx` or `.csv` with `Day`, `OpenTime`, `CloseTime`, and optional `Notes` columns.
