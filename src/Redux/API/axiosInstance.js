import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.40:8000/api', 
    //baseURL: 'http://localhost:5000', // JSON Server URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
