import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function get_user_washes(customerID) {
  const res = await dbConnection.query(
    "SELECT * FROM car_wash where Cust_ID=?",
    [customerID],
  );

  return res;
}

export async function book_wash(
  Car_Plate,
  Cust_ID,
  Wash_Date,
  Wash_Price,
  Category_ID,
) {
  const alreadyBooked = await isAlreadyBooked(Wash_Date);

  try {
    const user = await dbConnection.query(
      "SELECT phone from users where id=?",
      [Cust_ID],
    );

    const phone = user[0][0].phone;

    if (!alreadyBooked)
      await dbConnection.query(
        "INSERT INTO car_wash (Car_Plate, Cust_ID, Cust_Phone, Wash_Date, Wash_Status, Wash_Price,Category_id) VALUES(?,?,?,?,?,?,?)",
        [Car_Plate, Cust_ID, phone, Wash_Date, 0, Wash_Price, Category_ID],
      );
  } catch (err) {
    throw err;
  } finally {
    return alreadyBooked;
  }
}

function isAlreadyBooked(Wash_Date) {
  let res = dbConnection
    .query("SELECT * FROM car_wash WHERE Wash_Date=?", [Wash_Date])
    .then(async (res) => {
      if (res[0].length == 1) {
        return true;
      }
      return false;
    })
    .finally((result) => {
      return result;
    });

  return res;
}
