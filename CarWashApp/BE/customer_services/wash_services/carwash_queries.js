import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function reject_still_pending_washes() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "UPDATE car_wash SET Wash_Status = -1 WHERE Wash_Status = 0 AND Wash_Date < NOW()",
    );
    return res[0].affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function get_user_washes(customerID) {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT car_wash.ID, car_wash.Car_Plate, Cust_ID, Cust_Phone, DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i:%s') AS Wash_Date, Wash_Status, wash_category.Price, Category_ID, wash_category.Name, cars.Brand AS Car_Brand, cars.Model AS Car_Model FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID LEFT JOIN cars ON car_wash.Car_Plate = cars.License_Plate WHERE Cust_ID=?",
      [customerID],
    );

    return res[0];
  } finally {
    conn.release();
  }
}

export async function book_wash(Car_Plate, Cust_ID, Wash_Date, Category_ID) {
  const conn = await dbConnection.getConnection();
  try {
    const alreadyBooked = await isAlreadyBooked(conn, Wash_Date);
    if (alreadyBooked) return { alreadyBooked, userWashes: null };

    const user = await conn.query("SELECT phone from users where id=?", [
      Cust_ID,
    ]);
    const phone = user[0][0].phone;

    const result = await conn.query(
      "INSERT INTO car_wash (Car_Plate, Cust_ID, Cust_Phone, Wash_Date, Wash_Status,Category_id) VALUES(?,?,?,?,?,?)",
      [Car_Plate, Cust_ID, phone, Wash_Date, 0, Category_ID],
    );

    const newUserWash = await get_specific_wash(conn, result[0].insertId);

    return { alreadyBooked: false, userWashes: newUserWash };
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

async function isAlreadyBooked(conn, Wash_Date) {
  const res = await conn.query(
    "SELECT * FROM car_wash WHERE DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i') = DATE_FORMAT(?, '%Y-%m-%d %H:%i')",
    [Wash_Date],
  );
  return res[0].length > 0;
}

async function get_specific_wash(conn, washID) {
  const res = await conn.query(
    "SELECT car_wash.ID, car_wash.Car_Plate, Cust_ID, Cust_Phone, DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i:%s') AS Wash_Date, Wash_Status, wash_category.Price, Category_ID, wash_category.Name, cars.Brand AS Car_Brand, cars.Model AS Car_Model FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID LEFT JOIN cars ON car_wash.Car_Plate = cars.License_Plate WHERE car_wash.ID=?",
    [washID],
  );
  return res[0][0];
}

export async function get_all_washes() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT car_wash.ID, car_wash.Car_Plate, Cust_ID, Cust_Phone, DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i:%s') AS Wash_Date, Wash_Status, wash_category.Price, Category_ID, wash_category.Name, cars.Brand AS Car_Brand, cars.Model AS Car_Model FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID LEFT JOIN cars ON car_wash.Car_Plate = cars.License_Plate ORDER BY Wash_Date ASC ",
    );
    return res[0];
  } finally {
    conn.release();
  }
}

export async function update_wash_status(washId, newStatus) {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "UPDATE car_wash SET Wash_Status = ? WHERE ID = ?",
      [newStatus, washId],
    );
    return res[0].affectedRows > 0;
  } finally {
    conn.release();
  }
}
