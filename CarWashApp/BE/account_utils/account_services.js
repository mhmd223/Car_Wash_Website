import express from "express";
import {
  registerAcc,
  verifyAcc,
  validate_login,
  edit_user,
  get_user_by_id,
} from "./acount_queries.js";

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
  else
    res
      .status(200)
      .json({ message: "Successfully registered!", registered: result });
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

  if (!result)
    res
      .status(401)
      .json({ status: "Invalid email or password", loggedIn: false });
  else {
    req.session.user = {
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone,
      role: result.role,
    };

    req.session.save(() => {
      res.status(200).json({
        message: `Welcome, ${result.username}!`,
        loggedIn: true,
        user: req.session.user,
      });
    });
  }
});

/**
 * @route PUT /verify/:id
 * @desc Verify a user's account by their numeric ID. Sets the user's `verified` status to true.
 * Returns a success message or an error status.
 * parameters:
 * - id: User's numeric ID (integer, passed as URL parameter)
 */
router.put("/verify/:id", async (req, res) => {
  const { id } = req.params;
  const result = await verifyAcc(id);

  if (!result) res.status(404).json({ status: "User not found" });
  else res.status(200).json({ message: "Account verified successfully!" });
  return;
});

/**
 *
 * @route GET /logout
 * @desc Log out the current user by destroying their session.
 * Returns a success message or an error status.
 * parameters: None
 */

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ status: "Error occurred while logging out" });
    } else {
      res
        .status(200)
        .json({ message: "Successfully logged out!", loggedOut: true });
    }
  });
});

router.get("/me", async (req, res) => {
  const result = req.session.user;
  if (!result) res.status(404).json(undefined);
  else res.status(200).json(result);
});

router.post("/edit", async (req, res) => {
  console.log("editing user");

  const { id, username, email, phone, password } = req.body;
  const result = await edit_user(id, username, email, phone, password);
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
