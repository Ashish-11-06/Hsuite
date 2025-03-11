import axiosInstance from "./axiosInstance.js";
import store from "../store.js";

const codeAPIs = {

  getCodes: () => {
    return axiosInstance.get(`/book-details`);
  },

  getCode: (id=1) => {
    return axiosInstance.get(`/book-details/${id}`); 
  },

  addCode: (newBook) => {
    return axiosInstance.post(`/book-details`, newBook);
  },

  editCode: (codeData)=>{
  //   console.log("Editing code with ID:", id); // Log the ID
    //console.log("Data being sent:", codeData);
    return axiosInstance.put(`/book-details`, codeData);
  },

  deleteCode:(id) =>{
    return axiosInstance.delete(`book-details/delete/${id}`);
  },
  
  getBooks: () => {
    return axiosInstance.get(`/books`); // Adjust the endpoint as necessary
  },
 
  reviewCode: (id, status) =>{
    return axiosInstance.patch(`/book-details/${id}`, { reviewStatus: status });
  },

  //Fetch code history
  getCodeHistory: (id) => {
    return axiosInstance.put(`/book-details`)
  },
};

export default codeAPIs;
