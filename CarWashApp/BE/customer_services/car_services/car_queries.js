import { dbConnection } from "../../sql_utils/DBconnection.js";
import * as car_validator from "./car_validator.js";

// car_queries.js contains database helper functions for car-related data

// Attempt to insert a new car into the global cars table
// Returns true if inserted, false otherwise.
export async function add_car(Car_Plate) {
  try {
    // validate that the plate string matches expected pattern
    if (car_validator.validatePlateFormat(Car_Plate)) {
      // fetch additional car details from external source or API
      const { shnat_yitzur, tozeret_nm, kinuy_mishari } =
        await car_validator.getCarData(Car_Plate);
      console.log(
        `Adding car: ${kinuy_mishari} ${tozeret_nm} ${shnat_yitzur} with plate ${Car_Plate}`,
      ); // debug log, can be removed later
      // insert the car record into the database
      let added = await dbConnection
        .query(
          "INSERT INTO cars (Brand,Model,License_Plate) VALUES(?,?,?) on duplicate key update deleted_at=NULL",
          [kinuy_mishari, `${tozeret_nm} ${shnat_yitzur}`, Car_Plate],
        )
        .then((res) => {
          let gotAdded = Boolean(res[0].affectedRows);

          return gotAdded;
        })
        .finally((gotAdded) => {
          // passthrough of the boolean flag
          return gotAdded;
        });

      return added;
    } else {
      console.log("Invalid plate format:", Car_Plate); // debug log, can be removed later
      // invalid plate format
      return false;
    }
  } catch (err) {
    console.log("Error adding car:", err); // debug log, can be removed later
    // any error results in a failed add
    return false;
  }
}

// Link an existing or newly added car to a specific user
export async function add_user_car(user_id, Car_Plate) {
  console.log(Car_Plate); // debug log, can be removed later

  let res = await add_car(Car_Plate);
  if (res) {
    // only add to user_cars if the car exists in cars table
    let res = await dbConnection.query(
      "INSERT into user_cars(user_id,car_plate) VALUES(?,?) on duplicate key update deleted_at=NULL",
      [user_id, Car_Plate],
    );

    return res[0].affectedRows;
  } else return false;
}
// Mark a car as deleted for a specific user by setting the deleted_at timestamp
export async function remove_user_car(user_id, Car_Plate) {
  let res = await dbConnection.query(
    "UPDATE user_cars SET deleted_at=NOW() WHERE user_id=? AND car_plate=?",
    [user_id, Car_Plate],
  );
  return res[0].affectedRows;
}

// Retrieve all cars associated with a given user id
export async function get_user_cars(user_id) {
  let res = await dbConnection.query(
    "SELECT * FROM user_cars as u left join cars as c ON u.car_plate = c.License_Plate WHERE u.user_id=? and u.deleted_at IS NULL",
    [user_id],
  );

  // return array of rows, or a message if none found
  return res[0].length ? res[0] : "No cars found";
}
