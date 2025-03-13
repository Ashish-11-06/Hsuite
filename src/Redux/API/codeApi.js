import axiosInstance from "./axiosInstance.js";
import store from "../store.js";

const codeAPIs = {

  getCodes: () => {
    return axiosInstance.get(`/book-details`);
  },

  getCode: (id=1) => {
    return axiosInstance.get(`/book-details/${id}`); 
  },

  addCode: (newCode) => {
    return axiosInstance.post(`/book-details`, newCode);
  },

  editCode: (codeData)=>{
    if (!codeData.id) {
      console.error("❌ Error: ID is missing in codeData");
      return Promise.reject("ID is undefined");
  }

   console.log("Editing code with ID:", codeData.id); // Log the ID
    console.log("Data being sent:", codeData);
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
  // getCodeHistory: () => {
  //   //console.log("✅ Calling API with ID:", id); // Add log here
  //   return axiosInstance.put(`/book-details`)
  // },
};

export default codeAPIs;
