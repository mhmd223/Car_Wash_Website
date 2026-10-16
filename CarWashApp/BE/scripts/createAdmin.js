import bcrypt from "bcrypt"; // use whatever your register code uses
import { dbConnection } from "../sql_utils/DBconnection.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const username = process.env.ADMIN_USERNAME;

if (!email || !password || !username) {
  console.error("Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_USERNAME");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
await dbConnection.query(
  "INSERT INTO users (username, email, password,phone, role, verified) VALUES (?, ?, ?, '0525164474', 'admin', 1)",
  [username, email, hash],
);
console.log("Admin created");
await dbConnection.end();
