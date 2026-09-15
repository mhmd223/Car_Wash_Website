// Express application bootstrap: middleware, sessions, routes, health checks, and shutdown.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import path from "path";
import { initializeSocket } from "./sockets/index.js";
import { initializeJobs } from "./jobs/index.js";
import loggedIn from "./middleware/loggedIn.js";
import admin_services_router from "./admin_services/router.js";
import * as account_services from "./account_utils/account_services.js";
import * as category_services from "./admin_services/category_services/category_services.js";
import * as user_category_services from "./customer_services/category_services/category_routes.js";
import * as wash_services from "./customer_services/wash_services/carwash_routes.js";
import * as car_services from "./customer_services/car_services/car_routes.js";
import customer_schedule_router from "./customer_services/schedule_routes.js";
import { dbConnection } from "./sql_utils/DBconnection.js";
import MariaSessionStore from "./sql_utils/MariaSessionStore.js";
import { initializeVerificationTable } from "./account_utils/verification_service.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, "../../.env") });
if (process.env.SKIP_STARTUP_JOBS !== "true") {
  await initializeJobs();
}
await initializeVerificationTable();

const app = express();
const server = createServer(app);
const sessionMaxAge = Number(process.env.SESH_EXPIRE_MS) || 1000 * 60 * 60;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const port = Number(process.env.PORT) || 5173;

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be configured in production");
}

const sessionStore = new MariaSessionStore();
await sessionStore.onReady();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { code: "LOGIN_RATE_LIMITED", status: "Too many login attempts" },
});
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    code: "VERIFICATION_RATE_LIMITED",
    status: "Too many verification attempts",
  },
});

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(helmet());
app.use((req, res, next) => {
  const requestId = req.get("x-request-id") || randomUUID();
  const startedAt = Date.now();
  res.setHeader("x-request-id", requestId);
  res.on("finish", () => {
    console.log(
      JSON.stringify({
        type: "http_request",
        requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - startedAt,
      }),
    );
  });
  next();
});
// Health checks stay public so the platform can assess the process before
// authentication. Protected application routes are mounted below the session
// and verified-user middleware.
app.get("/health/live", (req, res) => {
  return res.status(200).json({ status: "ok" });
});
app.get("/health/ready", async (req, res) => {
  try {
    await dbConnection.query("SELECT 1");
    return res.status(200).json({ status: "ready" });
  } catch (error) {
    return res.status(503).json({ status: "unavailable" });
  }
});
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use("/account/login", loginLimiter);
app.use("/account/verify-email", verificationLimiter);
app.use("/account/resend-verification", verificationLimiter);
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const requestOrigin = req.get("origin");
    if (requestOrigin && requestOrigin !== clientOrigin) {
      return res.status(403).json({ status: "Invalid request origin" });
    }
  }
  next();
});
app.use(
  session({
    name: "_sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionMaxAge,
    },
  }),
);

// Parse JSON before handlers read req.body; loggedIn protects all app routes.
app.use(loggedIn);
app.use(express.json({ limit: "100kb" }));

app.use("/account", account_services.router);
//if the user is an admin, they can access the admin category services, otherwise they can only access the user category services
app.use("/category", (req, res, next) => {
  if (req.session.user.role === "admin") {
    category_services.router(req, res, next);
  } else {
    user_category_services.router(req, res, next);
  }
});

app.use("/wash", wash_services.router);

app.use("/car", car_services.router);

app.use("/schedule", customer_schedule_router);

app.use("/admin", admin_services_router);

app.use((error, req, res, next) => {
  console.error(
    JSON.stringify({
      type: "http_error",
      requestId: res.getHeader("x-request-id"),
      method: req.method,
      path: req.originalUrl,
      message: error.message,
    }),
  );
  if (res.headersSent) return next(error);
  return res.status(500).json({ status: "Internal Server Error" });
});

server.listen(port, () => {
  console.log(`listening on port ${port}!`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down.`);
  server.close(async () => {
    await sessionStore.close();
    await dbConnection.end();
    process.exit(0);
  });
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

export const io = initializeSocket(server);
