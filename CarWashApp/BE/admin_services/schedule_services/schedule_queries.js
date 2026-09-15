import { dbConnection } from "../../sql_utils/DBconnection.js";

const getScheduleQuery = "SELECT * FROM work_schedule";

const clearScheduleQuery = "DELETE FROM work_schedule";

export async function getSchedule() {
  let con;
  try {
    con = await dbConnection.getConnection();
    const res = await con.execute(getScheduleQuery);
    return res[0];
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  } finally {
    if (con) await con.release();
  }
}

export async function uploadSchedule(schedule) {
  let con;
  try {
    con = await dbConnection.getConnection();
    await con.beginTransaction();
    await con.execute(clearScheduleQuery);

    if (schedule.length > 0) {
      const placeholders = schedule.map(() => "(?, ?, ?, ?)").join(", ");

      const values = schedule.flatMap((row) => [
        row.Day,
        row.OpenTime,
        row.CloseTime,
        row.Notes,
      ]);

      await con.execute(
        `INSERT INTO work_schedule
       (Day, OpenTime, CloseTime, Notes)
       VALUES ${placeholders}`,
        values,
      );
    }

    await con.commit();
  } catch (error) {
    if (con) await con.rollback();
    throw error;
  } finally {
    if (con) await con.release();
  }
}

export async function clearSchedule() {
  let con;
  try {
    con = await dbConnection.getConnection();
    const res = await con.execute(clearScheduleQuery);
    return res[0];
  } catch (error) {
    console.error("Error clearing schedule:", error);
    throw error;
  } finally {
    if (con) await con.release();
  }
}
