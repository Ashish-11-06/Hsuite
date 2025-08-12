import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Redux/Slices/PatientSlice";
import  patienthistoryReducer from "../Redux/Slices/PatientHistorySlice";
import authReducer from "../Redux/Slices/AuthSlice";
import usersReducer from "../Redux/Slices/UsersSlice";
import opdReducer from "../Redux/Slices/OpdSlice";
import billingReducer from "../Redux/Slices/BillingSlice";
import ipdReducer from "../Redux/Slices/IpdSlice"; // Assuming you have an IpdSlice
import stockReducer from "../Redux/Slices/StockSlice";
import patientRegisterReducer from "../Redux/Slices/PatientRegisterSlice";
import reportReducer from "../Redux/Slices/ReportSlice";

const storedemo = configureStore({
  reducer: {
    patient: patientReducer,
    patienthistory: patienthistoryReducer,
    auth:authReducer,
    users:usersReducer,
    opd: opdReducer,
    billing: billingReducer,
    ipd: ipdReducer, 
    stock: stockReducer,
    patientRegister: patientRegisterReducer,
    report: reportReducer,
    // other reducers
  },
});

export default storedemo;
