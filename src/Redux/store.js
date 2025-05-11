import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./Slices/bookSlice";
import codeReducer from "./Slices/codeSlice";
import authReducer from "./Slices/authSlice";
import profileReducer from "./Slices/profileSlice";
import assessmentReducer from "./Slices/assessmentSlice";
import userReducer from "./Slices/userSlice";
import quizReducer from "./Slices/quizSlice";
import mcqReducer from "./Slices/mcqSlice";
import egoReducer from "./Slices/egoSlice";

const store = configureStore({
  reducer: {
    books: bookReducer, 
    codes: codeReducer,
    auth : authReducer,
    profile: profileReducer,
    assessments: assessmentReducer,
    users: userReducer,
    quiz: quizReducer,
    mcq: mcqReducer,
    ego: egoReducer,
  },
});

export default store;
