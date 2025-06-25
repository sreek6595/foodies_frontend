// src/services/paymentService.js
import axios from "axios";
import { getToken } from "../utils/storageHandler";
import { BASE_URL } from "../utils/urls";

// Get all payment for the logged-in user
export const getPaymentsAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/payment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get a single payment by ID
export const getPaymentByIdAPI = async (id) => {
  const token = getToken();
  const response = await axios.post(
    `${BASE_URL}/payment/get`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Update payment status (admin)
export const updatePaymentStatusAPI = async (id, status) => {
  const token = getToken();
  const response = await axios.put(
    `${BASE_URL}/payment/update-status`,
    { id, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Process Stripe payment
export const processPaymentAPI = async (data) => {
  const token = getToken();
  console.log(data);
  
  const response = await axios.post(
    `${BASE_URL}/payment/checkout`,
     data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const getPaymentsownerAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/payment/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPaymentadminAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/payment/viewall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
