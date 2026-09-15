import { dbConnection } from "../../sql_utils/DBconnection.js";

export async function get_sales_report() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT Wash_Status, DATE_FORMAT(Wash_Date, '%Y-%m-%d') AS Wash_Date, SUM(wash_category.Price) AS Total_Sales FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID WHERE Wash_Status IN (-1, 2) GROUP BY Wash_Status, DATE_FORMAT(Wash_Date, '%Y-%m-%d') ORDER BY Wash_Date ASC",
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
      "SELECT Wash_Status, DATE_FORMAT(Wash_Date, '%Y-%m-%d') AS Wash_Date, SUM(wash_category.Price) AS Total_Sales FROM car_wash JOIN wash_category ON car_wash.Category_ID = wash_category.ID WHERE Wash_Status IN (-1, 2) AND Wash_Date BETWEEN ? AND ? GROUP BY Wash_Status, DATE_FORMAT(Wash_Date, '%Y-%m-%d') ORDER BY Wash_Date ASC",
      [startDate, endDate],
    );
    return res[0];
  } finally {
    conn.release();
  }
}

export async function get_most_washed_vehicles() {
  const conn = await dbConnection.getConnection();
  try {
    const res = await conn.query(
      "SELECT car_wash.Car_Plate AS License_Plate, COALESCE(cars.Brand, 'Unknown') AS Car_Brand, COALESCE(cars.Model, 'Unknown') AS Car_Model, COUNT(*) AS Wash_Count FROM car_wash LEFT JOIN cars ON car_wash.Car_Plate = cars.License_Plate WHERE car_wash.Wash_Status = 2 GROUP BY car_wash.Car_Plate, cars.Brand, cars.Model ORDER BY Wash_Count DESC, License_Plate ASC LIMIT 10",
    );
    return res[0];
  } finally {
    conn.release();
  }
}
