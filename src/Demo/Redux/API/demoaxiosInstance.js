import axios from 'axios';

// export const BASE_URL = 'https://ext-protocol-third-mali.trycloudflare.com/';
// export const BASE_URL = 'http://192.168.1.57:8000';
// export const BASE_URL = 'http://192.168.1.36:8080';
export const BASE_URL= 'https://hsuite.prushal.com/main-backend';

const demoaxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

demoaxiosInstance.interceptors.request.use(
  (config) => {
    let rawHospitalId = localStorage.getItem('Hospital-Id');

    // ✅ Remove extra quotes if present
    if (rawHospitalId) {
      rawHospitalId = rawHospitalId.replace(/^"(.*)"$/, '$1'); // strips " from "HID002"
      config.headers['Hospital-Id'] = rawHospitalId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default demoaxiosInstance;
