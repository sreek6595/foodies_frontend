// D:/sreek/fc/Foodies-Corner/frontend/src/services/addtocartServices.js
import axios from "axios";
import { getToken } from "../utils/storageHandler";
import { BASE_URL } from "../utils/urls";

// Add to Cart API
export const addToCartAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  try {
    const response = await axios.post(`${BASE_URL}/cart/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("addToCartAPI Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error.response?.data || new Error("Failed to add to cart");
  }
};

// Get Cart API
export const getCartAPI = async () => {
  const token = getToken(); // Retrieve the token inside the function
  try {
    const response = await axios.get(`${BASE_URL}/cart/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("getCartAPI Error:", error.response?.data);
    throw error.response?.data || new Error("Failed to fetch cart");
  }
};

// Remove from Cart API
export const removeFromCartAPI = async (itemId) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${BASE_URL}/cart/del/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("removeFromCartAPI Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error.response?.data || error;
  }
};


// Clear Cart API
export const clearCartAPI = async () => {
  const token = getToken(); // Retrieve the token inside the function
  try {
    const response = await axios.delete(`${BASE_URL}/cart/clr`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("clearCartAPI Error:", error.response?.data);
    throw error.response?.data || new Error("Failed to clear cart");
  }
};