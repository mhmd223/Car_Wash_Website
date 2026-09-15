import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5173"}/`;

export const getSchedule = async () => {
  try {
    const response = await axios.get(`${API_URL}schedule`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching schedule:", err);
    throw err;
  }
};
