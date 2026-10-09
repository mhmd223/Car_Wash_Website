import { server } from "./app";
import { initializeSocket } from "./sockets/index.js";
import { initializeJobs } from "./jobs/index.js";

const port = Number(process.env.PORT) || 5173;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

<<<<<<< HEAD
await initializeJobs();
=======
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

 server.listen(port, () => {
   console.log(`listening on port ${port}!`);
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

>>>>>>> 21fd135dc53460e7acfe42a12f0fffc54e617824
export const io = initializeSocket(server, process.env.CLIENT_ORIGIN);
