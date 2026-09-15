// Shared MySQL pool. Query modules borrow connections and release them in finally blocks.
import sqlConnect from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, "../../../.env") });

if (process.env.NODE_ENV === "production" && !process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD must be configured in production");
}

export const dbConnection = await sqlConnect.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "carwash_database",
  port: Number(process.env.DB_PORT) || 3306,
});
