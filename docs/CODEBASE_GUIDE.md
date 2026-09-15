# Car Wash Website Codebase Guide

This document explains what each part of the project owns, how data moves through it, and where to make changes. It is intentionally practical: read the section for the layer you are changing, then follow the existing flow instead of bypassing it.

## The Big Picture

```text
React page
  -> React Query hook
    -> Axios service
      -> Express route and middleware
        -> service/query module
          -> MySQL

Socket.IO runs beside this flow for live wash updates.
```

The browser is responsible for interaction and presentation. The backend is responsible for authentication, authorization, validation, and database truth.

## Repository Layout

### Root files

- `package.json`: backend dependencies and root commands.
- `.env.example`: names and examples for all runtime configuration.
- `.env`: local secrets; ignored and never committed.
- `README.md`: setup, operations, security, and deployment handbook.
- `docs/CODEBASE_GUIDE.md`: this code-level map.
- `test/`: backend unit and integration tests.
- `shared/events.js`: event names shared by backend and frontend.

## Backend

The backend is an Express application using ES modules, MySQL, MariaDB-backed sessions, Socket.IO, and scheduled jobs.

### Bootstrap and infrastructure

- `BE/server.js`: application entry point. Loads environment variables, initializes jobs and verification storage, configures CORS, Helmet, rate limiting, origin checks, sessions, JSON parsing, routes, health checks, and graceful shutdown. Add global middleware here; add business logic elsewhere.
- `BE/sql_utils/DBconnection.js`: creates the MySQL pool from environment variables. Query modules borrow a connection and must release it in `finally`.
- `BE/middleware/loggedIn.js`: authentication boundary. Public account verification routes pass through; all other routes require a session and an explicitly verified user.
- `BE/data/roles.js`: canonical role strings. Import these constants instead of spelling roles differently.
- `BE/jobs/index.js`: startup entry point for background jobs.
- `BE/jobs/washJobs.js`: rejects overdue pending washes and schedules the 24-hour repeat job.

### Account and verification

- `BE/account_utils/account_services.js`: HTTP endpoints for register, login, verify email code, resend code, logout, current user, and account editing. It translates service results into status codes and public error codes.
- `BE/account_utils/acount_queries.js`: account database operations, password comparison, registration, account lookup, and profile editing. SQL values are parameterized.
- `BE/account_utils/account_validator.js`: password hashing/comparison and username/phone validation.
- `BE/account_utils/verification_service.js`: creates the verification table, generates six-digit codes, hashes codes, sends SMTP mail, applies expiry/resend/attempt limits, and consumes codes transactionally.

Verification flow:

1. Register creates the user and sends a code.
2. The frontend shows `VerificationPage`.
3. The code endpoint locks the code row, checks expiry and attempts, marks the user verified, and deletes the code.
4. Login rejects unverified accounts.
5. `loggedIn` rejects unverified sessions on every protected request.

### Admin services

- `BE/admin_services/router.js`: admin authorization boundary. All child routers require the admin role.
- `BE/admin_services/account_services/account_services.js`: admin user endpoints.
- `BE/admin_services/account_services/account_queries.js`: list users, change roles, and administrative verification actions.
- `BE/admin_services/category_services/category_services.js`: admin category route handlers.
- `BE/admin_services/category_services/category_queries.js`: category SQL operations.
- `BE/admin_services/wash_services/wash_services.js`: admin business/report route handlers.
- `BE/admin_services/wash_services/wash_queries.js`: report and wash-related SQL.
- `BE/admin_services/schedule_services/schedule_services.js`: admin upload and clear routes.
- `BE/admin_services/schedule_services/schedule_queries.js`: schedule reads, transactional replacement, and clearing.
- `BE/admin_services/schedule_services/schedule_validation.js`: Zod schema for schedule rows. This is the server-side contract for spreadsheet uploads.

### Customer services

