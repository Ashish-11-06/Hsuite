import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://192.168.1.39:8000/api', 
    //  baseURL: 'https://medical-backend-rxuk.onrender.com/api', // JSON Server URL
    // baseURL: 'https://medical-backend-rxuk.onrender.com/api', 
    // baseURL: 'http://192.168.1.45:8000/api', //priyanshu's server/gayatri
    // baseURL: 'http://localhost:5000', // JSON Server URL

  //  baseURL: 'http://192.168.1.39:8000/api', 
     baseURL: 'https://medical-backend-rxuk.onrender.com/api', // JSON Server URL
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