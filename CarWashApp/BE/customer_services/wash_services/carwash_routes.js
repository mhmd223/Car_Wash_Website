import express from "express";
import * as wash_operations from "./carwash_queries.js";
import { getIO } from "../../sockets/index.js";
import * as washEvents from "../../sockets/washEvents.js";
import * as wash_validation from "./carwash_validator.js";

export const router = express.Router();

// middleware that checks for an authenticated user on every route
router.use("/", (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: "Unauthorized" });
  }
  return next();
});

router.get("/user_washes", async (req, res) => {
  const userWashes = await wash_operations.get_user_washes(req.user.id);
  return res.json(userWashes);
});

router.get("/all_washes", async (req, res) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== "washer" && role !== "admin") {
    console.log("Forbidden access attempt by user with role:", role);
    return res.status(403).json({ status: "Forbidden" });
  }
  const washes = await wash_operations.get_all_washes();
  res.json(washes);
});

router.put("/update_status/:id", async (req, res) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== "washer" && role !== "admin") {
    return res.status(403).json({ status: "Forbidden" });
  }
  const { id } = req.params;
  const { status, custId } = req.body;
  const result = await wash_operations.update_wash_status(id, status);
  if (result) {
    washEvents.washStatusUpdatedEvent(getIO(), custId, Number(id), status);
    res.status(200).json({ message: "Status updated" });
  } else res.status(404).json({ status: "Wash not found" });
});

router.post("/book_wash", async (req, res) => {
  const { Car_Plate, Wash_Date, Category_ID } = req.body;

  const dateValidation = wash_validation.validateWashDate(Wash_Date);
  const bookingValidation = wash_validation.validateWashBooking(
    Car_Plate,
    Wash_Date,
    Category_ID,
  );

  console.log("Booking request received:", {
    Car_Plate,
    Wash_Date,
    Category_ID,
    userId: req.user.id,
  });

  console.log("Date validation result:", dateValidation);
  console.log("Booking validation result:", bookingValidation);

  if (!dateValidation.isValid) {
    return res.status(400).json({
      code: dateValidation.code,
      status: dateValidation.message,
    });
  }

  if (!bookingValidation.isValid) {
    return res.status(400).json({
      code: bookingValidation.code,
      status: bookingValidation.message,
    });
  }

  try {
    const result = await wash_operations.book_wash(
      Car_Plate,
      req.user.id,
      Wash_Date,
      Category_ID,
    );

    if (result.errorCode === "ALREADY_BOOKED") {
      console.log("Attempted to book an already booked time:", Wash_Date);
      return res.status(409).json({
        code: result.errorCode,
        status: "That time is already booked",
      });
    }
    if (result.errorCode === "BOOKING_BUSY") {
      console.log(
        "Attempted to book a time that is currently being booked:",
        Wash_Date,
      );
      return res.status(503).json({
        code: result.errorCode,
        status: "That time is being booked. Try again",
      });
    }
    if (result.errorCode === "CAR_NOT_OWNED") {
      console.log(
        "Attempted to book a wash for a car not owned by the user:",
        Car_Plate,
      );
      return res.status(400).json({
        code: result.errorCode,
        status: "That car is not on your account",
      });
    }
    if (result.errorCode === "CATEGORY_NOT_FOUND") {
      console.log(
        "Attempted to book a wash with a non-existent category:",
        Category_ID,
      );
      return res.status(400).json({
        code: result.errorCode,
        status: "That wash category is unavailable",
      });
    }

    if (result.userWashes) {
      washEvents.newWashEvent(getIO(), result.userWashes);
      return res.status(200).json({
        message: "Wash successfully booked",
        wash: result.userWashes,
      });
    }
    console.log("Failed to book wash:", result);

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
