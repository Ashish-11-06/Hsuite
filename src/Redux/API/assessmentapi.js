import axios from "axios";

const API_URL = "http://localhost:5000";

export const getAssessments = () => axios.get(`${API_URL}/assessments`);
export const submitResponse = (data) => axios.post(`${API_URL}/responses`, data);
export const saveResult = (data) => axios.post(`${API_URL}/results`, data);
export const getUserResults = (userId) => axios.get(`${API_URL}/results?userId=${userId}`);
