import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';


export const loginAPI=async(data)=>{
  const token = getToken()

const response = await axios.post(`${BASE_URL}/users/login`,data)
return response.data
}

export const registerAPI=async(data)=>{
    const response = await axios.post(`${BASE_URL}/users/register`,data)
    return response.data
}



export const editProfileAPI = async (data) => {
  const token = getToken()


  const response = await axios.put(`${BASE_URL}/users/edit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
  
  export const logoutAPI = async () => {
    const token = getToken()

    const response = await axios.delete(`${BASE_URL}/users/logout`);
    return response.data;
  };
  
  export const getUserProfileAPI = async () => {
    const token = getToken()

    const response = await axios.get(`${BASE_URL}/users/view`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  export const getUsersAPI = async () => {

    const token = getToken()
    const response = await axios.get(`${BASE_URL}/users/showall`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const verifyEmailAPI = async () => {
    const token = getToken()

    const response = await axios.get(`${BASE_URL}/users/verify`);
    return response.data;
  };
  
  export const forgotPasswordAPI = async (data) => {
    const token = getToken()

    const response = await axios.post(`${BASE_URL}/users/forgot`, data);
    return response.data;
  };
  
  export const resetPasswordAPI = async (data) => {
    const token = getToken()

    const response = await axios.put(`${BASE_URL}/users/reset`, data);
    return response.data;
  };
  
  export const changePasswordAPI = async (data) => {
    const token = getToken()

    const response = await axios.put(`${BASE_URL}/users/password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  export const forgotAPI=async(data)=>{
    const token = getToken()

    const response=await axios.post(`${BASE_URL}/users/forgot`,data, {
    withCredentials: true, 
    })
    return response.data
    }

    export const resetAPI=async(data)=>{
      const token = getToken()

    const response=await axios.put(`${BASE_URL}/users/reset`,data, {
    withCredentials: true, 
    })
    return response.data
    }
    


    export const delUserAPI = async (data) => {
      const token = getToken(); // Retrieve the token inside the function
      const response = await axios.delete(`${BASE_URL}/users/delete/${data}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    };