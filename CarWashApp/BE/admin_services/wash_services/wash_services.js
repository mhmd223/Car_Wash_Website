import express from "express";
import * as wash_queries from "./wash_queries.js";
import { roles } from "../../data/roles.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  if (!req.session.user || req.session.user.role !== roles.ADMIN) {
    res.status(403).json({ status: "Unauthorized" });
    return;
  }
  next();
});

router.get("/sales_report", async (req, res) => {
  try {
    const role = req.session.user?.role?.toLowerCase();
    if (role !== roles.ADMIN.toLowerCase()) {
      return res.status(403).json({ status: "Forbidden" });
    }

    const { startDate, endDate } = req.query;
    let report =
      startDate && endDate
        ? await wash_queries.get_sales_report_by_range(startDate, endDate)
        : await wash_queries.get_sales_report();

    res.json(report);
  } catch (err) {
    res
      .status(500)
      .json({ status: "Internal Server Error", error: err.message });
  }
});
