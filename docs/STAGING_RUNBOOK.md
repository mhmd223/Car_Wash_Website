# Staging Deployment Runbook

This is the handoff procedure for the five infrastructure items that cannot be completed from the source tree alone.

## 1. Provision the services

Create:

- A MariaDB instance reachable only by the backend network
- An SMTP account that can send from the application domain
- A VM/container/app service for the backend
- A static hosting service or web server for `FE/dist`
- An HTTPS certificate for the frontend and API domains

Redis is not required. Sessions are stored in the MariaDB `sessions` table.

## 2. Prepare MariaDB

1. Create `carwash_database`.
2. Run the existing application schema for users, cars, washes, categories, and schedules.
3. Run `database/migrations/001_runtime_tables.sql`.
4. Create the restricted application user from `database/permissions/carwash_app.sql.example`, replacing the host and password.
5. Confirm the application user cannot access unrelated databases.
6. Create a separate backup user if the hosting provider requires one.

## 3. Configure the backend

Set these in the hosting platform, not in Git:

```text
NODE_ENV=production
PORT=5173
CLIENT_ORIGIN=https://frontend.example.com
SESSION_SECRET=<new random secret>
SESH_EXPIRE_MS=86400000
DB_HOST=<private MariaDB host>
DB_PORT=3306
DB_USER=carwash_app
DB_PASSWORD=<database password>
DB_NAME=carwash_database
SMTP_HOST=<SMTP host>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<SMTP user>
SMTP_PASSWORD=<SMTP password>
SMTP_FROM=no-reply@example.com
CAR_DATA_API_URL=https://data.gov.il/api/3/action/datastore_search
CAR_DATA_API_RESOURCE=<resource id>
```

The backend should listen only on its private interface if Nginx is on the same machine.

## 4. Configure HTTPS and reverse proxy

1. Point DNS for `api.example.com` and `frontend.example.com` to the server or hosting platform.
2. Copy `infra/nginx/carwash.conf.example` to the Nginx site configuration.
3. Replace example domains and filesystem paths.
4. Obtain certificates using the hosting provider or ACME/Certbot.
5. Enable the HTTPS site and redirect HTTP to HTTPS.
6. Confirm WebSocket upgrade headers work for Socket.IO.
7. Confirm cookies have `Secure` behavior in production.

## 5. Backups and restore test

Set backup variables and run:

```powershell
$env:DB_HOST="private-db-host"
$env:DB_PORT="3306"
$env:DB_USER="backup-user"
$env:DB_PASSWORD="backup-password"
$env:DB_NAME="carwash_database"
$env:BACKUP_DIR="C:\backups\carwash"
.\scripts\backup-mariadb.ps1
```

Restore into a separate staging database, never directly over production:

```powershell
$env:DB_NAME="carwash_restore_test"
$env:BACKUP_FILE="C:\backups\carwash\carwash_database-YYYYMMDD-HHMMSS.sql"
.\scripts\restore-mariadb.ps1
```

Verify users, schedules, categories, cars, washes, and the `sessions` table after restore. Record the restore duration and result.

## 6. Monitoring

The backend emits JSON request logs with:

- request ID
- method and path
- status code
- duration

Forward stdout/stderr to the hosting provider's log service. Alert on:

- readiness failures
- HTTP 5xx responses
- database connection errors
- SMTP delivery errors
- repeated login/verification rate limits
- process restarts

Use:

```text
GET /health/live
GET /health/ready
```

The readiness endpoint should be used by the platform, not exposed as a public diagnostic dashboard.

## 7. Staging acceptance test

Run after deployment:

```powershell
$env:RUN_LIVE_INTEGRATION="true"
$env:LIVE_API_URL="https://api-staging.example.com"
$env:LIVE_TEST_EMAIL="verified-test@example.com"
$env:LIVE_TEST_PASSWORD="test-password"
npm test
```

Then manually verify:

- New registration sends an email.
- An unverified account cannot log in.
- Correct code enables login.
- Session survives a backend restart.
- Logout invalidates the session.
- A customer cannot edit another account.
- Duplicate booking returns the expected conflict.
- Admin and washer permissions are enforced.
- Schedule upload and customer schedule reads work.
- Socket wash updates arrive through HTTPS.

Do not promote to production until the restore test and acceptance test both pass.
