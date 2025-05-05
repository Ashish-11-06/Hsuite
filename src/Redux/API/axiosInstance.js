import axios from 'axios';

const axiosInstance = axios.create({
  //  baseURL: 'http://192.168.1.39:8000/api',
  // baseURL: 'http://192.168.1.62:8001/api', 
    //  baseURL: 'https://medical-backend-rxuk.onrender.com/api', // JSON Server URL
    baseURL: 'https://hsuite.prushal.com/backend/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach token to headers
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // 💡 get token from localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default axiosInstance;