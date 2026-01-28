import { dbConnection } from "../sql_utils/DBconnection.js";
import {
  check_phone,
  check_username,
  compare_hash,
  hash_password,
} from "./account_validator.js";

export async function registerAcc(
  email,
  username,
  phone,
  password,
  confirmPasswowrd,
) {
  try {
    const hashed_password = await hash_password(password);

    if (
      username &&
      check_username(username) &&
      phone &&
      check_phone(phone) &&
      (await compare_hash(hashed_password, password)) &&
      password === confirmPasswowrd &&
      email &&
      !(await checkEmailExists(email))
    ) {
      let res = await dbConnection.query(
        "INSERT INTO users (username,email,password,phone,role) VALUES(?,?,?,?,?)",
        [username, email, hashed_password, phone, "Customer"],
      );
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function checkEmailExists(email) {
  try {
    let res = await dbConnection.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (res[0].length) return true;

    return false;
  } catch (err) {
    throw err;
  }
}
