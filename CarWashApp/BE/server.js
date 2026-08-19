import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { createServer } from "http";
import { initializeSocket } from "./sockets/index.js";
import * as account_services from "./account_utils/account_services.js";
import * as category_services from "./admin_services/category_services/category_services.js";
import * as user_category_services from "./customer_services/category_services/category_routes.js";
import * as wash_services from "./customer_services/wash_services/carwash_routes.js";
import * as car_services from "./customer_services/car_services/car_routes.js";

dotenv.config({ path: "../../.env" });

const app = express();
const server = createServer(app);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: eval(process.env.SESH_EXPIRE),
    },
  }),
);

app.use("/", (req, res, next) => {
  if (
    !req.session.user &&
    req.path !== "/account/login" &&
    req.path !== "/account/register"
  ) {
    return res.status(401).json({ status: "Unauthorized" });
  }
  next();
});
app.use(express.json());

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

server.listen(5173, () => {
  console.log("listening on port 5173!");
});

export const io = initializeSocket(server);
