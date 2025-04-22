// Redux/Slices/quizSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import quizAPI from "../API/quizAPI"; // Import the quizAPI for API calls

// Async thunk to create a new quiz category
export const postQuizName = createAsyncThunk(
  "quiz/postQuizName",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await quizAPI.createQuizCategory(quizData); // Call API to create quiz category
      return response.data; // Return the response data from the API
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Handle error and return the message
    }
  }
);

// Inside Redux/Slices/quizSlice.js
export const getQuizCategories = createAsyncThunk(
  "quiz/getQuizCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizAPI.getQuizCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTestQuestion = createAsyncThunk(
  'quiz/createTestQuestion',
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await quizAPI.createTestQuestion(questionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTestQuestions = createAsyncThunk(
  'quiz/getTestQuestions',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizAPI.getTestQuestions(quizId);
      return response.data;  // Assuming response contains the test questions data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔹 Update a question
export const updateTestQuestion = createAsyncThunk(
  "quiz/updateTestQuestion",
  async ({ quizId, questionId, updatedData }, { rejectWithValue }) => {
    try {
      console.log(updatedData);
      await quizAPI.updateTestQuestion(quizId, questionId, updatedData);
      return { questionId, updatedData };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// 🔹 Delete a question
export const deleteTestQuestion = createAsyncThunk(
  "quiz/deleteTestQuestion",
  async ({ quizId, questionId }, { dispatch, rejectWithValue }) => {
    try {
      await quizAPI.deleteTestQuestion(quizId, questionId);
      dispatch(getTestQuestions(quizId));
      return questionId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Quiz Results
export const submitQuizResults = createAsyncThunk(
  "quiz/submitQuizResults",
  async ({ quiz_id, answers, user_id }, { rejectWithValue }) => {
    try {
      // Ensure all required fields are present
      if (!user_id) {
        throw new Error("User ID is required");
      }
      
      const cleanQuizId = typeof quiz_id === 'object' ? quiz_id.id : quiz_id;
      
      const cleanAnswers = answers.map(answer => ({
        question_id: answer.question_id,
        selected_category: answer.selected_category.includes('option_')
          ? `category_${answer.selected_category.split('_')[1]}`
          : answer.selected_category
      }));

      const response = await quizAPI.submitQuizResults(
        cleanQuizId, 
        cleanAnswers,
        user_id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getQuizReportHistory = createAsyncThunk(
  "quizReport/fetchHistory",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get user ID from your Redux state (assuming it's stored in auth slice)
      const { auth } = getState();
      const user_id = auth.user?.id;
      
      if (!user_id) {
        return rejectWithValue("User not authenticated");
      }
      
      const response = await quizAPI.getQuizReportHistory(user_id); 
      return response.data;      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching quiz report");
    }
  }
);

// Slice for quiz management
const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    testQuestions: [],
    loading: false,
    error: null,
    success: false,
    message: "", // To store success/error message from the backend
    data: null, // To store quiz data
    quizList:[],
    quizCategories: [],
    quiz_history:[],
    questionLoading: false,
    questionError: null,
    questionSuccess: false,
    quizResults: null,
    resultsLoading: false,
    resultsError: null
  },
  reducers: {
    resetQuizState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
      state.data = null;
    },
    resetQuestionState: (state) => {
      state.questionLoading = false;
      state.questionError = null;
      state.questionSuccess = false;
    },
    resetResultsState: (state) => {
      state.quizResults = null;
      state.resultsLoading = false;
      state.resultsError = null;
    },
    clearQuizReport: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

    //postQuizName
      .addCase(postQuizName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = ""; // Clear message during loading
      })
      .addCase(postQuizName.fulfilled, (state, action) => {
        console.log("✅ postQuizName.fulfilled payload:", action.payload);
        state.loading = false;
        state.success = true;
        state.message = action.payload.message; // Set success message from backend
        state.data = action.payload.data; // Set returned quiz data
      })
      .addCase(postQuizName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload?.message || "Something went wrong"; // Set error message from backend
      })

      // getQuizCategories
      .addCase(getQuizCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuizCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.quizList = action.payload; // 👈 store the list
      })
      .addCase(getQuizCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTestQuestion.pending, (state) => {
        state.questionLoading = true;
        state.questionError = null;
        state.questionSuccess = false;
      })
      .addCase(createTestQuestion.fulfilled, (state, action) => {
        state.questionLoading = false;
        state.questionSuccess = true;
        // Optional: add the new question to your state if needed
        // state.questionsList = [...state.questionsList, action.payload];
      })
      .addCase(createTestQuestion.rejected, (state, action) => {
        state.questionLoading = false;
        state.questionError = action.payload;
      })

      .addCase(getTestQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTestQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.testQuestions = action.payload;  // Update state with fetched questions
      })
      .addCase(getTestQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTestQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTestQuestion.fulfilled, (state, action) => {
        console.log("✅ Updated Question Payload in Slice:", action.payload); // Log the action payload to verify it
        state.loading = false;
        const index = state.testQuestions.findIndex((q) => q.id === action.payload.questionId);
        if (index !== -1) {
          state.testQuestions[index] = {
            ...state.testQuestions[index],
            ...action.payload.updatedData,
          };
        }
      })
      
      .addCase(updateTestQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Error during update:", action.payload); // Log error message to debug
      })
      
      .addCase(deleteTestQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTestQuestion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTestQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Quiz Results
      .addCase(submitQuizResults.pending, (state) => {
        state.resultsLoading = true;
        state.resultsError = null;
      })
      .addCase(submitQuizResults.fulfilled, (state, action) => {
        state.resultsLoading = false;
        state.quizResults = action.payload;
      })
      .addCase(submitQuizResults.rejected, (state, action) => {
        console.error("❌ submitQuizResults error:", action.payload);
        state.resultsLoading = false;
        state.resultsError = action.payload;
      })

      .addCase(getQuizReportHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizReportHistory.fulfilled, (state, action) => {
        state.loading = false;
        // Store the entire response in data to maintain the structure
        state.data = action.payload || { quiz_history: [] };
      })
      .addCase(getQuizReportHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = { quiz_history: [] }; // Reset to empty array on error
      });
  },
});

export const { resetQuizState, resetQuestionState, resetResultsState, clearQuizReport } = quizSlice.actions;
export default quizSlice.reducer;
