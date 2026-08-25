import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function add_category_query(
  categoryID,
  categoryName,
  categoryPrice,
) {
  const conn = await dbConnection.getConnection();
  try {
    await conn.query(
      "INSERT INTO wash_category (ID,Name,Price) VALUES(?,?,?)",
      [categoryID, categoryName, categoryPrice],
    );
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export async function remove_category_query(categoryID) {
  const conn = await dbConnection.getConnection();
  try {
    await conn.query("DELETE FROM wash_category where ID=?", categoryID);
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export async function update_category_query(categoryID, name, price) {
  const conn = await dbConnection.getConnection();
  try {
    await conn.query("UPDATE wash_category name=? price=? WHERE id=?", [
      name,
      price,
      categoryID,
    ]);
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}
