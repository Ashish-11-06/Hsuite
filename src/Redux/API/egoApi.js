import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const egoAPIs = {
  AddEgogramTest: (data) => {
    return axiosInstance.post(`egogram/tests/`, data);
  },

  AddEgogramCategory: (data) => {
    return axiosInstance.post(`egogram/categories/`, data);
  },

  AddEgogramStatement: (data)=> {
    return axiosInstance.post(`egogram/statements/`, data);
  },

  AddStatementToTest: (data) => {
    return axiosInstance.post(`egogram/add-statement-to-test/`,data);
  },

  EgogramResult: (payload) => {
    return axiosInstance.post(`egogram/egogram-result/`, payload);
  },

  editStatement: (updatedStatement, statement_id) => {
    return axiosInstance.put(`egogram/egogram-statements/${statement_id}/`,updatedStatement);
  },

  deleteStatement: (statement_id) => {
    return axiosInstance.delete(`egogram/egogram-statements/${statement_id}/delete/`)
  },

  GetAllTest: () => {
    return axiosInstance.get(`egogram/all-tests/`);
  },

  GetAllStatements: () => {
    return axiosInstance.get(`egogram/all-statements/`);
  },

  GetAllCategory: () => {
    return axiosInstance.get(`egogram/all-categories/`);
  }, 

  GetStatementByTestId: (test_id) => {
    return axiosInstance.get(`egogram/statements/${test_id}/`);
  },

  GetStatementByTestIdToTest: (test_id) => {
    return axiosInstance.get(`egogram/egogram-test/${test_id}/statements/`);
  },

  GetEgoTestHistory: (userId) => {
    // console.log("Fetching results for user:", userId); // Debug log
    return axiosInstance.get(`egogram/egogram-history/user-id/${userId}/`);
    // console.log("API Response:", response.data); // Debug log
  },

  GetTestFor20Tests: () => {
    return axiosInstance.get(`egogram/egogram-test/`);
  }


};

export default egoAPIs;
