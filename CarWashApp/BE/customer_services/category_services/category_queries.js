import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function get_categories_query() {
  try {
    const res = await dbConnection.query("SELECT * FROM wash_category");
    return res[0];
  } catch (err) {
    throw err;
  }
}
