import axios from "axios";

const API_URL = "/api/category";

const getCategoryError = (error) =>
  new Error(
    error.response?.data?.status ||
      error.response?.data?.message ||
      "Something went wrong",
  );

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get_categories`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw getCategoryError(error);
  }
};

export const createCategory = async ({ id, name, price }) => {
  try {
    const response = await axios.post(
      `${API_URL}/add_category`,
      { id, name, price },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw getCategoryError(error);
  }
};

export const updateCategory = async ({ id, name, price }) => {
  try {
    const response = await axios.put(
      `${API_URL}/update_category`,
      { id, name, price },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw getCategoryError(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/remove_category`, {
      data: { id },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw getCategoryError(error);
  }
};
