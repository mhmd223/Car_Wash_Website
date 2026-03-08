import express from "express";

import * as car_queries from "./car_queries.js";
export const router = express.Router();

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id);
  let result = await car_queries.get_user_cars(user_id);
  res.json(result);
});

router.post("/add_user_car", async (req, res) => {
  const { user_id, car_plate } = req.body;

  if (!user_id || !car_plate) {
    res.send("missing field");
    return;
  }

  if (await car_queries.add_user_car(user_id, car_plate)) {
    res.send("car added succesfully");
  } else res.send("invalid data or car already added");
});
