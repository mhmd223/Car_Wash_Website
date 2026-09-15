import express from "express";

// car_routes.js: defines endpoints for customer car operations
import * as car_queries from "./car_queries.js";
import { validatePlateFormat } from "./car_validator.js";
export const router = express.Router();

// middleware that checks for an authenticated session on every route
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ status: "Unauthorized" });
    return;
  }
  next();
});

// GET /:user_id - retrieve all cars tied to a specific user
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    if (Number(user_id) !== Number(req.session.user.id)) {
      return res.status(403).json({
        code: "FORBIDDEN_RESOURCE",
        status: "You can only access your own cars",
      });
    }

    let result = await car_queries.get_user_cars(user_id);
    return res.status(200).json(result === "No cars found" ? [] : result);
  } catch (err) {
    // catch any database or logic errors
    res.status(500).json({ status: "Something went wrong" });
  }
});

// POST /add_user_car - add a new car entry for a user
router.post("/add_user_car", async (req, res) => {
  const { user_id, car_plate } = req.body;
  if (Number(user_id) !== Number(req.session.user.id)) {
    return res.status(403).json({
      code: "FORBIDDEN_RESOURCE",
      status: "You can only add cars to your own account",
    });
  }
  if (!car_plate || !validatePlateFormat(car_plate)) {
    return res.status(400).json({
      code: "INVALID_CAR_PLATE",
      status: "Enter a valid license plate number",
    });
  }

  if (await car_queries.add_user_car(user_id, car_plate)) {
    return res.status(200).json({ message: "Car added successfully" });
  } else {
    return res.status(400).json({
      code: "CAR_NOT_FOUND_OR_ALREADY_ADDED",
      status: "Car could not be found or is already added",
    });
  }
});

router.delete("/remove_user_car", async (req, res) => {
  const { user_id, car_plate } = req.body;
  if (Number(user_id) !== Number(req.session.user.id)) {
    return res.status(403).json({
      code: "FORBIDDEN_RESOURCE",
      status: "You can only remove your own cars",
    });
  }
  if (!car_plate) {
    return res.status(400).json({
      code: "MISSING_CAR_PLATE",
      status: "A license plate is required",
    });
  }

  if (await car_queries.remove_user_car(user_id, car_plate)) {
    return res.status(200).json({ message: "Car removed successfully" });
  } else {
    return res.status(404).json({
      code: "CAR_NOT_FOUND",
      status: "Car not found on your account",
    });
  }
});
