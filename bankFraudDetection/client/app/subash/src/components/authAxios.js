// src/authAxios.js
import axios from 'axios';

// Create an Axios instance to handle requests
const authAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Your Django API URL
});

// Interceptor to automatically attach the token to request headers
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Retrieve JWT from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default authAxios;
