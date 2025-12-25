const express = require("express");
const server = express();
const { dbconnection } = require("./sql_utils/DBconnection");

server.listen(3000, () => {
  console.log("listening on port 3000!");
});
