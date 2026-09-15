import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5173"}/admin/`;

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}Users/all`, {
      withCredentials: true,
    });

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching all users:", err);
    throw err;
  }
};

export const verifyUser = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}Users/verify`,
      { email },
      { withCredentials: true },
    );

    return response.data;
  } catch (err) {
    console.error("Error verifying user:", err);
    throw err;
  }
};

export const updateUserRole = async (email, newRole) => {
  try {
    const response = await axios.post(
      `${API_URL}Users/update-role`,
      { email, newRole },
      { withCredentials: true },
    );

    return response.data;
  } catch (err) {
    console.error("Error updating user role:", err);
    throw err;
  }
};

export const getSalesReports = async () => {
  try {
    const response = await axios.get(`${API_URL}wash/business_report`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching sales reports:", err);
    throw err;
  }
};

export const uploadSchedule = async (schedule) => {
  try {
    const response = await axios.post(
      `${API_URL}schedule/upload`,
      { schedule },
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading schedule:", err);
    throw err;
  }
};

export const clearSchedule = async () => {
  try {
    const response = await axios.delete(`${API_URL}schedule/clear`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error clearing schedule:", err);
    throw err;
  }
};
