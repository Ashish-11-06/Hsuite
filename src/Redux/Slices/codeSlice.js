import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import codesAPI from "../API/codeApi";

// Async thunk for fetching codes
export const fetchCodes = createAsyncThunk("codes/fetchCodes", async () => {
  try {
    const response = await codesAPI.getCodes();
    return response.data;
  } catch (error) {
    console.error("Error fetching codes:", error);
    throw error;
  }
});

// Async thunk for adding a code
export const addCode = createAsyncThunk("codes/addCode", async (newCode) => {
  try {
    const response = await codesAPI.addCode(newCode);
    return response.data;
  } catch (error) {
    console.error("Error adding code:", error);
    throw error;
  }
});

// Async thunk for editing a code
export const editCode = createAsyncThunk("codes/editCode", async ({ id, codeData }) => {
  try {
    const response = await codesAPI.editCode(id, codeData);
    return response.data;
  } catch (error) {
    console.error("Error editing code:", error);
    throw error;
  }
});

// Async thunk for deleting a code
export const deleteCode = createAsyncThunk("codes/deleteCode", async (id) => {
  try {
    await codesAPI.deleteCode(id); // No response needed
    return id; // Return the deleted code ID
  } catch (error) {
    console.error("Error deleting code:", error);
    throw error;
  }
});

// Code Slice
const codeSlice = createSlice({
  name: "codes",
  initialState: {
    codes: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Codes Cases
      .addCase(fetchCodes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCodes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.codes = action.payload;
      })
      .addCase(fetchCodes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch codes";
      })

      // Add Code Cases
      .addCase(addCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.codes.push(action.payload);
      })
      .addCase(addCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add code";
      })

      // Edit Code Cases
      .addCase(editCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.codes.findIndex((code) => code.id === action.payload.id);
        if (index !== -1) {
          state.codes[index] = action.payload; // Update edited code
        }
      })
      .addCase(editCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to edit code";
      })

      // Delete Code Cases
      .addCase(deleteCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.codes = state.codes.filter((code) => code.id !== action.payload); // Remove deleted code
      })
      .addCase(deleteCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete code";
      });
  },
});

export default codeSlice.reducer;
