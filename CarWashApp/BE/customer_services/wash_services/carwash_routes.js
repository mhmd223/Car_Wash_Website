import express from "express";
import * as wash_operations from "./carwash_queries.js";
import { client } from "../../redis.js";

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

router.get("/all_washes", async (req, res) => {
  const role = req.session.user?.role?.toLowerCase();
  if (role !== "washer" && role !== "admin") {
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
  const { status } = req.body;
  const result = await wash_operations.update_wash_status(id, status);
  if (result) res.status(200).json({ message: "Status updated" });
  else res.status(404).json({ status: "Wash not found" });
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
    const userData = await client.get(`user:${Cust_ID}:washes`);

    if (userData) {
      const parsedData = JSON.parse(userData);

      parsedData.push(userWashes);

      client.set(`user:${Cust_ID}:washes`, JSON.stringify(parsedData));
    }

    res.status(200).send("Wash succesfully booked");
  }
});
