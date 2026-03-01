import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function add_category_query(
  categoryID,
  categoryName,
  categoryPrice,
) {
  try {
    await dbConnection.query(
      "INSERT INTO wash_category (ID,Name,Price) VALUES(?,?,?)",
      [categoryID, categoryName, categoryPrice],
    );
  } catch (err) {
    throw err;
  }
}

export async function remove_category_query(categoryID) {
  try {
    await dbConnection.query(
      "DELETE FROM wash_category where ID=?",
      categoryID,
    );
  } catch (err) {
    throw err;
  }
}

export async function update_category_query(categoryID, name, price) {
  try {
    await dbConnection.query("UPDATE wash_category name=? price=? WHERE id=?", [
      name,
      price,
      categoryID,
    ]);
  } catch (err) {
    throw err;
  }
}
