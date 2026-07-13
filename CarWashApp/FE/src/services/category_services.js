import axios from "axios";

const API_URL = "http://localhost:5173/category";

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/get_categories`, {
    withCredentials: true,
  });

  return response.data;
};
