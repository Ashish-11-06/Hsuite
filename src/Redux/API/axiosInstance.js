import axios from 'axios';

// export const BASE_URL = 'https://hsuite.prushal.com/backend';
// export const BASE_URL = 'http://192.168.1.55:8000';
// export const BASE_URL = 'http://192.168.83.39:8000';
export const BASE_URL = 'https://hsuite.prushal.com/main-backend';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  // baseURL: 'http://192.168.1.40:8000/api', 
  //  baseURL: 'https://medical-backend-rxuk.onrender.com/api', // JSON Server URL
  // baseURL: 'https://hsuite.prushal.com/backend/api/',
  // baseURL: 'https://hsuite.prushal.com/test-backend/api/',
  // baseURL: 'https://feb3-103-211-60-173.ngrok-free.app/api/',
  //  baseURL: 'https://cannon-retained-it-forces.trycloudflare.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;