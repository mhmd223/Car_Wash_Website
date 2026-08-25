const loggedIn = (req, res, next) => {
  if (
    !req.session.user &&
    req.path !== "/account/login" &&
    req.path !== "/account/register"
  ) {
    return res.status(401).json({ status: "Unauthorized" });
  }

  next();
};

export default loggedIn;
