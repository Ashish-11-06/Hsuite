import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const mcqAPIs = {
    addQuestion: async (questionData) => {
        try {
            const response = await axiosInstance.post(`assessments/mcq-question/`, questionData);
            return {
                data: response.data || {
                    ...questionData,
                    // id: Date.now().toString() // temporary ID if backend doesn't return one
                }};
        } catch (error) {
            throw {
                response: {
                    data: {
                        message: error.response?.data?.message || error.message
                    }}};
        }
    },

    //add quiz 
    addMcqQuiz: async (quizData) => {
        const response = await axiosInstance.post(`assessments/mcq-quiz/`, quizData);
        return response.data;
      },

      getAllQuestions: async () => {
        const response = await axiosInstance.get(`assessments/mcq-questions/`);
        return response.data; // don't forget to return response!
      },

    //get all quiz
    getAllQuiz: ()=>{
        return axiosInstance.get(`assessments/mcq-quizzes/`)
    },

    getQuestionInQuizID: (quizId)=>{
      return axiosInstance.get(`assessments/mcq-quiz/${quizId}/questions/`)
  },

    updateQuestion: async (questionId, questionData) => {
        try {
          const response = await axiosInstance.put(`assessments/mcq-questions/${questionId}/edit/`, questionData);
          return response.data;
        } catch (error) {
          throw {
            response: {
              data: {
                message: error.response?.data?.message || error.message
              }
            }
          };
        }
      },
    
      deleteQuestion: async (questionId) => {
        try {
          const response = await axiosInstance.delete(`assessments/mcq-questions/${questionId}/delete/`);
          return response.data;
        } catch (error) {
          throw {
            response: {
              data: {
                message: error.response?.data?.message || error.message
              }
            }
          };
        }
      },

      fetchQuestionsByType: async (type) => {
        const response = await axiosInstance.get(`/assessments/mcq-questions/type/${type}/`);
        return response.data;
      },

      fetchQuizByType: async (quiztype) => {
        const response = await axiosInstance.get(`assessments/mcq-quiz/type/${quiztype}/`);
        return response.data;
      },
      
    fetchAllQuestionsByQuiz: (quizId) => {
        return axiosInstance.get(`assessments/mcq-quiz/${quizId}/questions-all/`)
    },

    AddMcqQuizResult: (data) => {
      return axiosInstance.post(`assessments/submit-mcq-quiz/`, data);
    },

    getMcqQuizResult: async (userId) => {
      // console.log("Fetching results for user:", userId); // Debug log
      const response = await axiosInstance.get(`assessments/mcq-result-history/${userId}/`);
      // console.log("API Response:", response.data); // Debug log
      return response;
    },

    getTestGetMcqQuiz: ()=> {
      return axiosInstance.get(`assessments/test-mcq-quizzes/`)
    }
    
};

export default mcqAPIs;