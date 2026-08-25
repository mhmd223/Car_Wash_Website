import { dbConnection } from "../sql_utils/DBconnection.js";
import {
  check_phone,
  check_username,
  compare_hash,
  hash_password,
} from "./account_validator.js";

// Validate user credentials during login.
// Returns the user object if valid, otherwise `null`.
export async function validate_login(email, password) {
  const conn = await dbConnection.getConnection();
  try {
    let res = await conn.query("SELECT * FROM users WHERE email=?", [email]);

    if (res[0].length) {
      const user = res[0][0];
      const hashed_password = user.password;
      const is_valid = await compare_hash(hashed_password, password);

      return is_valid ? user : null;
    }

    return null;
  } catch (err) {
    return null;
  } finally {
    conn.release();
  }
}
// Retrieve a user by their numeric `id`.
// Returns the user object (id, username, email, phone, role) or `null` if not found.
export async function verifyAcc(id) {
  const conn = await dbConnection.getConnection();
  try {
    let res = await get_user_by_id(id);

    if (res) {
      await conn.query("UPDATE users SET verified = 1 WHERE id=?", [id]);

      return res;
    }

    return res;
  } catch (err) {
    return null;
  } finally {
    conn.release();
  }
}

// Register a new user after validating inputs and hashing the password.
// Returns `true` on success, `false` on failure.
export async function registerAcc(
  email,
  username,
  phone,
  password,
  confirmPasswowrd,
) {
  const conn = await dbConnection.getConnection();
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
      await conn.query(
        "INSERT INTO users (username,email,password,phone,role) VALUES(?,?,?,?,?)",
        [username, email, hashed_password, phone, "Customer"],
      );
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  } finally {
    conn.release();
  }
}

// Check whether an email already exists in the `users` table.
// Returns `true` if found, otherwise `false`.
export async function checkEmailExists(email) {
  const conn = await dbConnection.getConnection();
  try {
    let res = await conn.query("SELECT * FROM users WHERE email=?", [email]);

    if (res[0].length) return true;

    return false;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

// Fetch a user record by `id` (public helper).
// Returns the user object or `null` if not found.
export async function get_user_by_id(id) {
  const conn = await dbConnection.getConnection();
  try {
    let res = await conn.query(
      "SELECT id,username,email,phone,role FROM users WHERE id = ?",
      [id],
    );

    if (res[0].length) return res[0][0];

    return null;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

export async function edit_user(id, username, email, phone, password) {
  const conn = await dbConnection.getConnection();
  try {
    const user = await conn.query("SELECT * FROM users WHERE id = ?", [id]);

    const userExists = user[0].length > 0;

    if (!userExists) return { status: "User not found", edited: false };

    const validPassword =
      password && (await compare_hash(user[0][0].password, password));

    if (!validPassword) return { status: "Invalid password", edited: false };

    const fields = [];
    const values = [];

    if (username !== undefined) {
      if (!check_username(username)) return null;
      fields.push("username = (@newUsername := ?)");
      values.push(username);
    }

    if (email !== undefined) {
      if (email !== user[0][0].email && (await checkEmailExists(email)))
        return null;
      fields.push("email = (@newEmail := ?)");
      values.push(email);
    }

    if (phone !== undefined) {
      if (!check_phone(phone)) return null;
      fields.push("phone = (@newPhone := ?)");
      values.push(phone);
    }

    if (!fields.length) return null;

    values.push(id);
    await conn.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    const updatedData = await conn.query(
      "SELECT id,  COALESCE(@newUsername, username) AS username, COALESCE(@newEmail, email) AS email, COALESCE(@newPhone, phone) AS phone FROM users WHERE id = ?",
      [id],
    );
    console.log("succesfully updated user data ", updatedData[0][0]);

    return updatedData[0][0];
  } catch (err) {
    console.log("editing user query error", err);

    return null;
  } finally {
    conn.release();
  }
}
