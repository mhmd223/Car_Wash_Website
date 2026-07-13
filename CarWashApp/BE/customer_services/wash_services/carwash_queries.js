import { client } from "../../redis.js";
import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function get_user_washes(customerID) {
  const res = await dbConnection.query(
    "SELECT car_wash.ID, Car_Plate, Cust_ID, Cust_Phone, DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i:%s') AS Wash_Date, Wash_Status, wash_category.Price, Category_ID, Name FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID WHERE Cust_ID=?",
    [customerID],
  );

  return res[0];
}

export async function book_wash(Car_Plate, Cust_ID, Wash_Date, Category_ID) {
  try {
    const { alreadyBooked, userWashes } = await isAlreadyBooked(Wash_Date).then(
      async (res) => {
        if (res) {
          return { alreadyBooked: res, userWashes: null };
        }

        const user = await dbConnection.query(
          "SELECT phone from users where id=?",
          [Cust_ID],
        );
        const phone = user[0][0].phone;

        const result = await dbConnection.query(
          "INSERT INTO car_wash (Car_Plate, Cust_ID, Cust_Phone, Wash_Date, Wash_Status,Category_id) VALUES(?,?,?,?,?,?)",
          [Car_Plate, Cust_ID, phone, Wash_Date, 0, Category_ID],
        );

        const newUserWash = await get_specific_wash(result[0].insertId);

        return { alreadyBooked: res, userWashes: newUserWash };
      },
    );

    return { alreadyBooked: alreadyBooked, userWashes: userWashes };
  } catch (err) {
    throw err;
  }
}

async function isAlreadyBooked(Wash_Date) {
  let res = dbConnection
    .query(
      "SELECT * FROM car_wash WHERE DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i') = DATE_FORMAT(?, '%Y-%m-%d %H:%i')",

      [Wash_Date],
    )
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

async function get_specific_wash(washID) {
  const res = await dbConnection.query(
    "SELECT car_wash.ID, Car_Plate, Cust_ID, Cust_Phone, DATE_FORMAT(Wash_Date, '%Y-%m-%d %H:%i:%s') AS Wash_Date, Wash_Status, wash_category.Price, Category_ID, Name FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID WHERE car_wash.ID=?",
    [washID],
  );
  return res[0][0];
}
