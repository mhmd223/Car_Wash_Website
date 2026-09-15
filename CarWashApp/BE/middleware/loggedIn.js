// Authentication and verified-user gate applied before protected application routes.
const loggedIn = (req, res, next) => {
  const publicPaths = [
    "/account/login",
    "/account/register",
    "/account/verify-email",
    "/account/resend-verification",
  ];

  if (!req.session.user && !publicPaths.includes(req.path)) {
    console.log(
      "Unauthorized access attempt to",
      req.path,
      "by user:",
      req.session.user?.email,
    );
    return res.status(401).json({ status: "Unauthorized" });
  }

  if (
    req.session.user &&
    !publicPaths.includes(req.path) &&
    req.session.user.verified !== 1 &&
    req.session.user.verified !== true
  ) {
    return res.status(403).json({
      code: "EMAIL_NOT_VERIFIED",
      status: "Verify your email before using the application",
      email: req.session.user.email,
    });
  }

  next();
};

export default loggedIn;
