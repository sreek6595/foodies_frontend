import axios from "axios";
import { getToken } from "../utils/storageHandler";
import { BASE_URL } from "../utils/urls";

// Add Menu Item API
export const addMenuItemAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.post(`${BASE_URL}/menus/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Edit Menu Item API
export const editMenuItemAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  console.log(data);
  
  const response = await axios.put(`${BASE_URL}/menus/edit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// View All Menu Items API
export const viewAllMenuItemsAPI = async () => {
  const token = getToken(); // Retrieve the token inside the function
  
  const response = await axios.get(`${BASE_URL}/menus/display`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
  
};

export const viewfoodrestAPI = async () => {
  const token = getToken(); // Retrieve the token inside the function
  
  const response = await axios.get(`${BASE_URL}/menus/viewall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
  
};

// Search Menu Items API
export const searchMenuItemsAPI = async (query) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.get(`${BASE_URL}/menu/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { query }, // Send query as a parameter
  });
  return response.data;
};

// Delete Menu Item API
export const deleteMenuItemAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.delete(`${BASE_URL}/menus/delete/${data}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get Menu Item by ID API
export const getMenuItemByIdAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.get(`${BASE_URL}/menu/edit`,data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
