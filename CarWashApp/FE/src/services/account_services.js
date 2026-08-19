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

export const getAccountInfo = async () => {
  const response = await axios.get(`${API_URL}me`, {
    withCredentials: true,
  });

  console.log("getAccountInfo response:", response.data);
  return [response.data, Boolean(response.data)];
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

export const logout = async (queryClient) => {
  try {
    const response = await axios.get(`${API_URL}logout`, {
      withCredentials: true,
    });
    if (queryClient) {
      queryClient.setQueryData(["userInfo"], null);
      queryClient.clear();
    }
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
