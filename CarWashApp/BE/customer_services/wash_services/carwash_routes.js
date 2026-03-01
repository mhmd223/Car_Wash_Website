import express from "express";
import * as wash_operations from "./carwash_queries.js";

export const router = express.Router();

router.get("/user_washes/:id", async (req, res) => {
  const { id } = req.params;

  res.json(await wash_operations.get_user_washes(id));
});

router.post("/book_wash", async (req, res) => {
  const { Car_Plate, Cust_ID, Wash_Date, Wash_Price, Category_ID } = req.body;

  const alreadyBooked = await wash_operations.book_wash(
    Car_Plate,
    Cust_ID,
    Wash_Date,
    Wash_Price,
    Category_ID,
  );

  console.log(alreadyBooked);

  if (alreadyBooked) res.status(400).send("Wash already booked");
  else res.status(200).send("Wash succesfully booked");
});
