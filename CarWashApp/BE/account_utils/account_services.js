import express from "express";
import { registerAcc, validate_login, edit_user } from "./acount_queries.js";

import * as tokenUtils from "../token_utils/token.js";
import { authenticateToken } from "../middleware/loggedIn.js";
export const router = express.Router();

/** 
@route POST /register
@desc Register a new user with email, username, phone, password, and confirmPassword.
Returns a success message or an error status.
parameters:
- email: User's email address (string)
- username: Desired username (string)
- phone: User's phone number (string)
- password: User's password (string)
- confirmPassword: User's confirmation password (string)
*/
router.post("/register", async (req, res) => {
  const { username, email, phone, password, confirmPassword } = req.body;
  const result = await registerAcc(
    email,
    username,
    phone,
    password,
    confirmPassword,
  );

  if (!result)
    res
      .status(500)
      .json({ status: "Something went wrong", registered: result });
  else {
    res.status(200).json({
      message: "Successfully registered!",
      registered: result,
      verificationRequired: true,
    });
  }
});
/**
 * @route POST /login
 * @desc Authenticate a user with email and password. Sets session on success.
 * Returns a welcome message or an error status.
 * parameters:
 * - email: User's email address (string)
 * - password: User's password (string)
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await validate_login(email, password);

  if (!result) {
    console.log("Invalid login attempt for email:", email);
    return res
      .status(401)
      .json({ status: "Invalid email or password", loggedIn: false });
  }

  const token = tokenUtils.generateToken(
    { sub: String(result.id) },
    process.env.JWT_SECRET || process.env.SESSION_SECRET,
    { expiresIn: "24h" },
  );

  tokenUtils.setTokenCookie(res, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: `Welcome, ${result.username}!`,
    loggedIn: true,
  });
});

/**
 * @route PUT /verify/:id
 * @desc Verify a user's account by their numeric ID. Sets the user's `verified` status to true.
 * Returns a success message or an error status.
 * parameters:
 * - id: User's numeric ID (integer, passed as URL parameter)
 */
/**
 *
 * @route GET /logout
 * @desc Log out the current user by destroying their session.
 * Returns a success message or an error status.
 * parameters: None
 */

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res
    .status(200)
    .json({ message: "Successfully logged out!", loggedOut: true });
});

router.get("/me", authenticateToken, (req, res) => {
  return res.status(200).json({ ...req.user, loggedIn: true });
});

router.post("/edit", authenticateToken, async (req, res) => {
  const { username, email, phone, password } = req.body;
  const result = await edit_user(req.user.id, username, email, phone, password);

  if (result?.status === "User not found") {
    res.status(404).json({ status: "User not found", edited: result });
  } else if (result?.status === "Invalid password") {
    res.status(401).json({ status: "Invalid password", edited: result });
  } else if (!result) {
    res.status(500).json({ status: "Something went wrong", edited: result });
  } else {
    res
      .status(200)
      .json({ message: "Account edited successfully!", edited: result });
  }
});
