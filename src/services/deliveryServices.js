import axios from "axios";
import { getToken } from "../utils/storageHandler"; // Adjust path
import { BASE_URL } from "../utils/urls"; // Should be "http://localhost:5000"
const token = getToken();

export const getDeliveryByOrderAPI = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${BASE_URL}/delivery/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.status, error.response?.data);
    throw error;
  }
};

// Other delivery services (unchanged)
export const updateDeliveryStatusAPI = async (statusData) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/delivery/update`, statusData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendOTPAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/delivery/otp`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};




// Register a new delivery boy
export const registerDeliveryBoyAPI = async (data) => {
  const token = getToken(); // Get the auth token (optional, depending on your backend requirements)

  const response = await axios.post(
    `${BASE_URL}/users/driver`, // Adjust endpoint to match your backend route
    data, // Data from the form
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // Include token if present
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // Return the token or response data from the backend
};

export const verifyDriverAPI = async ({ id, status, reason }) => {
  const token = getToken();
  const response = await axios.put(
    `${BASE_URL}/admin/driver`,
    { id, status, reason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getDriversAPI = async () => {
  const token = getToken();
  const response = await axios.get(
    `${BASE_URL}/admin/drivers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const trackDriversAPI = async (data) => {
  const token = getToken();
  const response = await axios.get(
    `${BASE_URL}/delivery/track/${data}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getDriverLocAPI = async (data) => {
  console.log(data);
  
  const response = await axios.post(
    `${BASE_URL}/delivery/location`,data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


