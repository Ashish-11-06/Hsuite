import axios from "axios";
import axiosInstance from "./axiosInstance.js";
import { current } from "@reduxjs/toolkit";

const CounsellorApi = {
   Getallcounsellor: ()=> {
    return axiosInstance.get(`counsellor/counsellors/`); 
   },

   GetCounsellorbyid: (counsellor_id)=>{
    return axiosInstance.get(`counsellor/counsellors/${counsellor_id}/`);
   },

   AddCounsellorRequest: (data) => {
    return axiosInstance.post(`counsellor/counsellor-request/`, data);
   },
   
   GetAllCounsellorRequest: () => {
      return axiosInstance.get(`counsellor/counselling-requests/`);
   },

   GetCounsellorRequestByUserId: (user_id) => {
      return axiosInstance.get(`counsellor/counselling-requests/user/${user_id}/`);
   },

   GetCounsellingRequestByCounsellorid: (counsellor_id) => {
      return axiosInstance.get(`counsellor/counselling-requests/counsellor/${counsellor_id}/`);
   },

   UpdateStatusForRequest: (request_id, body) => {
      return axiosInstance.patch(`counsellor/counselling-request/update-status/${request_id}/`, body);
   },

   CreatePrecautions: (data) => {
      return axiosInstance.post(`counsellor/precautions/`, data);
   },

   CreateTherapy: (data) => {
      return axiosInstance.post(`counsellor/therapies/`, data);
   },

   GetPrecautionsAll: () => {
      return axiosInstance.get(`counsellor/precaution/`);
   },
   
   GetTherapyStepsByUserId: (user_id) => {
      return axiosInstance.get(`counsellor/therapy/user/${user_id}/`);
   },

   CreateFeedback: (feedbackData) => {
      return axiosInstance.post(`counsellor/feedback/`,feedbackData);
   },

   GetFeedbackByCounsellorId: (counsellor_id) => {
      return axiosInstance.get(`counsellor/feedback-by-counsellor_id/${counsellor_id}/`);
   },

   GetTherapyAll: () => {
      return axiosInstance.get(`counsellor/therapy-steps/`);
   },

   UpdateCurrentStep: (therapy_id, stepIndex) => {
      return axiosInstance.patch(`counsellor/therapy-steps/${therapy_id}/update-current-step/`,
         {current_step: stepIndex + 1}
      );
   }
}

export default CounsellorApi;
