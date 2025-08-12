import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AIintegrationApi from '../API/AIintegrationApi';
import { act } from 'react';

export const runCodeAutomation = createAsyncThunk(
  'codeAutomation/run',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await AIintegrationApi.codeAutomation(formData);
      return {
        extracted_text: response.data.extracted_text,
        analysis_report: response.data.analysis_report.full_report, // Extract full_report
        status: response.data.status,
        sections: response.data.analysis_report.sections 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);


// ✅ Initial state
const initialState = {
  loading: false,
  success: false,
  error: null,
  data: {
    extracted_text: null,
    analysis_report: null,
    status: null,
    sections: null,
  },
};

// ✅ Slice
const AIintegrationSlice = createSlice({
  name: 'aiintegration',
  initialState,
  reducers: {
    resetCodeAutomationState: (state) => {
      state.loading= false;
      state.data = initialState.data;
      state.error= null;
      state.success= false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(runCodeAutomation.pending, (state) => {
      state.loading = true;
      state.data = initialState.data;
      state.error = null;
      state.success= false;
    })
    .addCase(runCodeAutomation.fulfilled, (state,action) => {
      state.loading = false;
     state.data = {
          extracted_text: action.payload.extracted_text,
          analysis_report: action.payload.analysis_report,
          status: action.payload.status,
          sections: action.payload.sections
        };
      state.success = action.payload.status ==='success'
    })
    .addCase(runCodeAutomation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
      
  },
});

// ✅ Export actions and reducer
export const { resetCodeAutomationState } = AIintegrationSlice.actions;
export default AIintegrationSlice.reducer;
