const loggedIn = (req, res, next) => {

  if (
    !req.session.user &&
    req.path !== "/account/login" &&
    req.path !== "/account/register"
  ) {
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
