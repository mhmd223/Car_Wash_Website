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
  if (Number(id) !== Number(req.session.user.id)) {
    return res
      .status(403)
      .json({ code: "FORBIDDEN_RESOURCE", status: "Forbidden" });
  }
  const userWashes = await wash_operations.get_user_washes(id);
  return res.json(userWashes);
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

  if (Number(Cust_ID) !== Number(req.session.user.id)) {
    return res
      .status(403)
      .json({ code: "FORBIDDEN_RESOURCE", status: "Forbidden" });
  }
  if (!Car_Plate || !Wash_Date || !Category_ID) {
    return res
      .status(400)
      .json({
        code: "INVALID_BOOKING",
        status: "Car, time, and category are required",
      });
  }

  const washDate = new Date(Wash_Date);
  if (Number.isNaN(washDate.getTime()) || washDate <= new Date()) {
    return res
      .status(400)
      .json({ code: "INVALID_WASH_DATE", status: "Choose a future wash time" });
  }

  try {
    const result = await wash_operations.book_wash(
      Car_Plate,
      Cust_ID,
      Wash_Date,
      Category_ID,
    );

    if (result.errorCode === "ALREADY_BOOKED") {
      return res
        .status(409)
        .json({
          code: result.errorCode,
          status: "That time is already booked",
        });
    }
    if (result.errorCode === "BOOKING_BUSY") {
      return res
        .status(503)
        .json({
          code: result.errorCode,
          status: "That time is being booked. Try again",
        });
    }
    if (result.errorCode === "CAR_NOT_OWNED") {
      return res
        .status(400)
        .json({
          code: result.errorCode,
          status: "That car is not on your account",
        });
    }
    if (result.errorCode === "CATEGORY_NOT_FOUND") {
      return res
        .status(400)
        .json({
          code: result.errorCode,
          status: "That wash category is unavailable",
        });
    }

    if (result.userWashes) {
      washEvents.newWashEvent(io, result.userWashes);
      return res.status(200).json({
        message: "Wash successfully booked",
        wash: result.userWashes,
      });
    }

    return res
      .status(500)
      .json({ code: "BOOKING_FAILED", status: "Could not book wash" });
  } catch (error) {
    console.error("Error booking wash:", error);
    return res
      .status(500)
      .json({ code: "BOOKING_FAILED", status: "Could not book wash" });
  }
});
