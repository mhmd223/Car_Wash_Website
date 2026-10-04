import jwt from "jsonwebtoken";

function generateToken(payload, secret, options) {
  return jwt.sign(payload, secret, options, (err, token) => {
    if (err) {
      throw err;
    }
    return token;
  });
}

function verifyToken(token, clientSecret, options) {
  return jwt.verify(token, clientSecret, options);
}

function decodeToken(token, options) {
  return jwt.decode(token, options);
}

function refreshToken(token, secret, options) {
  const decoded = jwt.decode(token, options);
  if (!decoded) {
    throw new Error("Invalid token");
  }
  return jwt.sign(decoded, secret, options);
}

export { generateToken, verifyToken, decodeToken, refreshToken };
