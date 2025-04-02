import axios from 'axios';

const axiosInstance = axios.create({
//    baseURL: 'http://192.168.1.39:8000/api', 
     baseURL: 'https://medical-backend-rxuk.onrender.com/api', // JSON Server URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
