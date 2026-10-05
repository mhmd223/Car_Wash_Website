import express from "express";

// car_routes.js: defines endpoints for customer car operations
import * as car_queries from "./car_queries.js";
import { validatePlateFormat } from "./car_validator.js";
export const router = express.Router();

// middleware that checks for an authenticated user on every route
router.use("/", (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: "Unauthorized" });
  }
  return next();
});

// GET / - retrieve cars tied to the authenticated user
router.get("/", async (req, res) => {
  try {
    const result = await car_queries.get_user_cars(req.user.id);
    return res.status(200).json(result === "No cars found" ? [] : result);
  } catch (err) {
    // catch any database or logic errors
    res.status(500).json({ status: "Something went wrong" });
  }
});

// POST /add_user_car - add a new car entry for a user
router.post("/add_user_car", async (req, res) => {
  const { car_plate } = req.body;
  if (!car_plate || !validatePlateFormat(car_plate)) {
    return res.status(400).json({
      code: "INVALID_CAR_PLATE",
      status: "Enter a valid license plate number",
    });
  }

  if (await car_queries.add_user_car(req.user.id, car_plate)) {
    return res.status(200).json({ message: "Car added successfully" });
  } else {
    return res.status(400).json({
      code: "CAR_NOT_FOUND_OR_ALREADY_ADDED",
      status: "Car could not be found or is already added",
    });
  }
});

router.delete("/remove_user_car", async (req, res) => {
  const { car_plate } = req.body;
  if (!car_plate) {
    return res.status(400).json({
      code: "MISSING_CAR_PLATE",
      status: "A license plate is required",
    });
  }

  if (await car_queries.remove_user_car(req.user.id, car_plate)) {
    return res.status(200).json({ message: "Car removed successfully" });
  } else {
    return res.status(404).json({
      code: "CAR_NOT_FOUND",
      status: "Car not found on your account",
    });
  }
});
