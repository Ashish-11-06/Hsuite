import axiosInstance from "./axiosInstance";

const assessmentApi = {
    getAssessments: () => {
        return axiosInstance.get(`/assessments/questions/get/`);
    },

    getStatementBasedAssessments: ()=>{
        return axiosInstance.get(`assessments/statements-options-get/`);
    },

    saveResult: async (data) => {
        console.log("Saving result:", data);
        try {
            const response = await axiosInstance.post(`/assessments/submit-test/`, data);
            console.log("Result saved successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error saving result:", error.response?.data || error.message);
            throw error;
        }
    },

    getUserResults: async (userId) => {
        console.log("Fetching results for user:", userId);
        try {
            const response = await axiosInstance.get(`/assessments/submit-test/${userId}`);
            console.log("Fetched user results:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user results:", error.response?.data || error.message);
            throw error;
        }
    },

    // Add this method for fetching history
    getAssessmentHistory: async (userId) => {
        console.log("Fetching assessment history for user:", userId);
        try {
          const response = await axiosInstance.get(`/assessments/test-history/${userId}/`);
          console.log("Fetched assessment history:", response.data);
          return response.data; // Ensure the response data is returned
        } catch (error) {
          console.error("Error fetching assessment history:", error.response?.data || error.message);
          throw error;
        }
      },

};
export default assessmentApi;