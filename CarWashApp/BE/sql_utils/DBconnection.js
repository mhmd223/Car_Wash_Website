import sqlConnect from "mysql2/promise";

export const dbConnection = await sqlConnect.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carwash_database",
});
