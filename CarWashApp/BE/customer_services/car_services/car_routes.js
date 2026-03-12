import express from "express";

// car_routes.js: defines endpoints for customer car operations
import * as car_queries from "./car_queries.js";
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
    let result = await car_queries.get_user_cars(user_id);
    res.status(200).json(result);
  } catch (err) {
    // catch any database or logic errors
    res.status(500).json({ status: "Something went wrong" });
  }
});

// POST /add_user_car - add a new car entry for a user
router.post("/add_user_car", async (req, res) => {
  const { user_id, car_plate } = req.body;

  // ensure required fields are provided
  if (!user_id || !car_plate) {
    res.status(400).json({ status: "Missing required fields" });
    return;
  }

  if (await car_queries.add_user_car(user_id, car_plate)) {
    res.status(200).json({ message: "Car added successfully" });
  } else {
    // either bad input or car already exists for user
    res.status(400).json({ status: "Invalid data or car already added" });
  }
});
