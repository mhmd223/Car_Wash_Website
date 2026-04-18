import express from "express";
import * as category_queries from "./category_queries.js";

export const router = express.Router();

// middleware that checks for an authenticated session on every route
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ status: "Unauthorized" });
    return;
  }
  next();
});

router.get("/get_categories", async (req, res) => {
  try {
    const categories = await category_queries.get_categories_query();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});
