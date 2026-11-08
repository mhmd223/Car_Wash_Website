import express from "express";
import * as category_queries from "./category_queries.js";
import { WASH_EVENTS } from "../../../shared/events.js";
import { getIO } from "../../sockets/index.js";
import { roles } from "../../data/roles.js";
const router = express.Router();

router.post("/add_category", async (req, res) => {
  try {
    const user = req.user;
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

router.post("/add_vehicle_type", async (req, res) => {
  try {
    const { id, name, price } = req.body;
    const result = await category_queries.add_vehicle_type_query(
      id,
      name,
      price,
    );
    if (!result.success) {
      res.status(400).json({ status: result.message });
      return;
    }
    res.status(200).json({ message: "Vehicle type added successfully" });
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.put("/update_vehicle_type", async (req, res) => {
  try {
    const { id, name, price } = req.body;
    await category_queries.update_vehicle_type_query(id, name, price);
    getIO().emit(WASH_EVENTS.VEHICLE_TYPE_UPDATED, { id, name, price });
    res.status(200).json({ message: "Vehicle type updated successfully" });
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.delete("/remove_vehicle_type", async (req, res) => {
  try {
    const { id } = req.body;
    await category_queries.remove_vehicle_type_query(id);
    getIO().emit(WASH_EVENTS.VEHICLE_TYPE_UPDATED, { id });
    res.status(200).json({ message: "Vehicle type deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.put("/update_category", async (req, res) => {
  try {
    const { id, name, price } = req.body;
    await category_queries.update_category_query(id, name, price);
    getIO().emit(WASH_EVENTS.CATEGORY_UPDATED, { id, name, price });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.delete("/remove_category", async (req, res) => {
  try {
    const { id } = req.body;
    await category_queries.remove_category_query(id);
    getIO().emit(WASH_EVENTS.CATEGORY_UPDATED, { id });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.get("/get_categories", async (req, res) => {
  try {
    const categories = await category_queries.get_categories_query();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ status: "Something went wrong" });
  }
});

router.get("/get_vehicle_types", async (req, res) => {
  try {
    const vehicleTypes = await category_queries.get_vehicle_types_query(
     
    );
    res.status(200).json(vehicleTypes);
  } catch (err) {
    console.error("Error fetching vehicle types:", err);
    res.status(500).json({ status: "Something went wrong" });
  }
});

export default router;
