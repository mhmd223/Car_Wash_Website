import express from "express";
import * as accountQueries from "./account_queries.js";

const router = express.Router();

router.get("/all", async (req, res) => {

  try {
    console.log("Fetching all users");
    const users = await accountQueries.get_all_users();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ status: "Internal Server Error", error: err.message });
  }
});

export default router;
