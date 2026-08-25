import sqlConnect from "mysql2/promise";

export const dbConnection = await sqlConnect.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "carwash_database",
});


