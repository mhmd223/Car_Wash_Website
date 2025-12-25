const sql = require("mysql2");

const dbConnection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carwash_database",
});

dbConnection.connect((err) => {
  if (err) throw err;
  console.log("Conncted to database " + dbConnection.config.database);
});

dbConnection.on("error", (err) => {
  if (err) throw err;

  console.log("Connected!");
});

module.exports = { dbconnection: dbConnection };
