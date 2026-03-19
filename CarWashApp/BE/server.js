import express from "express";
import cors from "cors";
import { sesh } from "../BE/session.js";
import * as account_services from "./account_utils/account_services.js";
import * as category_services from "./admin_services/category_services/category_services.js";
import * as wash_services from "./customer_services/wash_services/carwash_routes.js";
import * as car_services from "./customer_services/car_services/car_routes.js";

const server = express();
server.use(express.json());

server.use(cors({ origin: "http://localhost:3000", credentials: true }));

server.use(sesh);

server.use("/account", account_services.router);

server.use("/category", category_services.router);

server.use("/wash", wash_services.router);

server.use("/car", car_services.router);

server.listen(5173, () => {
  console.log("listening on port 5173!");
});
