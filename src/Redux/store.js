import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./Slices/bookSlice";

const store = configureStore({
  reducer: {
    books: bookReducer, 
  },
});

export default store;
