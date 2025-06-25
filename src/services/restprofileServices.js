import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';


// Login API for Restaurant Owner
export const restaurantOwnerLoginAPI = async (data) => {
  const token = getToken();

  const response = await axios.post(`${BASE_URL}/restaurant-owners/login`, data);
  return response.data;
};

// Register API for Restaurant Owner
export const restaurantOwnerRegisterAPI = async (data) => {
  const token = getToken();

  const response = await axios.post(`${BASE_URL}/restaurant-owners/register`, data);
  return response.data;
};

// Get Restaurant Owner Profile API
export const getRestaurantOwnerProfileAPI = async () => {
  const token = getToken();

  const response = await axios.get(`${BASE_URL}/restaurants/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Edit Restaurant Owner Profile API
export const editRestaurantOwnerProfileAPI = async (data) => {
  const token = getToken();

  for (let [key, value] of data.entries()) {
    if (key === "image" && value instanceof File) {
      console.log(`${key}: ${value.name} (Size: ${value.size} bytes, Type: ${value.type})`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  const response = await axios.put(`${BASE_URL}/restaurants/edit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Verify Email API for Restaurant Owner
export const verifyRestaurantOwnerEmailAPI = async () => {
  const token = getToken();

  
  const response = await axios.get(`${BASE_URL}/restaurant-owners/verify`);
  return response.data;
};

// Forgot Password API for Restaurant Owner
export const forgotPasswordRestaurantOwnerAPI = async (data) => {
  const token = getToken();

  const response = await axios.post(`${BASE_URL}/restaurant-owners/forgot`, data);
  return response.data;
};

// Reset Password API for Restaurant Owner
export const resetPasswordRestaurantOwnerAPI = async (data) => {
  const token = getToken();

  const response = await axios.put(`${BASE_URL}/restaurant-owners/reset`, data);
  return response.data;
};

// Change Password API for Restaurant Owner
export const changePasswordRestaurantOwnerAPI = async (data) => {
  const token = getToken();

  const response = await axios.put(`${BASE_URL}/users/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

 