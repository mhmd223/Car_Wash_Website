import axios from "axios";
import { statusConfig } from "../components/WashObject/wash";

const API_URL = "http://localhost:5173/wash";

export const getUserWashes = async (userId) => {
  const response = await axios.get(`${API_URL}/user_washes/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const bookWash = async (bookingData) => {
  const response = await axios.post(`${API_URL}/book_wash`, bookingData, {
    withCredentials: true,
  });

  return response.data;
};

export const getUserStats = async (washId) => {
  const response = await axios.get(`${API_URL}/user_washes/${washId}`, {
    withCredentials: true,
  });
  return {
    amount_of_washes: response.data.length,
    completed_washes: response.data.filter(
      (wash) => statusConfig[wash.Wash_Status]?.label === "Completed",
    ).length,
  };
};
