import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5173"}/car`;

export const getUserCars = async () => {
  const response = await axios.get(`${API_URL}/`, {
    withCredentials: true,
  });

  return response.data;
};

export const addUserCar = async (car_plate) => {
  const response = await axios.post(
    `${API_URL}/add_user_car`,
    { car_plate },
    { withCredentials: true },
  );

  return response.data;
};

export const removeUserCar = async (car_plate) => {
  const response = await axios.delete(`${API_URL}/remove_user_car`, {
    data: { car_plate },
    withCredentials: true,
  });

  return response.data;
};
