import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://final-ceh9.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));
export default api;
