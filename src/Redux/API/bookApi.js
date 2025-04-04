import axiosInstance from "./axiosInstance.js";

const booksAPIs = {
  getBooks: () => {
    return axiosInstance.get(`/books/`); 
  },

  addBook: (newBook) => {
    return axiosInstance.post(`/books/`, newBook);
  },
  
  editBook: (id, bookData) => {
    return axiosInstance.put(`/books/${id}/`, bookData);
  },

  deleteBook: (id) => {
    return axiosInstance.delete(`/books/${id}/`);
  },
};

export default booksAPIs;
