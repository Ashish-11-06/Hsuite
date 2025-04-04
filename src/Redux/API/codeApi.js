import axiosInstance from "./axiosInstance.js";
import store from "../store.js";

const codeAPIs = {

  // getCodes: (user_id) => {
  //   return axiosInstance.get(`/books/book-details/`);
  // },

  // In codeAPIs.js
getCodes: (user_id) => {
  if (!user_id) {
    return Promise.reject("User ID is required");
  }
  return axiosInstance.get(`/books/book-details/${user_id}/`);
},

  getCode: (id=1) => {
    return axiosInstance.get(`/books/book-details/${id}`); 
  },

  addCode: (newCode) => {
    return axiosInstance.post(`/books/book-details/`, newCode);
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
    return axiosInstance.get(`/books/`); // Adjust the endpoint as necessary
  },

  //Fetch code history
  getCodeHistory: (code, description) => {
    if (!code || !description) {
      //console.error("❌ Error: Missing codeId or descriptionId");
      return Promise.reject("Missing codeId or descriptionId");
    }
  
    return axiosInstance.get(`books/book-details`);
  },

  addReaction: ({ user_id, description_id, action }) => {
    return axiosInstance.post(`books/code-reaction/${user_id}/`, {
      description_id,
      action
    })
    .then(response => {
      console.log('RAW RESPONSE:', response); // Check this in browser console
      return response.data; // This is what you're missing
    });
  },
  
};

export default codeAPIs;
