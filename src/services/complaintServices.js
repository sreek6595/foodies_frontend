import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';

export const addComplaintAPI = async (data) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/complaint/add`,data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const viewComplaintAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/complaint/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


export const submitDeliveryFeedbackAPI = async (data) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.post(`${BASE_URL}/feedback/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to submit feedback");
  }
};

export const delDriverAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.delete(`${BASE_URL}/feedback/delete/${data}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};