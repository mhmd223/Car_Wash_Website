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
    await conn.query("DELETE FROM wash_category WHERE ID=?", [categoryID]);
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export async function update_category_query(categoryID, name, price) {
  const conn = await dbConnection.getConnection();
  try {
    await conn.query("UPDATE wash_category SET name=?, price=? WHERE id=?", [
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
export async function get_categories_query() {
  const conn = await dbConnection.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM wash_category");
    return rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export async function add_vehicle_type_query(
  vehicleTypeID,
  vehicleTypeName,
  vehicleTypePrice,
) {
  if (!vehicleTypeID || !vehicleTypeName || !vehicleTypePrice) {
    return { success: false, message: "Missing required fields" };
  }

  const conn = await dbConnection.getConnection();
  try {
    await conn.query("INSERT INTO vehicle_type (ID,type,price) VALUES(?,?,?)", [
      vehicleTypeID,
      vehicleTypeName,
      vehicleTypePrice,
    ]);
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
  return { success: true, message: "Vehicle type added successfully" };
}

export async function remove_vehicle_type_query(vehicleTypeID) {
  const conn = await dbConnection.getConnection();
  try {
    await conn.query("DELETE FROM vehicle_type WHERE ID=?", [vehicleTypeID]);
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
  return { success: true, message: "Vehicle type removed successfully" };
}

export async function update_vehicle_type_query(vehicleTypeID, name, price) {
  const conn = await dbConnection.getConnection();
  try {
    await conn.query("UPDATE vehicle_type SET type=?, price=? WHERE id=?", [
      name,
      price,
      vehicleTypeID,
    ]);
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
  return { success: true, message: "Vehicle type updated successfully" };
}

export async function get_vehicle_types_query() {
  const conn = await dbConnection.getConnection();

  try {
    const [rows] = await conn.query("SELECT * FROM vehicle_type");
    return rows;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}
