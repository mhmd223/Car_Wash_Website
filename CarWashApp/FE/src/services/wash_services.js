import axios from "axios";
import { statusConfig } from "../data/washStatus";

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

export const getAllWashes = async () => {
  const response = await axios.get(`${API_URL}/all_washes`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateWashStatus = async (washId, status) => {
  const response = await axios.put(
    `${API_URL}/update_status/${washId}`,
    { status },
    { withCredentials: true },
  );
  return await  response.data;
};
