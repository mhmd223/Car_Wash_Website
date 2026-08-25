import { dbConnection } from "../../sql_utils/DBconnection";

export async function get_all_users() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query("SELECT email,username,role,phone FROM users");
    return res[0];
  } finally {
    conn.release();
  }
}

export async function get_user_by_email(email) {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT email,username,role,phone FROM users WHERE email=?",
      [email],
    );
    return res[0][0];
  } finally {
    conn.release();
  }
}

export async function update_user_role(usersToUpdate) {
  const moreThanOneUser = usersToUpdate.length > 1;

  let updateSuccessful = true; //indicates if the update was successful for all users

  if (moreThanOneUser) {
    const conn = await dbConnection.getConnection();
    await conn.beginTransaction();
    try {
      for (const { newRole, email } of usersToUpdate) {
        await conn.query("UPDATE users SET role=? WHERE email=?", [
          newRole,
          email,
        ]);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } else {
    const { email, newRole } = usersToUpdate[0];
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
  }
  return updateSuccessful;
}
