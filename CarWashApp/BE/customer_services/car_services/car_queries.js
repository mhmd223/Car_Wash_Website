import { dbConnection } from "../../sql_utils/DBconnection";
import * as car_validator from "./car_validator";

async function add_user_car(Car_Plate, user_id) {
  try {
    if (car_validator.validatePlateFormat(Car_Plate)) {
      const { shnat_yitzur, tozar, kinuy_mishari } =
        await car_validator.getCarData(Car_Plate);

      dbConnection
        .query("INSERT INTO cars (Brand,Model,License_Plate) VALUES(?,?,?)", [
          kinuy_mishari,
          `${tozar} ${shnat_yitzur}`,
          Car_Plate,
        ])
        .then((res) => {
          if (res[0].affectedRows) {
          }
        });
    }
  } catch (err) {
    return false;
  }
}
