// Authentication and verified-user gate applied before protected application routes.
const loggedIn = (req, res, next) => {
  const publicPaths = ["/account/login", "/account/register"];

  if (!req.session.user && !publicPaths.includes(req.path)) {
    console.log(
      "Unauthorized access attempt to",
      req.path,
      "by user:",
      req.session.user?.email,
    );
    return res.status(401).json({ status: "Unauthorized" });
  }

  next();
};

export default loggedIn;
