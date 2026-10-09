// Express application bootstrap: middleware, sessions, routes, health checks, and shutdown.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import path from "path";
import loggedIn from "./middleware/loggedIn.js";
import { globalLimiter, loginLimiter } from "./middleware/rateLimiters.js";
import admin_services_router from "./admin_services/router.js";
import * as account_services from "./account_utils/account_services.js";
import * as category_services from "./admin_services/category_services/category_services.js";
import * as user_category_services from "./customer_services/category_services/category_routes.js";
import * as wash_services from "./customer_services/wash_services/carwash_routes.js";
import * as car_services from "./customer_services/car_services/car_routes.js";
import customer_schedule_router from "./customer_services/schedule_routes.js";
import { dbConnection } from "./sql_utils/DBconnection.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, "../../.env") });

const app = express();
export const server = createServer(app);
const normalizeOrigin = (value) => value?.trim().replace(/\/$/, "") || "";
const allowedOrigins = new Set(
  [
    process.env.CLIENT_ORIGIN,
    process.env.PROD_ORIGIN,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
  ]
    .flatMap((value) =>
      (value || "").split(",").map(normalizeOrigin).filter(Boolean),
    )
    .map((value) => value.toLowerCase()),
);
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return allowedOrigins.has(origin.toLowerCase().replace(/\/$/, ""));
};

if (
  process.env.NODE_ENV === "production" &&
  !(process.env.JWT_SECRET || process.env.SESSION_SECRET)
) {
  throw new Error("JWT_SECRET must be configured in production");
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        console.log(`Allowed origin: ${origin}`);
        callback(null, origin || true);
        return;
      }
      console.log(`Blocked origin: ${origin}`);
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-request-id",
      "Access-Control-Allow-Origin",
    ],
  }),
);
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
// authentication. Protected application routes are mounted below JWT auth.
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

app.use(globalLimiter);
app.use("/account/login", loginLimiter);

app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const requestOrigin = req.get("origin");
    if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
      return res.status(403).json({ status: "Invalid request origin" });
    }
  }
  next();
});

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use("/account", account_services.router);

// JSON is parsed before route handlers; loggedIn protects all app routes.
app.use(loggedIn);

//if the user is an admin, they can access the admin category services, otherwise they can only access the user category services
app.use("/category", (req, res, next) => {
  if (req.user.role === "admin") {
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

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down.`);
  server.close(async () => {
    await dbConnection.end();
    process.exit(0);
  });
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
