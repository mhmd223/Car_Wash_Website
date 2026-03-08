import { dbConnection } from "../../sql_utils/DBconnection.js";
import * as car_validator from "./car_validator.js";

export async function add_car(Car_Plate) {
  try {
    if (car_validator.validatePlateFormat(Car_Plate)) {
      const { shnat_yitzur, tozeret_nm, kinuy_mishari } =
        await car_validator.getCarData(Car_Plate);

      let added = await dbConnection
        .query("INSERT INTO cars (Brand,Model,License_Plate) VALUES(?,?,?)", [
          kinuy_mishari,
          `${tozeret_nm} ${shnat_yitzur}`,
          Car_Plate,
        ])
        .then((res) => {
          let gotAdded = Boolean(res[0].affectedRows);

          return gotAdded;
        })
        .finally((gotAdded) => {
          return gotAdded;
        });

      return added;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function add_user_car(user_id, Car_Plate) {
  console.log(Car_Plate);

  let res = await add_car(Car_Plate);
  if (res) {
    let res = await dbConnection.query(
      "INSERT into user_cars(user_id,car_plate) VALUES(?,?)",
      [user_id, Car_Plate],
    );

    return res[0].affectedRows;
  } else return false;
}

export async function get_user_cars(user_id) {
  let res = await dbConnection.query(
    "SELECT * FROM user_cars as u left join cars as c ON u.car_plate = c.License_Plate WHERE u.user_id=?",
    [user_id],
  );

  return res[0].length ? res[0] : "No cars found";
}
