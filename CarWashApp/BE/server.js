import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import * as account_services from "./account_utils/account_services.js";
import * as category_services from "./admin_services/category_services/category_services.js";
import * as user_category_services from "./customer_services/category_services/category_routes.js";
import * as wash_services from "./customer_services/wash_services/carwash_routes.js";
import * as car_services from "./customer_services/car_services/car_routes.js";

dotenv.config({ path: "../../.env" });

const server = express();

server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: eval(process.env.SESH_EXPIRE),
    },
  }),
);

server.use("/", (req, res, next) => {
  console.log("Session data:", req.session);
  next();
});
server.use(express.json());

server.use("/account", account_services.router);
//if the user is an admin, they can access the admin category services, otherwise they can only access the user category services
server.use("/category", (req, res, next) => {
  if (req.session.user.role === "admin") {
    category_services.router(req, res, next);
  } else {
    user_category_services.router(req, res, next);
  }
});

server.use("/wash", wash_services.router);

server.use("/car", car_services.router);

server.listen(5173, () => {
  console.log("listening on port 5173!");
});
