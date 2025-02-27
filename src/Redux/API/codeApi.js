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

  editCode: (codeData)=>{
  //   console.log("Editing code with ID:", id); // Log the ID
    console.log("Data being sent:", codeData);
    return axiosInstance.put(`/book-details`, codeData);
  },

  deleteCode:(id) =>{
    return axiosInstance.delete(`book-details/delete/${id}`);
  },
  
 
};

export default codeAPIs;
