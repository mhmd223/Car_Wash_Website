// Admin schedule mutation routes; customer reads are mounted separately.
import express from "express";
import {
  getSchedule,
  uploadSchedule,
  clearSchedule,
} from "./schedule_queries.js";
import { scheduleSchema } from "./schedule_validation.js";
import { io } from "../../server.js";
import { WASH_EVENTS } from "../../../shared/events.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { schedule } = req.body;
  const parsedSchedule = scheduleSchema.safeParse(schedule);
  if (!parsedSchedule.success) {
    return res.status(400).json({
      code: "INVALID_SCHEDULE",
      error:
        "Schedule rows must contain valid day, opening time, closing time, and notes values",
    });
  }

  try {
    const result = await uploadSchedule(parsedSchedule.data);
    io.emit(WASH_EVENTS.SCHEDULE_UPDATED);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to upload schedule" });
  }
});

router.delete("/clear", async (req, res) => {
  try {
    const result = await clearSchedule();
    io.emit(WASH_EVENTS.SCHEDULE_UPDATED);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to clear schedule" });
  }
});

export default router;
