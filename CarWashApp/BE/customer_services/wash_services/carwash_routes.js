import express from "express";
import * as wash_operations from "./carwash_queries.js";
import { client } from "../../redis.js";
export const router = express.Router();

// middleware that checks for an authenticated session on every route
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ status: "Unauthorized" });
    return;
  }
  next();
});

router.get("/user_washes/:id", async (req, res) => {
  const { id } = req.params;
  await client.del(`user:${id}:washes`);
  const userData = await client.get(`user:${id}:washes`);

  if (!userData) {
    const userWashes = await wash_operations.get_user_washes(id);
    client.set(`user:${id}:washes`, JSON.stringify(userWashes));
    res.json(userWashes);
    return;
  }

  res.json(userData);
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
  else {
    const userWashes = await wash_operations.get_user_washes(id);
    client.set(`user:${id}:washes`, JSON.stringify(userWashes));

    res.status(200).send("Wash succesfully booked");
  }
});
