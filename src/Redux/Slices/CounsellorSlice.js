import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CounsellorApi from '../API/CounsellorApi';

// ✅ Thunks
export const fetchAllCounsellors = createAsyncThunk(
  'counsellor/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.Getallcounsellor();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCounsellorById = createAsyncThunk(
  'counsellor/fetchById',
  async (counsellorId, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.GetCounsellorbyid(counsellorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCounsellorRequest = createAsyncThunk(
  'counsellor/addRequest',
  async ({ user_id, counsellor, description }, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.AddCounsellorRequest({
        user_id,
        counsellor,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllCounsellorRequests = createAsyncThunk(
  'counsellor/fetchAllRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.GetAllCounsellorRequest();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCounsellorRequestsByUserId = createAsyncThunk(
  'counsellor/fetchRequestsByUserId',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.GetCounsellorRequestByUserId(user_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRequestsByCounsellorId = createAsyncThunk(
  'counsellor/fetchRequestsByCounsellorId',
  async (counsellorId, { rejectWithValue }) => {
    try {
      console.log('Fetching requests for counsellor:', counsellorId); // Add this
      const response = await CounsellorApi.GetCounsellingRequestByCounsellorid(counsellorId);
      console.log('Response:', response); // Add this
      return response.data;
    } catch (error) {
      console.error('Error:', error); // Add this
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'counsellor/updateRequestStatus',
  async ({ request_id, status }, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.UpdateStatusForRequest(request_id, { status });
      return { request_id, status: response.data.status, message: response.data.message, };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPrecautions = createAsyncThunk(
  'counsellor/createPrecautions',
  async (precautionData, { rejectWithValue }) => {
    try{
      const response = await CounsellorApi.CreatePrecautions(precautionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTherapy = createAsyncThunk (
  'counsellor/createTherapy',
  async (therapyData,{ rejectWithValue }) => {
    try{
      const response = await CounsellorApi.CreateTherapy(therapyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllPrecautions = createAsyncThunk(
  'counsellor/fetchAllPrecautions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.GetPrecautionsAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTherapyStepsByUserId = createAsyncThunk(
  'counsellor/fetchTherapyStepsByUserId',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.GetTherapyStepsByUserId(user_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createFeedback = createAsyncThunk(
  'counsellor/createFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.CreateFeedback(feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFeedbackByCounsellorId= createAsyncThunk(
  'counsellor/fetchFeedbackByCounsellorId',
  async(counsellorId, {rejectWithValue}) => {
    try{
      const response = await CounsellorApi. GetFeedbackByCounsellorId(counsellorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data||error.message);
    }
  }
);

export const fetchAllTherapySteps = createAsyncThunk(
  'counsellor/fetchAllTherapySteps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.GetTherapyAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCurrentTherapyStep = createAsyncThunk(
  'counsellor/updateCurrentTherapyStep',
  async ({ therapy_id, stepIndex }, { rejectWithValue }) => {
    try {
      const response = await CounsellorApi.UpdateCurrentStep(therapy_id, stepIndex);
      return { therapy_id, updatedData: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// ✅ Initial State
const initialState = {
  loading: false,
  counsellors: [],
  selectedCounsellor: null,
  success: false,
  error: null,
  requestSuccess: false,
  requestLoading: false,
  requestError: null,
  counsellorRequests: [],
  requestListLoading: false,
  requestListError: null,
  counsellorRequestsByCounsellorId: [],
  counsellorRequestsByCounsellorIdLoading: false,
  counsellorRequestsByCounsellorIdError: null,
  requestStatusUpdating: false,
  requestStatusError: null,
  requestStatusSuccess: false,
  
  createPrecautionsLoading: false,
  createPrecautionsSuccess: false,
  createPrecautionsError: null,

  createTherapyLoading:false,
  createTherapySuccess: false,
  createTherapyError: null,

  precautions: [],
  fetchPrecautionsLoading: false,
  fetchPrecautionsError: null,

  therapyStepsByUserId: [],
  therapyStepsLoading: false,
  therapyStepsError: null,

  createFeedbackLoading: false,
  createFeedbackSuccess: false,
  createFeedbackError: null,

  feedbackByCounsellorId:[],
  fetchFeedbackLoading: false,
  fetchFeedbackError: null,

   therapySteps: [],
  therapyStepsLoading: false,
  therapyStepsError: null,

  updateCurrentStepLoading: false,
  updateCurrentStepSuccess: false,
  updateCurrentStepError: null,
};

// ✅ Slice
const CounsellorSlice = createSlice({
  name: 'counsellor',
  initialState,
  reducers: {
    resetCounsellorState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.counsellors = [];
      state.selectedCounsellor = null;
       state.requestSuccess = false;
      state.requestError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All counsellors
      .addCase(fetchAllCounsellors.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAllCounsellors.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.counsellors = action.payload;
      })
      .addCase(fetchAllCounsellors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Single counsellor by ID
      .addCase(fetchCounsellorById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchCounsellorById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedCounsellor = action.payload;
      })
      .addCase(fetchCounsellorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Add counsellor request
      .addCase(addCounsellorRequest.pending, (state) => {
        state.requestLoading = true;
        state.requestSuccess = false;
        state.requestError = null;
      })
      .addCase(addCounsellorRequest.fulfilled, (state) => {
        state.requestLoading = false;
        state.requestSuccess = true;
      })
      .addCase(addCounsellorRequest.rejected, (state, action) => {
        state.requestLoading = false;
        state.requestError = action.payload;
      })

      // All counsellor requests
      .addCase(fetchAllCounsellorRequests.pending, (state) => {
        state.requestListLoading = true;
        state.requestListError = null;
      })
      .addCase(fetchAllCounsellorRequests.fulfilled, (state, action) => {
        state.requestListLoading = false;
        state.counsellorRequests = action.payload;
      })
      .addCase(fetchAllCounsellorRequests.rejected, (state, action) => {
        state.requestListLoading = false;
        state.requestListError = action.payload;
      })

      // Requests by user ID
      .addCase(fetchCounsellorRequestsByUserId.pending, (state) => {
        state.requestListLoading = true;
        state.requestListError = null;
      })
      .addCase(fetchCounsellorRequestsByUserId.fulfilled, (state, action) => {
        state.requestListLoading = false;
        state.counsellorRequests = action.payload;
      })
      .addCase(fetchCounsellorRequestsByUserId.rejected, (state, action) => {
        state.requestListLoading = false;
        state.requestListError = action.payload;
      })

      .addCase(fetchRequestsByCounsellorId.pending, (state) => {
        state.counsellorRequestsByCounsellorIdLoading = true;
        state.counsellorRequestsByCounsellorIdError = null;
      })
      .addCase(fetchRequestsByCounsellorId.fulfilled, (state, action) => {
        state.counsellorRequestsByCounsellorIdLoading = false;
        state.counsellorRequestsByCounsellorId = action.payload;
      })
      .addCase(fetchRequestsByCounsellorId.rejected, (state, action) => {
        state.counsellorRequestsByCounsellorIdLoading = false;
        state.counsellorRequestsByCounsellorIdError = action.payload;
      })

      .addCase(updateRequestStatus.pending, (state) => {
        state.requestStatusUpdating = true;
        state.requestStatusError = null;
        state.requestStatusSuccess = false;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.requestStatusUpdating = false;
        state.requestStatusSuccess = true;

       // Update status locally in counsellorRequestsByCounsellorId list
        const { request_id, status } = action.payload;
        const request = state.counsellorRequestsByCounsellorId.find(req => req.id === request_id);
        if (request) {
          request.status = status;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.requestStatusUpdating = false;
        state.requestStatusError = action.payload;
        state.requestStatusSuccess = false;
      })

      // Create Precautions
      .addCase(createPrecautions.pending, (state) => {
        state.createPrecautionsLoading = true;
        state.createPrecautionsSuccess = false;
        state.createPrecautionsError = null;
      })
      .addCase(createPrecautions.fulfilled, (state) => {
        state.createPrecautionsLoading = false;
        state.createPrecautionsSuccess = true;
      })
      .addCase(createPrecautions.rejected, (state, action) => {
        state.createPrecautionsLoading = false;
        state.createPrecautionsError = action.payload;
      })

      // Create Therapy
      .addCase(createTherapy.pending, (state) => {
        state.createTherapyLoading = true;
        state.createTherapySuccess = false;
        state.createTherapyError = null;
      })
      .addCase(createTherapy.fulfilled, (state) => {
        state.createTherapyLoading = false;
        state.createTherapySuccess = true;
      })
      .addCase(createTherapy.rejected, (state, action) => {
        state.createTherapyLoading = false;
        state.createTherapyError = action.payload;
      })

      // Fetch all precautions
      .addCase(fetchAllPrecautions.pending, (state) => {
        state.fetchPrecautionsLoading = true;
        state.fetchPrecautionsError = null;
      })
      .addCase(fetchAllPrecautions.fulfilled, (state, action) => {
        state.fetchPrecautionsLoading = false;
        state.precautions = action.payload;
      })
      .addCase(fetchAllPrecautions.rejected, (state, action) => {
        state.fetchPrecautionsLoading = false;
        state.fetchPrecautionsError = action.payload;
      })

            // Fetch therapy steps by user ID
      .addCase(fetchTherapyStepsByUserId.pending, (state) => {
        state.therapyStepsLoading = true;
        state.therapyStepsError = null;
      })
      .addCase(fetchTherapyStepsByUserId.fulfilled, (state, action) => {
        state.therapyStepsLoading = false;
        state.therapyStepsByUserId = action.payload;
      })
      .addCase(fetchTherapyStepsByUserId.rejected, (state, action) => {
        state.therapyStepsLoading = false;
        state.therapyStepsError = action.payload;
      })

      // Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.createFeedbackLoading = true;
        state.createFeedbackSuccess = false;
        state.createFeedbackError = null;
      })
      .addCase(createFeedback.fulfilled, (state) => {
        state.createFeedbackLoading = false;
        state.createFeedbackSuccess = true;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.createFeedbackLoading = false;
        state.createFeedbackError = action.payload;
      })

      // Feedback by counsellor ID
      .addCase(fetchFeedbackByCounsellorId.pending, (state) => {
        state.fetchFeedbackLoading = true;
        state.fetchFeedbackError = null;
      })
      .addCase(fetchFeedbackByCounsellorId.fulfilled, (state, action) => {
        state.fetchFeedbackLoading = false;
        state.feedbackByCounsellorId = action.payload;
      })
      .addCase(fetchFeedbackByCounsellorId.rejected, (state, action) => {
        state.fetchFeedbackLoading = false;
        state.fetchFeedbackError = action.payload;
      })

      // Fetch all therapy steps
    .addCase(fetchAllTherapySteps.pending, (state) => {
      state.therapyStepsLoading = true;
      state.therapyStepsError = null;
    })
    .addCase(fetchAllTherapySteps.fulfilled, (state, action) => {
      state.therapyStepsLoading = false;
      state.therapySteps = action.payload;
    })
    .addCase(fetchAllTherapySteps.rejected, (state, action) => {
      state.therapyStepsLoading = false;
      state.therapyStepsError = action.payload;
    })

    // Update current therapy step
    .addCase(updateCurrentTherapyStep.pending, (state) => {
      state.updateCurrentStepLoading = true;
      state.updateCurrentStepError = null;
      state.updateCurrentStepSuccess = false;
    })
    .addCase(updateCurrentTherapyStep.fulfilled, (state, action) => {
      state.updateCurrentStepLoading = false;
      state.updateCurrentStepSuccess = true;

      const { therapy_id, updatedData } = action.payload;
      const index = state.therapySteps.findIndex(step => step.id === therapy_id);
      if (index !== -1) {
        // Update the therapy step in the list with new data
        state.therapySteps[index] = { ...state.therapySteps[index], ...updatedData };
      }
    })
    .addCase(updateCurrentTherapyStep.rejected, (state, action) => {
      state.updateCurrentStepLoading = false;
      state.updateCurrentStepError = action.payload;
      state.updateCurrentStepSuccess = false;
    });
  },
});

// ✅ Export actions and reducer
export const { resetCounsellorState } = CounsellorSlice.actions;
export default CounsellorSlice.reducer;
