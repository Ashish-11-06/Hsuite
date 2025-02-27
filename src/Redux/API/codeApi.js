import { deleteBook } from "../Slices/bookSlice.js";
import axiosInstance from "./axiosInstance.js";

const codeAPIs = {

  getCodes: () => {
    return axiosInstance.get(`/book-details/1`);
  },

  getCode: (id=1) => {
    return axiosInstance.get(`/book-details/${id}`); 
  },

  addCode: (newBook) => {
    return axiosInstance.post(`/book-details`, newBook);
  },
  deleteCode:(id) =>{
    return axiosInstance.delete(`/book-details`, deleteBook);
  },
  
 
};

export default codeAPIs;
