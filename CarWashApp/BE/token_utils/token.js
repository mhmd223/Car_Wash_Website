import jwt from "jsonwebtoken";

function generateToken(payload, secret, options) {
  return jwt.sign(payload, secret, { ...options, algorithm: "HS256" });
}

function verifyToken(token, clientSecret, options) {
  return jwt.verify(token, clientSecret, {
    ...options,
    algorithms: ["HS256"],
  });
}

function decodeToken(token, options) {
  return jwt.decode(token, options);
}

function setTokenCookie(res, token, options) {
  res.cookie("token", token, { ...options });
}

function refreshToken(token, secret, options) {
  const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
  if (!decoded || typeof decoded !== "object") {
    throw new Error("Invalid token");
  }
  const { iat, exp, nbf, ...payload } = decoded;
  return generateToken(payload, secret, options);
}

export {
  generateToken,
  verifyToken,
  decodeToken,
  refreshToken,
  setTokenCookie,
};
