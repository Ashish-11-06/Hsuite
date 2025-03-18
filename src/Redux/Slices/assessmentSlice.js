import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

// Fetch assessments
export const fetchAssessments = createAsyncThunk(
  "assessments/fetchAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/assessments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching assessments");
    }
  }
);

// Submit response
export const submitResponse = createAsyncThunk(
  "assessments/submitResponse",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/responses`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error submitting response");
    }
  }
);

// Save result
export const saveResult = createAsyncThunk(
  "assessments/saveResult",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/results`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error saving result");
    }
  }
);

// Fetch questions
export const fetchQuestions = createAsyncThunk(
    "assessments/fetchQuestions",
    async () => {
      const response = await axios.get(`${API_URL}/questions`);
      return response.data;
    }
  );

  const assessmentSlice = createSlice({
    name: "assessments",
    initialState: {
      questions: [],
      assessments: [],
      responses: [],
      results: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchQuestions.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchQuestions.fulfilled, (state, action) => {
          state.loading = false;
          state.questions = action.payload; // Store questions in state
        })
        .addCase(fetchQuestions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });

export default assessmentSlice.reducer;
