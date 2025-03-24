import axiosInstance from "./axiosInstance.js";
import store from "../store.js";

const codeAPIs = {

  getCodes: () => {
    return axiosInstance.get(`/books/book-details`);
  },

  getCode: (id=1) => {
    return axiosInstance.get(`/books/book-details/${id}`); 
  },

  addCode: (newCode) => {
    return axiosInstance.post(`/books/book-details`, newCode);
  },

  editCode: (codeData)=>{
    if (!codeData.id) {
      return Promise.reject("ID is undefined");
  }

   //console.log("Editing code with ID:", codeData.id); // Log the ID
    //console.log("Data being sent:", codeData);
    return axiosInstance.put(`/books/book-details/`, codeData);
  },

  deleteCode:(id) =>{
    return axiosInstance.delete(`/books/book-details/delete/${id}`);
  },
  
  getBooks: () => {
    return axiosInstance.get(`/books`); // Adjust the endpoint as necessary
  },
 
  reviewCode: (id, status) =>{
    return axiosInstance.patch(`/books/book-details/${id}`, { reviewStatus: status });
  },

  //Fetch code history
  getCodeHistory: (code, description) => {
    if (!code || !description) {
      //console.error("❌ Error: Missing codeId or descriptionId");
      return Promise.reject("Missing codeId or descriptionId");
    }
  
    return axiosInstance.get(`books/book-details`);
  },
  
};

export default codeAPIs;