- `BE/customer_services/car_services/car_routes.js`: authenticated car endpoints. It checks that the requested user ID matches the session user.
- `BE/customer_services/car_services/car_queries.js`: car database operations.
- `BE/customer_services/car_services/car_validator.js`: license-plate validation and external vehicle lookup.
- `BE/customer_services/category_services/category_routes.js`: customer category reads.
- `BE/customer_services/category_services/category_queries.js`: customer category SQL.
- `BE/customer_services/schedule_routes.js`: customer schedule read endpoint. Schedule writes remain admin-only.
- `BE/customer_services/wash_services/carwash_routes.js`: customer wash reads, booking, and staff status updates. It validates session ownership and maps domain errors to HTTP codes.
- `BE/customer_services/wash_services/carwash_queries.js`: wash SQL. Booking verifies car ownership and category existence, obtains a MySQL advisory lock for the time slot, checks availability, inserts inside a transaction, and releases the lock.

Booking error codes to preserve in clients:

- `ALREADY_BOOKED`: another wash already uses that time.
- `CAR_NOT_OWNED`: the car is not active on the current user's account.
- `CATEGORY_NOT_FOUND`: the selected category no longer exists.
- `INVALID_WASH_DATE`: the requested time is not valid or is in the past.
- `BOOKING_BUSY`: another request currently holds the time-slot lock.

### Real-time communication

- `BE/sockets/index.js`: creates the Socket.IO server and places authenticated sockets into user, washer, or admin rooms.
- `BE/sockets/washEvents.js`: emits new-booking events to staff and status updates to the customer plus staff.
- `shared/events.js`: event-name contract. Change this file when renaming an event, then update both server emitters and frontend listeners.

## Frontend

The frontend is React with Vite, TanStack React Query, Axios, Socket.IO client, CSS modules, Papa Parse, and `read-excel-file`.

### App shell and routing

- `FE/src/main.jsx`: creates the React root and `QueryClientProvider`.
- `FE/src/app/App.jsx`: route tree, session-derived user state, socket connection, and global toast container.
- `FE/src/app/app.css`: app-level CSS entry point.
- `FE/src/index.css`: global variables, typography, reset, colors, and accessibility focus styles.
- `FE/src/components/Layouts/General/GeneralLayout.jsx`: authenticated layout, login redirect, user context provider, header/footer selection.
- `FE/src/components/Layouts/General/General.module.css`: layout sizing and outlet surfaces.
- `FE/src/components/Header/`: authenticated welcome header and styles.
- `FE/src/components/Footer/`: customer footer wrapper and styles.
- `FE/src/components/navbar/`: navigation links generated from `data/pages/pages.js`.

### Pages

- `FE/src/components/Pages/login/Login.jsx`: toggles login/register mode and verification-page mode.
- `FE/src/components/Pages/login/VerificationPage.jsx`: accepts, submits, and resends email codes.
- `FE/src/components/Pages/login/login.module.css`: login and verification presentation.
- `FE/src/components/Pages/home/Home.jsx`: customer shortcuts and upcoming wash summary.
- `FE/src/components/Pages/home/home.module.css`: home layout.
- `FE/src/components/Pages/userCars/UserCars.jsx`: loads cars, opens add-car form, removes cars, and starts a car-specific booking.
- `FE/src/components/Pages/userCars/usercars.module.css`: car page layout and action states.
- `FE/src/components/Pages/userWashes/CarWashes.jsx`: loads customer washes, listens for live status changes, and opens booking.
- `FE/src/components/Pages/userWashes/carwashes.module.css`: wash page loading/error/action states.
- `FE/src/components/Pages/account/Account.jsx`: profile details, activity statistics, edit account, and logout.
- `FE/src/components/Pages/account/account.module.css`: account profile layout.
- `FE/src/components/Pages/employee/EmployeeDashboard.jsx`: washer-facing live wash workflow.
- `FE/src/components/Pages/employee/employee.module.css`: employee layout.
- `FE/src/components/Pages/adminDashboard/AdminDashboard.jsx`: admin header actions, tabs, live wash updates, account editing, and logout.
- `FE/src/components/Pages/adminDashboard/dashboard.module.css`: admin shell styling.
- `FE/src/components/Pages/adminDashboard/adminTabs/Users/`: user listing, filtering, roles, and verification controls.
- `FE/src/components/Pages/adminDashboard/adminTabs/Business/`: business report display.
- `FE/src/components/Pages/adminDashboard/adminTabs/Washes/`: admin wash list and status actions.
- `FE/src/components/Pages/adminDashboard/adminTabs/Schedule/`: spreadsheet import, preview, validation feedback, save, and clear.

