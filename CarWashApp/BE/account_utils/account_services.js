import express from "express";
import {
  registerAcc,
  validate_login,
  edit_user,
  get_user_by_id,
} from "./acount_queries.js";
import {
  initializeVerificationTable,
  sendVerificationCode,
  verifyEmailCode,
} from "./verification_service.js";

export const router = express.Router();

router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;
  if (typeof email !== "string" || !/^\d{6}$/.test(String(code))) {
    return res.status(400).json({ code: "INVALID_VERIFICATION_INPUT" });
  }

  try {
    const result = await verifyEmailCode(
      email.trim().toLowerCase(),
      String(code),
    );
    if (!result.verified) return res.status(400).json(result);
    return res.json({ verified: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ code: "VERIFICATION_FAILED" });
  }
});

router.post("/resend-verification", async (req, res) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  if (!email) return res.status(400).json({ code: "INVALID_EMAIL" });

  try {
    const result = await sendVerificationCode(email);
    if (!result.sent) return res.status(429).json(result);
    return res.json({ sent: true });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({ code: "VERIFICATION_EMAIL_FAILED" });
  }
});
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
    try {
      await sendVerificationCode(email.trim().toLowerCase());
    } catch (error) {
      console.error("Error sending registration verification email:", error);
      return res.status(500).json({ code: "VERIFICATION_EMAIL_FAILED" });
    }
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

  if (!result)
    res
      .status(401)
      .json({ status: "Invalid email or password", loggedIn: false });
  else if (!result.verified) {
    return res.status(403).json({
      code: "EMAIL_NOT_VERIFIED",
      email: result.email,
      status: "Verify your email before logging in",
      loggedIn: false,
    });
  } else {
    req.session.user = {
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone,
      role: result.role,
      verified: result.verified,
      user_agent: req.headers["user-agent"] || "unknown",
    };

    req.session.save(() => {
      res.status(200).json({
        message: `Welcome, ${result.username}!`,
        loggedIn: true,
        user: req.session.user,
      });
    });
    console.log(`User ${req.session.user.username} logged in successfully.`);
  }
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

  const { username, email, phone, password } = req.body;
  const result = await edit_user(
    req.session.user.id,
    username,
    email,
    phone,
    password,
  );
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
