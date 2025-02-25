import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./bookSlice";
import codeReducer from "./codeSlice"; 

const store = configureStore({
  reducer: {
    books: bookReducer, 
    codes: codeReducer,
  },
});

export default store;