### Reusable components

- `FE/src/components/FormComponents/inputField/`: shared input, validation display, datalist time options, and disabled-state behavior.
- `FE/src/components/FormComponents/Forms/AddCarForm/`: add-car modal and server-error messages.
- `FE/src/components/FormComponents/Forms/BookWashForm/`: booking modal and category/car/time selection.
- `FE/src/components/FormComponents/Forms/EditAccountForm/`: profile-edit modal with prefilled fields.
- `FE/src/components/FormComponents/Forms/LoginForm/`: shared login/register form validation and submission.
- `FE/src/components/FormComponents/Forms/ConfirmButtons/`: confirmation controls.
- `FE/src/components/FormComponents/Button/`: shared button component.
- `FE/src/components/ObjectList/CarsList/`: renders car cards and actions.
- `FE/src/components/ObjectList/WashesList/`: filters, groups, and renders washes by hour.
- `FE/src/components/ObjectList/AccountStats/`: renders statistic items.
- `FE/src/components/Car/`: individual car card.
- `FE/src/components/WashObject/`: individual wash card and status presentation.
- `FE/src/components/User/`: user profile presentation.
- `FE/src/components/StatItem/`: one statistic display.

### Hooks and services

- `FE/src/hooks/useAccountStats.js`: user info, account stats, account edits, admin users, reports, and role updates.
- `FE/src/hooks/useBookWash.js`: booking mutation and cache invalidation.
- `FE/src/hooks/useCategories.js`: category query.
- `FE/src/hooks/useEmployeeWashes.js`: staff wash queries and status mutations.
- `FE/src/hooks/useFilterWash.js`: wash status and plate filtering state.
- `FE/src/hooks/useSchedule.js`: shared schedule query plus admin mutations under one cache key.
- `FE/src/hooks/useUserCars.js`: current user's cars query.
- `FE/src/hooks/useUserWashes.js`: current user's washes and statistics queries.
- `FE/src/hooks/useUserFilter.js`: user-list filtering state.
- `FE/src/hooks/useNav/`: tab navigation state and styling.
- `FE/src/services/account_services.js`: account, login, logout, and verification requests.
- `FE/src/services/admin_services.js`: admin users, reports, schedule writes, and role operations.
- `FE/src/services/car_services.js`: car API calls.
- `FE/src/services/category_services.js`: category API calls.
- `FE/src/services/schedule_services.js`: shared schedule read API call.
- `FE/src/services/wash_services.js`: wash, booking, and status API calls.

### Socket client

- `FE/src/Socket/socket.js`: Socket.IO client instance.
- `FE/src/Socket/useSocket.js`: subscribes and cleans up event listeners. Include socket, event name, and callback dependencies.

### Data and assets

- `FE/src/data/pages/pages.js`: navigation page definitions and icons.
- `FE/src/data/washStatus.js`: wash status labels and styles.
- `FE/src/data/regex/regex.js`: frontend validation patterns.
- `FE/src/data/icons/`: reusable icon definitions.
- `FE/src/assets/images/`, `videos/`: static media.
- `FE/src/components/**/*.module.css`: component-scoped styles.

## Tests

- `test/schedule_validation.test.js`: schedule schema acceptance/rejection.
- `test/server.integration.test.js`: real backend process, liveness, and unauthenticated protection.
- `FE/tests/login.smoke.spec.js`: real Chromium login/register screen smoke test.

## Safe Extension Pattern

When adding a feature:

1. Define the backend route and authorization rule.
2. Validate request input at the route boundary.
3. Put SQL in the nearest query module with parameterized values.
4. Add an Axios service function.
5. Add or update a React Query hook.
6. Connect the hook to a page or form.
7. Invalidate affected query keys after mutations.
8. Add a backend test and a browser test for the user-visible flow.
9. Update this guide if a new subsystem or contract appears.
