// Customer-facing schedule read endpoint; schedule mutations remain admin-only.
import express from "express";
import { getSchedule } from "../admin_services/schedule_services/schedule_queries.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const schedule = await getSchedule();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

export default router;
