import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Redux/Slices/PatientSlice";
import  patienthistoryReducer from "../Redux/Slices/PatientHistorySlice";
import authReducer from "../Redux/Slices/AuthSlice";
import usersReducer from "../Redux/Slices/UsersSlice";
import opdReducer from "../Redux/Slices/OpdSlice";

const storedemo = configureStore({
  reducer: {
    patient: patientReducer,
    patienthistory: patienthistoryReducer,
    auth:authReducer,
    users:usersReducer,
    opd: opdReducer,
    // other reducers
  },
});

export default storedemo;
