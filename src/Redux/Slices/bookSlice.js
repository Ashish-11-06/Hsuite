import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import booksAPIs from "../API/bookApi";

// Async thunk for fetching books
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  try {
    const response = await booksAPIs.getBooks();
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
});

// Async thunk for adding a book
export const addBook = createAsyncThunk("books/addBook", async (newBook) => {
  try {
    const response = await booksAPIs.addBook(newBook);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
});

// Async thunk for editing a book
export const editBook = createAsyncThunk("books/editBook", async ({ id, bookData }) => {
  try {
    const response = await booksAPIs.editBook(id, bookData);
    return response.data;
  } catch (error) {
    console.error("Error editing book:", error);
    throw error;
  }
});

// Async thunk for deleting a book
export const deleteBook = createAsyncThunk("books/deleteBook", async (id) => {
  try {
    await booksAPIs.deleteBook(id); // No need to return response for delete
    return id; // Return deleted book ID to remove it from Redux state
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
});

// Book Slice
const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Books Cases
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch data";
      })

      // Add Book Cases
      .addCase(addBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add book";
      })

      // Edit Book Cases
      .addCase(editBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.books.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload; // Update the edited book
        }
      })
      .addCase(editBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to edit book";
      })

      // Delete Book Cases
      .addCase(deleteBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = state.books.filter((book) => book.id !== action.payload); // Remove deleted book
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete book";
      });
  },
});

export default bookSlice.reducer;
