import express from "express";
import { registerAcc } from "./acount_queries.js";

export const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, phone, password, confirmPassword } = req.body;
  const result = await registerAcc(
    email,
    username,
    phone,
    password,
    confirmPassword
  );
  if (!result) res.json({ status: "Something went wrong" });
  else res.json({ message: "Successfully registered!" });
});
