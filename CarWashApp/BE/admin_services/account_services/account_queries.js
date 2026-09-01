import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function get_all_users() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT id,email,username,role,phone,verified FROM users",
    );
    return res[0];
  } finally {
    conn.release();
  }
}

export async function get_user_by_email(email) {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT id,email,username,role,phone,verified FROM users WHERE email=?",
      [email],
    );
    return res[0][0];
  } finally {
    conn.release();
  }
}

export async function update_user_role(usersToUpdate) {
  let updateSuccessful = true; //indicates if the update was successful for all users

  const { email, newRole } = usersToUpdate;
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query("UPDATE users SET role=? WHERE email=?", [
      newRole,
      email,
    ]);
    updateSuccessful = res[0].affectedRows > 0;
  } finally {
    conn.release();
  }

  return updateSuccessful;
}
