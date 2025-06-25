import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';




export const getDashboardData = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/admin/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getUnverifiedRestaurants = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/admin/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const verifyRestaurant = async (data) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/admin/verifyrestaurant`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};





export const getDeliveryBoyFeedback = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/admin/complaints`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Return the complaints array
};

export const deleteDb = async (data) => {
  const token = getToken();
  const response = await axios.delete(`${BASE_URL}/admin/delete/${data}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

