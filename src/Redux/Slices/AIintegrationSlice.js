// AIintegrationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AIintegrationApi from '../API/AIintegrationApi';

// Async thunk for code automation
export const runCodeAutomation = createAsyncThunk(
  'aiintegration/codeAutomationRun',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await AIintegrationApi.codeAutomation(formData);
      return {
        extracted_text: response.data.extracted_text,
        analysis_report: response.data.analysis_report.full_report,
        status: response.data.status,
        sections: response.data.analysis_report.sections,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Async thunk for chatbot
export const runChatBot = createAsyncThunk(
  'aiintegration/chatBotRun',
  async (message, { rejectWithValue }) => {
    try {
      const response = await AIintegrationApi.ChatBot(message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Initial state with nested state slices
const initialState = {
  codeAutomation: {
    loading: false,
    success: false,
    error: null,
    data: {
      extracted_text: null,
      analysis_report: null,
      status: null,
      sections: null,
    },
  },
  chatBot: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
};

const AIintegrationSlice = createSlice({
  name: 'aiintegration',
  initialState,
  reducers: {
    resetCodeAutomationState: (state) => {
      state.codeAutomation = { ...initialState.codeAutomation };
    },
    resetChatBotState: (state) => {
      state.chatBot = { ...initialState.chatBot };
    },
  },
  extraReducers: (builder) => {
    builder
      // Code Automation
      .addCase(runCodeAutomation.pending, (state) => {
        state.codeAutomation.loading = true;
        state.codeAutomation.error = null;
        state.codeAutomation.success = false;
        state.codeAutomation.data = { ...initialState.codeAutomation.data };
      })
      .addCase(runCodeAutomation.fulfilled, (state, action) => {
        state.codeAutomation.loading = false;
        state.codeAutomation.data = {
          extracted_text: action.payload.extracted_text,
          analysis_report: action.payload.analysis_report,
          status: action.payload.status,
          sections: action.payload.sections,
        };
        state.codeAutomation.success = action.payload.status === 'success';
      })
      .addCase(runCodeAutomation.rejected, (state, action) => {
        state.codeAutomation.loading = false;
        state.codeAutomation.error = action.payload;
        state.codeAutomation.success = false;
      })

      // ChatBot
      .addCase(runChatBot.pending, (state) => {
        state.chatBot.loading = true;
        state.chatBot.error = null;
        state.chatBot.success = false;
        state.chatBot.data = null;
      })
      .addCase(runChatBot.fulfilled, (state, action) => {
        state.chatBot.loading = false;
        state.chatBot.data = action.payload;
        state.chatBot.success = true;
      })
      .addCase(runChatBot.rejected, (state, action) => {
        state.chatBot.loading = false;
        state.chatBot.error = action.payload;
        state.chatBot.success = false;
      });
  },
});

export const { resetCodeAutomationState, resetChatBotState } = AIintegrationSlice.actions;
export default AIintegrationSlice.reducer;
