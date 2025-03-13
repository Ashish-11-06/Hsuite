import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import codesAPI from "../API/codeApi";

// Async thunk for fetching codes
export const fetchCodes = createAsyncThunk("codes/fetchCodes", async () => {
  try {
    const response = await codesAPI.getCodes();
    //console.log("📡 API Response for Codes:", response.data); // Debugging
    return response.data;
  } catch (error) {
    //console.error("❌ Error fetching codes:", error.response?.data || error.message);
    throw error;
  }
});

// Async thunk for fetching books
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  try {
    const response = await codesAPI.getBooks(); // Use the new API function
    return response.data; // Assuming the response is an array of books
  } catch (error) {
    //console.error("Error fetching books:", error);
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
export const editCode = createAsyncThunk("codes/editCode", async (codeData ) => {
  try {
    const response = await codesAPI.editCode(codeData);
    return response.data;
  } catch (error) {
    //console.error("Error editing code:", error);
    throw error;
  }
});

// Async thunk for deleting a code
export const deleteCode = createAsyncThunk("codes/deleteCode", async (id) => {
  try {
    await codesAPI.deleteCode(id); // Call the delete API
    return id; // Return the deleted code ID
  } catch (error) {
    //console.error("Error deleting code:", error);
    throw error;
  }
});

// Async thunk for reviewing a code
export const reviewCode = createAsyncThunk("codes/reviewCode", async ({ id, status }) => {
  try {
    console.log(`Updating reviewStatus for code ${id} to ${status}`);
    const response = await codesAPI.reviewCode(id, status); // Call the review API
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating review status:", error.response?.data || error.message);
    throw error;
  }
});

//Async thunk for fetching code history
// Async thunk for fetching code history
export const fetchCodeHistory = createAsyncThunk("codes/fetchCodeHistory", async (id) => {
  const response = await codesAPI.getCodeHistory(id);
  return response.data; // Ensure the response data is returned
});





// Code Slice
const codeSlice = createSlice({
  name: "codes",
  initialState: {
    codes: [],
    books: [],
    history: [],
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
        //console.log("✅ Redux Store Updated with Codes:", action.payload);
        state.codes = action.payload;
      })
      .addCase(fetchCodes.rejected, (state, action) => {
        //console.error("❌ Error Fetching Codes:", action.error);
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch codes";
      })

      // Fetch Books Cases
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload; // Store the fetched books
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch books";
      })

      // Add Code Cases
      .addCase(addCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.codes.push(action.payload);
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
    const updatedCode = action.payload;
    state.codes = state.codes.map(code => 
        code.id === updatedCode.id ? updatedCode : code);
       // code.id === updatedCode.id || code._id === updatedCode._id ? updatedCode : code);

        // const index = state.codes.findIndex((code) => code.id === action.payload.id);
        // if (index !== -1) {
        //   state.codes[index] = action.payload; // Update edited code
        // }

        // const index = state.codes.details.findIndex(code => code.id === action.payload.id);
        // if (index !== -1) {
        //     state.codes.details[index] = action.payload;
        // } else {
        //     console.error("Code not found in Redux state!", action.payload);
        // }
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
        // state.codes = state.codes.filter((code) => code.id !== action.payload); // Remove deleted code
      })
      .addCase(deleteCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete code";
      })

      // Fetch Code History Cases
        .addCase(fetchCodeHistory.pending, (state) => {
            state.status = "loading"; // Set loading state
        })
        .addCase(fetchCodeHistory.fulfilled, (state, action) => {
          state.status = "succeeded"; // Set succeeded state
          state.history = action.payload; // Store the fetched history
        })
        .addCase(fetchCodeHistory.rejected, (state, action) => {
            state.status = "failed"; // Set failed state
            state.error = action.error.message; // Store error message
          })
      

      //review code cases
      .addCase(reviewCode.fulfilled, (state, action) => {
        const { id, reviewStatus } = action.payload;
        const index = state.codes.findIndex((code) => code.id === id);
        if (index !== -1) {
          state.codes[index].reviewStatus = reviewStatus; // Ensure it updates correctly
        } else {
          console.error("Code not found in Redux state!", action.payload);
        }
      });

      
      
         
  },
});

export default codeSlice.reducer;
