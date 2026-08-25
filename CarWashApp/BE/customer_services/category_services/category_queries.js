import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function get_categories_query() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query("SELECT * FROM wash_category");
    return res[0];
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}
