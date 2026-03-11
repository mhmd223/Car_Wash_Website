import express from "express";
import * as category_queries from "./category_queries.js";
import { roles } from "../../data/roles.js";
export const router = express.Router();

router.post("/add_category", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || user.role !== roles.ADMIN) {
      res.status(403).json({ status: "Unauthorized" });
      return;
    }
    const { id, name, price } = req.body;

    await category_queries.add_category_query(id, name, price);
    res.status(200).json({ message: "Category added successfully" });
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.put("/update_category", async (req, res) => {
  try {
    const { id, name, price } = req.body;
    await category_queries.update_category_query(id, name, price);
  } catch (err) {
    return false;
  }
});

router.delete("/remove_category", async (req, res) => {
  try {
    const { id } = req.body;
    await category_queries.remove_category_query(id);
    res.send("deleted");
  } catch (err) {
    return false;
  }
});
