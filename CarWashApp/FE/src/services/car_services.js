import axios from "axios";

const API_URL = "http://localhost:5173/car";

export const getUserCars = async (user_id) => {
  const response = await axios.get(`${API_URL}/${user_id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const addUserCar = async (user_id, car_plate) => {
  const response = await axios.post(
    `${API_URL}/add_user_car`,
    { user_id, car_plate },
    { withCredentials: true },
  );

  return response.data;
};

export const removeUserCar = async (user_id, car_plate) => {
  const response = await axios.delete(`${API_URL}/remove_user_car`, {
    data: { user_id, car_plate },
    withCredentials: true,
  });

  return response.data;
};
