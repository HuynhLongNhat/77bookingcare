import axios from "axios";

export const registerUser =(userData) =>{
     return axios.post("http://localhost:8001/api/users/register",userData);
}
export const loginUser = (userData) => {
  return axios.post("http://localhost:8001/api/users/login", userData, {
    withCredentials: true, 
  });
};

export const getUserProfile = () => {
  return axios.get("http://localhost:8001/api/users/profile", {
    withCredentials: true,
  });
};

export const updateUserProfile = (userData) => {
  return axios.put("http://localhost:8001/api/users/profile", userData ,{
    withCredentials: true,
  });
};

export const changePassword = (userData) => {
  return axios.post(
    "http://localhost:8001/api/users/change-password",
    userData,
    {
      withCredentials: true,
    }
  );
};

export const forgotPassword = (userData) => {
  return axios.post(
    "http://localhost:8001/api/users/forgot-password",
    userData,
    {
      withCredentials: true,
    }
  );
};

export const resetPassword = (userData) => {
  return axios.post(
    "http://localhost:8001/api/users/reset-password",
    userData,
    {
      withCredentials: true,
    }
  );
};

export const getAllUsers = () => {
  return axios.get("http://localhost:8001/api/users", {
    withCredentials: true,
  });
};

export const getUserById = (userId) => {
  return axios.get(`http://localhost:8001/api/users/${userId}` ,{
    withCredentials: true,
  });
};

export const updateRoleUser = ( userId ,newRole) => {
 return axios.put(`http://localhost:8001/api/users/${userId}`, newRole, {
   withCredentials: true,
 });
};

export const deleteUser = (userId) => {
  return axios.delete(`http://localhost:8001/api/users/${userId}`, {
    withCredentials: true,
  });
};