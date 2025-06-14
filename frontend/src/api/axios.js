import axios from 'axios';

const instance = axios.create({ 
  baseURL: process.env.REACT_APP_API_BASE_URL, // <- YOUR RENDER BACKEND URL
});

// Attach JWT if present in localStorage
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response or error if needed
// instance.interceptors.response.use(..., ...)

export default instance;
