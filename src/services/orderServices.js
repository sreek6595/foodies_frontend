import axios from "axios";
import { getToken } from "../utils/storageHandler";
import { BASE_URL } from "../utils/urls";

// Create Order API

export const createOrderAPI = async (orderData) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/orders/add`, orderData, {
    
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Get Orders by User API
export const getOrdersByUserAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/orders/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOrdersAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/orders/viewall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOrderAPI = async (data) => {
  const token = getToken();
  console.log(data);
  
  const response = await axios.get(`${BASE_URL}/orders/viewbyid/${data}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOrdersowner = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/orders/viewowner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getuserorder = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/orders/view`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Cancel Order API
export const cancelOrderAPI = async (data) => {
  const token = getToken();
  const response = await axios.post(
    `${BASE_URL}/orders/cancel`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;

 
  
};

