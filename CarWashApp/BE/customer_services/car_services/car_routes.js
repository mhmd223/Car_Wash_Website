import express from "express";

import * as car_queries from "./car_queries.js";
export const router = express.Router();

router.use("/", (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ status: "Unauthorized" });
    return;
  }
  next();
});

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    let result = await car_queries.get_user_cars(user_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.post("/add_user_car", async (req, res) => {
  const { user_id, car_plate } = req.body;

  if (!user_id || !car_plate) {
    res.status(400).json({ status: "Missing required fields" });
    return;
  }

  if (await car_queries.add_user_car(user_id, car_plate)) {
    res.status(200).json({ message: "Car added successfully" });
  } else {
    res.status(400).json({ status: "Invalid data or car already added" });
  }
});
