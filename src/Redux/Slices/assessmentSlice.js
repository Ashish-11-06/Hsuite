import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import assessmentApi from "../API/assessmentapi";

// Fetch assessments
export const fetchAssessments = createAsyncThunk(
  "assessments/test/fetchAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getAssessments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching assessments");
    }
  }
);

// Save result
export const saveResult = createAsyncThunk(
  "assessments/saveResult",
  async (data, { rejectWithValue }) => {
    console.log("saveResult action called with data:", data);
    try {
      const response = await assessmentApi.saveResult(data);
      console.log("saveResult response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("saveResult error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error saving result");
    }
  }
);

// Fetch assessment history
export const fetchAssessmentHistory = createAsyncThunk(
  "assessments/fetchHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getAssessmentHistory(userId);
      console.log("Fetched assessment history:", response);

      // Check if response contains test_history
      if (!response || !response.test_history) {
        throw new Error("Invalid response format: test_history is missing");
      }

      return response.test_history; // Make sure this is what Redux stores
    } catch (error) {
      console.error("Error fetching assessment history:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch questions
export const fetchMultipleChoiceQuestions = createAsyncThunk(
    "assessments/test/fetchMultipleChoiceQuestions",
    async () => {
      const response = await assessmentApi.getAssessments();
      console.log("Fetched questions:", response.data.questions);
      return response.data.questions;
    }
  );

  // Fetch Statement-Based Questions
export const fetchStatementBasedQuestions = createAsyncThunk(
  "assessments/fetchStatementBased",
  async () => {
    const response = await assessmentApi.getStatementBasedAssessments();
    console.log("Statement-based questions response:", response.data); // Debugging
    return response.data;
  }
);

  // Fetch user results
  export const fetchUserResults = createAsyncThunk(
    "assessments/fetchUserResults",
    async (userId, { rejectWithValue }) => {
      console.log("fetchUserResults action called for userId:", userId);
      try {
        const response = await assessmentApi.getUserResults(userId);
        console.log("fetchUserResults response received:", response.data);
        return response.data;
      } catch (error) {
        console.error("fetchUserResults error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Error fetching user results");
      }
    }
  );
  

  const assessmentSlice = createSlice({
    name: "assessments",
    initialState: {
      questions: [],
      multipleChoiceQuestions: [],
      statementBasedQuestions: {options: []},
      assessments: [],
      responses: [],
      results: [],
      history:[],
      loading: false,
      error: null,
    },
    reducers: {
      setResponses: (state, action) => {
        state.responses = action.payload;
      },
      addResult: (state, action) => {
        state.results.push(action.payload);
      },
      clearResponses: (state) => {
        state.responses = [];
      }
    },
    extraReducers: (builder) => {
      builder
        //fetch multiple choice questions cases
        .addCase(fetchMultipleChoiceQuestions.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchMultipleChoiceQuestions.fulfilled, (state, action) => {
          state.loading = false;
          state.multipleChoiceQuestions = action.payload;
        }) 
        .addCase(fetchMultipleChoiceQuestions.rejected, (state) => {
          state.loading = false;
        })

        //fetch statement based questions cases
        .addCase(fetchStatementBasedQuestions.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchStatementBasedQuestions.fulfilled, (state, action) => {
          state.loading = false;
          state.statementBasedQuestions = action.payload; // Ensure this is an object with an options array
          console.log("Statement-based questions updated:", state.statementBasedQuestions); // Debugging
        })
        .addCase(fetchStatementBasedQuestions.rejected, (state) => {
          state.loading = false;
        })

    // Save result
    .addCase(saveResult.pending, (state) => {
      console.log("saveResult pending...");
      state.loading = true;
    })
    .addCase(saveResult.fulfilled, (state, action) => {
      console.log("Redux - Result saved:", action.payload);
      state.loading = false;
      state.results.push(action.payload);
    })
    .addCase(saveResult.rejected, (state, action) => {
      console.error("saveResult rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    })

    // Fetch user results
    .addCase(fetchUserResults.pending, (state) => {
      console.log("fetchUserResults pending...");
      state.loading = true;
    })
    .addCase(fetchUserResults.fulfilled, (state, action) => {
      console.log("fetchUserResults fulfilled, results fetched:", action.payload);
      state.loading = false;
      state.results = action.payload;
    })
    .addCase(fetchUserResults.rejected, (state, action) => {
      console.log("Redux - User results fetched:", action.payload);
      state.loading = false;
      state.error = action.payload;
    })

     // Fetch assessment history
     .addCase(fetchAssessmentHistory.pending, (state) => {
      console.log("fetchAssessmentHistory pending...");
      state.loading = true;
    })
    .addCase(fetchAssessmentHistory.fulfilled, (state, action) => {
      console.log("fetchAssessmentHistory fulfilled, history fetched:", action.payload);
      state.loading = false;
      state.history = action.payload || []; // Store the test_history data in state
      console.log("Redux History Updated:", state.history); // Debugging
    })
    .addCase(fetchAssessmentHistory.rejected, (state, action) => {
      console.error("fetchAssessmentHistory rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    },
  });

  export const { setResponses } = assessmentSlice.actions;
  export const { clearResponses } = assessmentSlice.actions;

export default assessmentSlice.reducer;
