import express from "express";
import * as accountQueries from "./account_queries.js";

const router = express.Router();

const destroySessionsForUser = (req, email) => {
  if (typeof req.sessionStore.destroyByUserEmail === "function") {
    return req.sessionStore.destroyByUserEmail(email);
  }

  return new Promise((resolve, reject) => {
    // Fallback keeps this route compatible with alternative express-session stores.
    req.sessionStore.all((error, sessions) => {
      if (error) {
        reject(error);
        return;
      }

      const sessionIds = Object.entries(sessions || {})
        .filter(([, session]) => session.user?.email === email)
        .map(([sessionId]) => sessionId);

      Promise.all(
        sessionIds.map(
          (sessionId) =>
            new Promise((destroyResolve, destroyReject) => {
              req.sessionStore.destroy(sessionId, (destroyError) => {
                if (destroyError) destroyReject(destroyError);
                else destroyResolve();
              });
            }),
        ),
      )
        .then(() => resolve(sessionIds.length))
        .catch(reject);
    });
  });
};

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

router.post("/verify", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await accountQueries.verify_user(email);
    res.json({ success: result });
  } catch (err) {
    res
      .status(500)
      .json({ status: "Internal Server Error", error: err.message });
  }
});

router.post("/update-role", async (req, res) => {
  const { email, newRole } = req.body;
  try {
    const result = await accountQueries.update_user_role({ email, newRole });
    if (!result) {
      return res.status(404).json({ status: "User not found" });
    }

    const invalidatedSessions = await destroySessionsForUser(req, email);
    res.json({ success: true, invalidatedSessions });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ status: "Internal Server Error" });
  }
});

export default router;
