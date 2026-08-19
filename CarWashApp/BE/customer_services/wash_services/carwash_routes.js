import express from "express";
import * as wash_operations from "./carwash_queries.js";
import { io } from "../../server.js";
import * as washEvents from "../../sockets/washEvents.js";
export const router = express.Router();

// middleware that checks for an authenticated session on every route
router.use("/", (req, res, next) => {
  if (req.session.user === undefined) {
    res.status(401).json({ status: "Unauthorized" });
    return;
  }
  next();
});

router.get("/user_washes/:id", async (req, res) => {
  const { id } = req.params;
  const userWashes = await wash_operations.get_user_washes(id);
  res.json(userWashes);
});

router.get("/all_washes", async (req, res) => {
  const role = req.session.user?.role?.toLowerCase();
  if (role !== "washer" && role !== "admin") {
    console.log("Forbidden access attempt by user with role:", role);
    return res.status(403).json({ status: "Forbidden" });
  }
  const washes = await wash_operations.get_all_washes();
  res.json(washes);
});

router.put("/update_status/:id", async (req, res) => {
  const role = req.session.user?.role?.toLowerCase();
  if (role !== "washer" && role !== "admin") {
    return res.status(403).json({ status: "Forbidden" });
  }
  const { id } = req.params;
  const { status, custId } = req.body;
  const result = await wash_operations.update_wash_status(id, status);
  if (result) {
    washEvents.washStatusUpdatedEvent(io, custId, Number(id), status);
    res.status(200).json({ message: "Status updated" });
  } else res.status(404).json({ status: "Wash not found" });
});

router.post("/book_wash", async (req, res) => {
  const { Car_Plate, Cust_ID, Wash_Date, Category_ID } = req.body;

  const { alreadyBooked, userWashes } = await wash_operations.book_wash(
    Car_Plate,
    Cust_ID,
    Wash_Date,
    Category_ID,
  );

  console.log(alreadyBooked, userWashes);

  if (alreadyBooked) res.status(400).send("Wash already booked");
  else if (userWashes) {
    washEvents.newWashEvent(io, userWashes);
    res.status(200).send("Wash succesfully booked");
  }
});
