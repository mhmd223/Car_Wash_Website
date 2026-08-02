import axios from "axios";
const API_URL = "http://localhost:5173/account/";

export const register = async (
  username,
  email,
  phone,
  password,
  confirmPassword,
) => {
  const response = await axios.post(`${API_URL}register`, {
    username,
    email: email,
    phone,
    password,
    confirmPassword,
  });

  return response.data.registered;
};

export const login = async (emailOrPhone, password) => {
  const response = await axios.post(
    `${API_URL}login`,
    {
      email: emailOrPhone,
      password: password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const getAccountInfo = async (userId) => {
  const response = await axios.get(`${API_URL}${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const editAccount = async (id, username, email, phone, password) => {
  try {
    const response = await axios.post(
      `${API_URL}edit`,
      { id, username, email, phone, password },
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    console.error("Error editing account:", error);
    throw error;
  }
};
