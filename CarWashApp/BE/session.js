import session from "express-session";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
console.log(process.env.SESSION_SECRET);

const sesh_expire = 1000 * 60 * 5;

export const sesh = session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { httpOnly: true, maxAge: sesh_expire },
});

