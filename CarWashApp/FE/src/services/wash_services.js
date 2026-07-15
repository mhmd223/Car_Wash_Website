import axios from "axios";

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
