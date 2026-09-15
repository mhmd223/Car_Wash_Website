import express from "express";
import * as wash_queries from "./wash_queries.js";
import { roles } from "../../data/roles.js";

const router = express.Router();

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

router.get("/business_report", async (req, res) => {
  try {
    const role = req.session.user?.role?.toLowerCase();
    if (role !== roles.ADMIN.toLowerCase()) {
      return res.status(403).json({ status: "Forbidden" });
    }

    const [salesReport, mostWashedVehicles] = await Promise.all([
      wash_queries.get_sales_report(),
      wash_queries.get_most_washed_vehicles(),
    ]);

    res.json({ salesReport, mostWashedVehicles });
  } catch (err) {
    console.error("Error fetching business report:", err);
    res.status(500).json({ status: "Internal Server Error" });
  }
});

export default router;
