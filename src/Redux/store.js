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
import personaltreatmentReducer from "./Slices/personaltreatmentSlice";
import AIintegrationReducer from "./Slices/AIintegrationSlice";
import CounsellorReducer from "./Slices/CounsellorSlice";
import mhAuthReducer from "./Slices/MHAuthSlice";

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
    personaltreatment: personaltreatmentReducer,
    aiintegration: AIintegrationReducer,
    counsellor: CounsellorReducer,
    mhAuth: mhAuthReducer, 
  },
});

export default store;
