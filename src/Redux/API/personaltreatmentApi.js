import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const personaltreatmentApi = {

    CreateSteps: (stepsData)=> {
    return axiosInstance.post(`assessments/create-steps/`, stepsData);
  }, 

    getallsteps: (params = {}) => {
    return axiosInstance.get(`assessments/steps/`, {
        params: params
    });
    },

    addTreatment: (treatmentData) => {
        return axiosInstance.post(`assessments/treatment/`, treatmentData);
    },

    AddFeedback: (feedbackData) => {
      return axiosInstance.post(`assessments/feedback/`, feedbackData);
    },

    UpdateCurrentStep: (data) => {
      return axiosInstance.patch(`assessments/treatment/update-step/`, data);
    },

    GetTreatment: (user_id, treatmentid) => {
      return axiosInstance.get(`assessments/treatment/${user_id}/${treatmentid}/`)
    },
    
    GetTreatmentByUser: (userId) => {
      return axiosInstance.get(`assessments/treatments/`, {
        params: {
          user: userId
        }
      });
    },

    GetStepByStepsId: (stepId) => {
      return axiosInstance.get(`assessments/steps/${stepId}/`);
    },


}

export default personaltreatmentApi;
