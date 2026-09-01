import axios from "axios";
const API_URL = "http://localhost:5173/admin/";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}Users/all`, {
      withCredentials: true,
    });
     
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching all users:", err);
    throw err;
  }
};
