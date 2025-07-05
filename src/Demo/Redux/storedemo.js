import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Redux/Slices/PatientSlice";
import  patienthistoryReducer from "../Redux/Slices/PatientHistorySlice";
import authReducer from "../Redux/Slices/AuthSlice";
import usersReducer from "../Redux/Slices/UsersSlice";
import opdReducer from "../Redux/Slices/OpdSlice";
import billingReducer from "../Redux/Slices/BillingSlice";

const storedemo = configureStore({
  reducer: {
    patient: patientReducer,
    patienthistory: patienthistoryReducer,
    auth:authReducer,
    users:usersReducer,
    opd: opdReducer,
    billing: billingReducer,
    // other reducers
  },
});

export default storedemo;
