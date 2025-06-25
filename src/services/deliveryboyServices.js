import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';



// Login API for Delivery Boy
export const deliveryBoyLoginAPI = async (data) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/delivery-boys/login`, data);
  return response.data;
};

// Register API for Delivery Boy
export const deliveryBoyRegisterAPI = async (data) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/delivery-boys/register`, data);
  return response.data;
};

// Get Delivery Boy Profile API
export const getDeliveryBoyProfileAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/users/view`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Edit Delivery Boy Profile API
export const editDeliveryBoyProfileAPI = async (data) => {
  const token = getToken();
  console.log(data);
  const response = await axios.put(`${BASE_URL}/users/edit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Verify Email API for Delivery Boy
export const verifyDeliveryBoyEmailAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/delivery-boys/verify`);
  return response.data;
};

// Forgot Password API for Delivery Boy
export const forgotPasswordDeliveryBoyAPI = async (data) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/delivery-boys/forgot`, data);
  return response.data;
};

// Reset Password API for Delivery Boy
export const resetPasswordDeliveryBoyAPI = async (data) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/delivery-boys/reset`, data);
  return response.data;
};

// Change Password API for Delivery Boy
export const changePasswordDeliveryBoyAPI = async (data) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/delivery-boys/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const getDeliveryBoyfeedbackAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/feedback/view`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};