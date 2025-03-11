import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./Slices/bookSlice";
import codeReducer from "./Slices/codeSlice";
import authReducer from "./Slices/authSlice";
import profileReducer from "./Slices/profileSlice";

const store = configureStore({
  reducer: {
    books: bookReducer, 
    codes: codeReducer,
    auth : authReducer,
    profile: profileReducer,
  },
});

export default store;
