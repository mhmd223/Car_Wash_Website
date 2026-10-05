// Authentication and verified-user gate applied before protected application routes.
import * as tokenUtils from "../token_utils/token.js";
import { get_user_by_id } from "../account_utils/acount_queries.js";

export async function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;

  if (!token || !secret) {
    console.log("Missing token or secret.");
    return res.status(401).json({ status: "Unauthorized" });
  }

  let payload;
  try {
    payload = tokenUtils.verifyToken(token, secret);
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(401).json({ status: "Unauthorized" });
  }

  const userId = Number(payload.sub);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    console.log("Invalid user ID extracted from token:", userId);
    return res.status(401).json({ status: "Unauthorized" });
  }

  try {
    const user = await get_user_by_id(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(401).json({ status: "Unauthorized" });
    }
    if (Number(user.verified) !== 1) {
      console.log("User not verified for ID:", userId);
      return res.status(401).json({ status: "Unauthorized" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.log("Could not load authenticated user:", error);
    return res.status(500).json({ status: "Authentication failed" });
  }
}

const loggedIn = authenticateToken;

export default loggedIn;
