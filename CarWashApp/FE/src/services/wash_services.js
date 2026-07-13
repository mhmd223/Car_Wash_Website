import axios from "axios";

const API_URL = "http://localhost:5173/wash";

export const bookWash = async (bookingData) => {
  const response = await axios.post(`${API_URL}/book_wash`, bookingData, {
    withCredentials: true,
  });

  return response.data;
};
