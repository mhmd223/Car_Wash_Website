import express from "express";
import * as category_queries from "./category_queries.js";
export const router = express.Router();

router.post("/add_category", async (req, res) => {
  try {
    const { id, name, price } = req.body;

    await category_queries.add_category_query(id, name, price);
    res.send("added succesfully");
  } catch (err) {
    return false;
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
