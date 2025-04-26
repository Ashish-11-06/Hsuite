import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mcqAPIs from '../API/mcqApi'; // We'll create this next

export const addMCQQuestion = createAsyncThunk(
    'mcq/addMCQQuestion',
    async (questionData, { rejectWithValue }) => {
      try {
        const response = await mcqAPIs.addQuestion(questionData);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const addMcqQuiz = createAsyncThunk("mcq/addmcqQuiz", async (quizData, { rejectWithValue }) => {
    try {
      const response = await mcqAPIs.addMcqQuiz(quizData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add quiz");
    }
  });

  export const getAllQuestions = createAsyncThunk(
    "mcq/getallquestions",
    async (_, { rejectWithValue }) => {
      try {
        const response = await mcqAPIs.getAllQuestions();
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get questions");
      }
    }
  );

  export const fetchAllQuestionsByQuiz = createAsyncThunk(
    "mcq/fetchAllQuestionsByQuiz",
    async (quizId, { rejectWithValue }) => {
      try {
        const response = await mcqAPIs.fetchAllQuestionsByQuiz(quizId);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch quiz questions");
      }
    }
  );

  // In your mcqSlice.js, add this new async thunk
export const getAllQuizzes = createAsyncThunk(
    "mcq/getAllQuizzes",
    async (_, { rejectWithValue }) => {
      try {
        const response = await mcqAPIs.getAllQuiz();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get quizzes");
      }
    }
  );
  
  export const updateQuestion = createAsyncThunk(
    'mcq/updateQuestion',
    async ({ questionId, questionData }, { rejectWithValue }) => {
      try {
        const response = await mcqAPIs.updateQuestion(questionId, questionData);
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update question");
      }
    }
  );
  
  export const deleteQuestion = createAsyncThunk(
    'mcq/deleteQuestion',
    async (questionId, { rejectWithValue }) => {
      try {
        const response = await mcqAPIs.deleteQuestion(questionId);
        return { questionId, ...response };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete question");
      }
    }
  );

  export const getQuestionsByType = createAsyncThunk(
    "mcq/getQuestionsByType",
    async (type, { rejectWithValue }) => {
      try {
        const data = await mcqAPIs.fetchQuestionsByType(type);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch questions");
      }
    }
  );

  export const getQuizByType = createAsyncThunk(
    "mcq/getQuizByType",
    async (type, { rejectWithValue }) => {
      try {
        const data = await mcqAPIs.fetchQuizByType(type);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch questions");
      }
    }
  );

export const mcqSlice = createSlice({
  name: 'mcq',
  initialState: {
    questions: [],
    loading: false,
    error: null,
    success: false,
    quizzes:[],
  },
  reducers: {
    resetQuizState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetQuizStatus: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
  },
extraReducers: (builder) => {
    builder
      .addCase(addMCQQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addMCQQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.questions.push(action.payload);
      })
      .addCase(addMCQQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || 'Failed to add question';
      })

      .addCase(addMcqQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMcqQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.quizzes.push(action.payload);
      })
      .addCase(addMcqQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //for get all questions 
      .addCase(getAllQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.questions = action.payload.data || action.payload || [];
      })  
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // In the extraReducers section of mcqSlice.js
        .addCase(getAllQuizzes.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllQuizzes.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.quizzes = action.payload.data || action.payload || [];
        })
        .addCase(getAllQuizzes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(updateQuestion.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            const index = state.questions.findIndex(q => q.id === action.payload.id);
            if (index !== -1) {
              state.questions[index] = action.payload;
            }
          })
          .addCase(updateQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          
          .addCase(deleteQuestion.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.questions = state.questions.filter(q => q.id !== action.payload.questionId);
          })
          .addCase(deleteQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })

          .addCase(getQuestionsByType.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getQuestionsByType.fulfilled, (state, action) => {
            state.loading = false;
            state.questions = action.payload;
          })
          .addCase(getQuestionsByType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })

          .addCase(getQuizByType.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getQuizByType.fulfilled, (state, action) => {
            state.loading = false;
            state.quizzes = action.payload;
          })
          .addCase(getQuizByType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })

          .addCase(fetchAllQuestionsByQuiz.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAllQuestionsByQuiz.fulfilled, (state, action) => {
            state.loading = false;
            state.quizQuestions = action.payload; // Store quiz-specific questions separately
          })
          .addCase(fetchAllQuestionsByQuiz.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
  }
});

export const { resetQuizState, resetQuizStatus } = mcqSlice.actions;
export default mcqSlice.reducer;