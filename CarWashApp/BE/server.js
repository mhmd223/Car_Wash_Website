import express from "express";
import { sesh } from "../BE/session.js";
import * as account_services from "./account_utils/account_services.js";
import * as category_services from "./admin_services/category_services/category_services.js";
import * as wash_services from "./customer_services/wash_services/carwash_routes.js";

const car = await fetch(
  "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=3095434",
  { method: "GET" },
);
console.log((await car.json()).result.records);
const server = express();

server.use(express.json());
server.use(sesh);

server.use("/account", account_services.router);

server.use("/category", category_services.router);

server.use("/wash", wash_services.router);

server.listen(3000, () => {
  console.log("listening on port 3000!");
});
