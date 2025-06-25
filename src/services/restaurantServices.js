import axios from "axios";
import { getToken } from "../utils/storageHandler";
import { BASE_URL } from "../utils/urls";

// Add Restaurant API
export const addRestaurantAPI = async (data) => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/restaurants/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Edit Restaurant API
export const editRestaurantAPI = async (restaurantId) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/restaurants/edit/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


export const viewRestaurantsAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/restaurants/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
// View All Restaurants API
export const viewAllRestaurantsAPI = async ({ latitude, longitude }) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/restaurants/display`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      latitude,
      longitude,
    },
  });
  return response.data;
};

// Get Restaurant by ID API
export const getRestaurantByIdAPI = async (restaurantId) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/restaurants/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Search Restaurants API
export const searchRestaurantsAPI = async (query) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/restaurants/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { query }, // Send query as a parameter
  });
  return response.data;
};

// Delete Restaurant API
export const deleteRestaurantAPI = async (restaurantId) => {
  const token = getToken();
  const response = await axios.delete(`${BASE_URL}/restaurants/delete/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Verify Restaurant API
export const verifyRestaurantAPI = async (restaurantId, status) => {
  const token = getToken();
  const response = await axios.patch(
    `${BASE_URL}/restaurants/verify/${restaurantId}`,
    { verified: status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getMenusOfRestaurantAPI = async (restaurantId) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.get(`${BASE_URL}/menus/restaurant/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const addReviewAPI = async (data) => {
  const token = getToken();
  console.log(data);
  
  const response = await axios.post(`${BASE_URL}/reviews/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getReviewsAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.get(`${BASE_URL}/reviews/get/${data}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getallReviewsAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.get(`${BASE_URL}/reviews/viewall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getReviewsResAPI = async () => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.get(`${BASE_URL}/reviews/restaurant`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const delRestaurantAPI = async (data) => {
  const token = getToken(); // Retrieve the token inside the function
  const response = await axios.delete(`${BASE_URL}/restaurants/delete/${data}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};