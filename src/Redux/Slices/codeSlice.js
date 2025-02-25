import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import codeAPIs from "../API/codeApi";

// Async thunk for fetching books
export const fetchCodes = createAsyncThunk("books/fetchCodes", async () => {
  try {
    const response = await codeAPIs.getCodes();
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
});

// Async thunk for adding a code
export const addCode = createAsyncThunk("books/addCode", async (newCode) => {
  try {
    const response = await codeAPIs.addCode(newCode);
    return response.data;
  } catch (error) {
    console.error("Error adding code:", error);
    throw error;
  }
});

// Async thunk for editing a code
// export const editBook = createAsyncThunk("books/editBook", async ({ id, bookData }) => {
//   try {
//     const response = await codeAPIs.editBook(id, bookData);
//     return response.data;
//   } catch (error) {
//     console.error("Error editing code:", error);
//     throw error;
//   }
// });

// // Async thunk for deleting a code
// export const deleteBook = createAsyncThunk("books/deleteBook", async (id) => {
//   try {
//     await codeAPIs.deleteBook(id); // No need to return response for delete
//     return id; // Return deleted code ID to remove it from Redux state
//   } catch (error) {
//     console.error("Error deleting code:", error);
//     throw error;
//   }
// });

// Book Slice
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
      // Fetch Books Cases
    //   .addCase(fetchCodes.pending, (state) => {
    //     state.status = "loading";
    //     state.error = null;
    //   })
    //   .addCase(fetchCodes.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.books = action.payload;
    //   })
    //   .addCase(fetchCodes.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message || "Failed to fetch data";
    //   })

      // Add Book Cases
      .addCase(addCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books.push(action.payload);
      })
      .addCase(addCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add code";
      })

      // Edit Book Cases
    //   .addCase(editBook.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(editBook.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     const index = state.books.findIndex((code) => code.id === action.payload.id);
    //     if (index !== -1) {
    //       state.books[index] = action.payload; // Update the edited code
    //     }
    //   })
    //   .addCase(editBook.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message || "Failed to edit code";
    //   })

    //   // Delete Book Cases
    //   .addCase(deleteBook.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(deleteBook.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.books = state.books.filter((code) => code.id !== action.payload); // Remove deleted code
    //   })
    //   .addCase(deleteBook.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message || "Failed to delete code";
    //   });
  },
});

export default codeSlice.reducer;
