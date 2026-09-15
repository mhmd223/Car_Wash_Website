# Frontend Guide

This is the React/Vite client for the Car Wash Website.

## Commands

```powershell
npm install       # install dependencies
npm start         # start Vite at http://localhost:3000
npm run lint      # run ESLint
npm run build     # create a production build
npm run test:e2e  # run the Playwright browser smoke test
```

The backend must be running at `http://localhost:5173` for login and data requests to work.

## Frontend Mental Model

- `src/app/App.jsx` owns routes and the React Query provider.
- `src/components/Layouts/General/` provides the authenticated shell.
- `src/components/Pages/` contains page-level workflows.
- `src/components/FormComponents/` contains reusable forms and inputs.
- `src/hooks/` wraps server state and mutations with TanStack React Query.
- `src/services/` contains Axios calls and request shapes.
- `src/Socket/` contains the Socket.IO client and subscriptions.
- CSS modules sit next to their components.

## Data Flow Example

For a booking:

1. A page opens `BookForm`.
2. The form calls `useBookWash`.
3. The hook calls `services/wash_services.js`.
4. Axios sends the request with the session cookie.
5. The backend validates ownership and availability.
6. React Query invalidates the user's washes and stats.
7. Socket.IO notifies staff about the new wash.

For new features, follow the same shape: component for interaction, hook for server state, service for HTTP, backend route for authorization, and query module for SQL.

## Verification Flow

Registration and login can lead to `VerificationPage`. It submits the six-digit code through `account_services.js`; the backend decides whether the account becomes verified. Frontend state is never proof of verification.

## Schedule Uploads

The admin schedule page accepts `.xlsx` and `.csv` files. CSV parsing uses Papa Parse. XLSX parsing uses `read-excel-file` through a dynamic import so it is not loaded into the initial bundle. Rows should contain `Day`, `OpenTime`, `CloseTime`, and optional `Notes`.

## Common Issues

- API connection errors: start the backend and check `http://localhost:5173/health/live`.
- Stale data: invalidate the relevant React Query key after a successful mutation.
- Missing socket updates: check `shared/events.js`, the socket connection, and the subscription hook.
