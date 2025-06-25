import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

// Function to get Authorization headers dynamically
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Notification Service
export const createNotificationAPI = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/create`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserNotificationsAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/notification/viewall`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markNotificationAsReadAPI = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/notification/update/${data}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteNotificationAPI = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/notification/delete`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
