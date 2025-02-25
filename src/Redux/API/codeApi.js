import axiosInstance from "./axiosInstance.js";

const codeAPIs = {
  getCode: (id) => {
    return axiosInstance.get(`/book-details/${id}`); 
  },

  addCode: (newBook) => {
    return axiosInstance.post(`/book-details`, newBook);
  },
  
 
};

export default codeAPIs;
