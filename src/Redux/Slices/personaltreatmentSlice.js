import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import personaltreatmentApi from '../API/personaltreatmentApi';

// Async Thunks
export const addTreatment = createAsyncThunk(
  'treatment/addTreatment',
  async (treatmentData, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.addTreatment(treatmentData);
      return {
        treatment: response.data.treatment,
        steps: response.data.steps,
        message: response.data.message || "Treatment added successfully"
      };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add treatment"
      });
    }
  }
);

export const createPersonalitySteps = createAsyncThunk(
  "treatment/createPersonalitySteps",
  async (stepsData, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.CreateSteps(stepsData);
      return {
        data: response.data,
        message: response.data.message || "Steps created successfully"
      };
    } catch (error) {
    // console.error("API Error:", error.response?.data); // Log full error data
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create steps"
      );

    }
  }
);

export const getAllSteps = createAsyncThunk(
  "treatment/getAllSteps",
  async (params, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.getallsteps(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addFeedback = createAsyncThunk(
  "treatment/addFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.AddFeedback(feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCurrentStep = createAsyncThunk(
  'treatment/updateCurrentStep',
  async ({ treatment_id, step_id }, { rejectWithValue }) => {
    try {
      const res = await personaltreatmentApi.UpdateCurrentStep({ treatment_id, step_id });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.res?.data || err.message);
    }
  }
);

export const getTreatmentById = createAsyncThunk(
  'treatment/getTreatmentById',
  async ({ user_id, treatmentid }, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.GetTreatment(user_id, treatmentid);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch treatment',
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const getTreatmentsByUser = createAsyncThunk(
  'treatment/getTreatmentsByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.GetTreatmentByUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch user treatments',
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const getStepByStepsId = createAsyncThunk(
  "treatment/getStepByStepsId",
  async (stepId, { rejectWithValue }) => {
    try {
      const response = await personaltreatmentApi.GetStepByStepsId(stepId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch step by ID"
      );
    }
  }
);

// Initial State
const initialState = {
  // General treatment state
  treatment: null,
  treatmentLoading: false,
  treatmentError: null,
  
  // Multiple treatments state
  treatments: [],
  treatmentsLoading: false,
  treatmentsError: null,
  
  // Steps related state
  personalitySteps: [],
  stepsLoading: false,
  stepsError: null,
  stepsMessage: "",
  allSteps: [],
  allStepsLoading: false,
  allStepsError: null,
  
  // Feedback state
  feedbackLoading: false,
  feedbackError: null,
  feedbackSuccess: false,
  feedbackMessage: "",

  // Single step detail
stepDetail: null,
stepDetailLoading: false,
stepDetailError: null,

  
  // General state
  loading: false,
  success: false,
  error: null,
  data: null
};

// Slice
const personaltreatmentSlice = createSlice({
  name: 'personaltreatment',
  initialState,
  reducers: {
    resetTreatmentState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    resetStepsState: (state) => {
      state.stepsLoading = false;
      state.stepsError = null;
      state.stepsMessage = "";
    },
    resetAllStepsState: (state) => {
      state.allStepsLoading = false;
      state.allStepsError = null;
    },
    resetFeedbackState: (state) => {
      state.feedbackLoading = false;
      state.feedbackError = null;
      state.feedbackSuccess = false;
      state.feedbackMessage = "";
    },
    resetUserTreatmentsState: (state) => {
      state.treatments = [];
      state.treatmentsLoading = false;
      state.treatmentsError = null;
    },
    resetStepDetailState: (state) => {
  state.stepDetail = null;
  state.stepDetailLoading = false;
  state.stepDetailError = null;
}

  },
  extraReducers: (builder) => {
    builder
      // Create Personality Steps
      .addCase(createPersonalitySteps.pending, (state) => {
        state.stepsLoading = true;
        state.stepsError = null;
      })
      .addCase(createPersonalitySteps.fulfilled, (state, action) => {
        state.stepsLoading = false;
        state.personalitySteps = action.payload.data;
        state.stepsMessage = action.payload.message;
      })
      .addCase(createPersonalitySteps.rejected, (state, action) => {
        state.stepsLoading = false;
        state.stepsError = action.payload?.message || null;
      })

      // Get All Steps
      .addCase(getAllSteps.pending, (state) => {
        state.allStepsLoading = true;
        state.allStepsError = null;
      })
      .addCase(getAllSteps.fulfilled, (state, action) => {
        state.allStepsLoading = false;
        state.allSteps = action.payload.message;
      })
      .addCase(getAllSteps.rejected, (state, action) => {
        state.allStepsLoading = false;
        state.allStepsError = action.payload?.message || null;
      })

      // Add Feedback
      .addCase(addFeedback.pending, (state) => {
        state.feedbackLoading = true;
        state.feedbackError = null;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackSuccess = true;
        state.feedbackMessage = action.payload.message;
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackError = action.payload?.message || null;
      })

      // Add Treatment
      .addCase(addTreatment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTreatment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(addTreatment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // Update Current Step
      .addCase(updateCurrentStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentStep.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.message;
      })
      .addCase(updateCurrentStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || null;
      })

      // Get Treatment by ID
      .addCase(getTreatmentById.pending, (state) => {
        state.treatmentLoading = true;
        state.treatmentError = null;
      })
      .addCase(getTreatmentById.fulfilled, (state, action) => {
        state.treatmentLoading = false;
        state.treatment = action.payload;
      })
      .addCase(getTreatmentById.rejected, (state, action) => {
        state.treatmentLoading = false;
        state.treatmentError = action.payload;
      })

      // Get Treatments by User
      .addCase(getTreatmentsByUser.pending, (state) => {
        state.treatmentsLoading = true;
        state.treatmentsError = null;
      })
      .addCase(getTreatmentsByUser.fulfilled, (state, action) => {
        state.treatmentsLoading = false;
        state.treatments = action.payload;
      })
      .addCase(getTreatmentsByUser.rejected, (state, action) => {
        state.treatmentsLoading = false;
        state.treatmentsError = action.payload;
      })

      // Get Step By Step ID
.addCase(getStepByStepsId.pending, (state) => {
  state.stepDetailLoading = true;
  state.stepDetailError = null;
})
.addCase(getStepByStepsId.fulfilled, (state, action) => {
  state.stepDetailLoading = false;
  state.stepDetail = action.payload;
})
.addCase(getStepByStepsId.rejected, (state, action) => {
  state.stepDetailLoading = false;
  state.stepDetailError = action.payload;
});

  }
});

// Export actions
export const { 
  resetTreatmentState, 
  resetStepsState, 
  resetAllStepsState, 
  resetFeedbackState,
  resetUserTreatmentsState,
  resetStepDetailState 
} = personaltreatmentSlice.actions;

// Export reducer
export default personaltreatmentSlice.reducer;