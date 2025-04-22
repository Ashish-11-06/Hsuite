// services/quizAPI.js
import { submitQuizResults, updateTestQuestion, getQuizReportHistory  } from "../Slices/quizSlice.js";
import axiosInstance from "./axiosInstance.js";

const quizAPI = {
  // 🔹 Create a new quiz category
  createQuizCategory: (data) => axiosInstance.post(`assessments/quiz-name/`, data),

  // Optionally: Get all quiz categories (if such an endpoint exists)
  getQuizCategories: () => axiosInstance.get(`assessments/quiz-name-get/`),

  createTestQuestion: (questionData) => 
    axiosInstance.post(`assessments/new-quiz/`, questionData),

  getTestQuestions: (quizId) => axiosInstance.get(`assessments/new-quiz/${quizId}/`),

    updateTestQuestion: (quizId, questionId, updatedData) => {
      // console.log(updatedData);
      return axiosInstance.put(`assessments/quiz/${quizId}/question/${questionId}/`, updatedData);
    },

  // 🔹 Delete a specific test question
  deleteTestQuestion: (quizId, questionId) =>
    axiosInstance.delete(`assessments/quiz/question/${questionId}/delete/`),

  submitQuizResults: (quiz_id, answers, user_id) => {
    return axiosInstance.post(`assessments/quiz-results/`, { 
      quiz_id: typeof quiz_id === 'object' ? quiz_id.id : quiz_id,
      answers: answers.map(answer => ({
        question_id: answer.question_id,
        selected_category: answer.selected_category || ""
      })),
      user_id  // Include user_id in the request body
    });
  },

   // 🔹 Get quiz result history
   getQuizReportHistory: (user_id) => {
    if (!user_id) {
      throw new Error("User ID is required");
    }
    return axiosInstance.get(`assessments/quiz/results/user/${user_id}/`);
  }
};

export default quizAPI;
