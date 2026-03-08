import express from "express";
import { registerAcc, verifyAcc, validate_login } from "./acount_queries.js";
import { raw } from "mysql2";
import { dbConnection } from "../sql_utils/DBconnection.js";

export const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, phone, password, confirmPassword } = req.body;
  const result = await registerAcc(
    email,
    username,
    phone,
    password,
    confirmPassword,
  );
  if (!result) res.json({ status: "Something went wrong" });
  else res.json({ message: "Successfully registered!" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await validate_login(email, password);

  if (!result) res.json({ status: "Invalid email or password" });
  else {
    req.session.user = {
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone,
      role: result.role,
    };
    res.json({ message: `Welcome, ${result.username}!` });
  }
});

router.put("/verify/:id", async (req, res) => {
  const { id } = req.params;
  const result = await verifyAcc(id);

  if (!result) res.json({ status: "User not found" });
  else res.json({ message: "Account verified successfully!" });
  return;
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({ status: "Error occurred while logging out" });
    } else {
      res.json({ message: "Successfully logged out!" });
    }
  });
});
