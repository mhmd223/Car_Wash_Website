import { dbConnection } from "../../sql_utils/DBconnection";

export async function get_sales_report() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT Wash_Status, DATE_FORMAT(Wash_Date, '%Y-%m-%d') AS Wash_Date, SUM(wash_category.Price) AS Total_Sales FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID WHERE Wash_Status = -1 OR Wash_Status = 2 GROUP BY DATE_FORMAT(Wash_Date, '%Y-%m-%d'), Wash_Status ORDER BY Wash_Date ASC",
    );
    return res[0];
  } finally {
    conn.release();
  }
}

export async function get_sales_report_by_range(startDate, endDate) {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT Wash_Status, DATE_FORMAT(Wash_Date, '%Y-%m-%d') AS Wash_Date, SUM(wash_category.Price) AS Total_Sales FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID WHERE (Wash_Status = -1 OR Wash_Status = 2) AND Wash_Date BETWEEN ? AND ? GROUP BY DATE_FORMAT(Wash_Date, '%Y-%m-%d'), Wash_Status ORDER BY Wash_Date ASC",
      [startDate, endDate],
    );
    return res[0];
  } finally {
    conn.release();
  }
}
