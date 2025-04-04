import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import codesAPI from "../API/codeApi";

// Async thunk for fetching codes
// In codeSlice.js
export const fetchCodes = createAsyncThunk(
  "codes/fetchCodes", 
  async (_, { getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.id;
      const response = await codesAPI.getCodes(user_id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

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

// Async thunk for fetching code history
export const fetchCodeHistory = createAsyncThunk("codes/fetchCodeHistory", async (id) => {
  const response = await codesAPI.getCodeHistory(id);
  return response.data; // Ensure the response data is returned
});

// Async thunk for adding reactions (like/dislike)
export const addReaction = createAsyncThunk(
  'codes/addReaction',
  async ({ user_id, description_id, action }, { rejectWithValue }) => {
    try {
      const response = await codesAPI.addReaction({ user_id, description_id, action });
      console.log('API RESPONSE DATA:', response); // Verify this logs
      return response; // Should contain {message, like_count, dislike_count}
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Code Slice
const codeSlice = createSlice({
  name: "codes",
  initialState: {
    codes: [],
    books: [],
    history: [],
    status: "idle",
    error: null,
    reactionMessage: null,
    userReactions: {},
    currentUserId: null,
  },
  reducers: {
    clearReactionMessage: (state) => {
      state.reactionMessage = null; // Clear message when needed
    },
    // New reducer to set user reaction
    // setUserReaction: (state, action) => {
    //   const {id, descriptionId, action: reactionAction } = action.payload;
    //   state.userReactions[descriptionId] = reactionAction;
    //   state.userReactions[id] = reactionAction;
    // },\
    // Update the setUserReaction reducer
setUserReaction: (state, action) => {
  const { descriptionId, action: reactionAction, liked, disliked, likeCount, dislikeCount } = action.payload;
  
  // Update the user's reaction state
  state.userReactions[descriptionId] = reactionAction;
  
  // Update the specific code's counts and status if provided
  const codeIndex = state.codes.findIndex(code => code.id === descriptionId);
  if (codeIndex !== -1) {
    if (likeCount !== undefined) state.codes[codeIndex].like_count = likeCount;
    if (dislikeCount !== undefined) state.codes[codeIndex].dislike_count = dislikeCount;
    if (liked !== undefined) state.codes[codeIndex].liked = liked;
    if (disliked !== undefined) state.codes[codeIndex].disliked = disliked;
  }
},
    // New reducer to clear reactions (useful on logout)
    clearUserReactions: (state) => {
      state.userReactions = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Codes Cases
      .addCase(fetchCodes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // .addCase(fetchCodes.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   //console.log("✅ Redux Store Updated with Codes:", action.payload);
      //   state.codes = action.payload;
      //   action.payload.forEach(code => {
      //     const userReaction = code.reactions?.find(r => r.user_id === state.currentUserId);
      //     if (userReaction) {
      //       state.userReactions[code.id] = userReaction.action;
      //     }
      //   });
      // })
      .addCase(fetchCodes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.codes = action.payload;
        
        // Initialize user reactions from the liked/disliked flags
        action.payload.forEach(code => {
          if (code.liked) {
            state.userReactions[code.id] = 'like';
          } else if (code.disliked) {
            state.userReactions[code.id] = 'dislike';
          } else {
            // Clear any existing reaction if neither liked nor disliked
            state.userReactions[code.id] = null;
          }
        });
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

        console.log("✅ Updated Redux State:", state.codes); // Debug log
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

         // Add Reaction Cases
         .addCase(addReaction.pending, (state, action) => {
          const { description_id, action: reactionAction } = action.meta.arg;
          // Optimistically update the reaction
          state.userReactions[description_id] = reactionAction;
        })
         .addCase(addReaction.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.reactionMessage = action.payload.message;
          const { description_id, like_count, dislike_count } = action.payload;
          state.codes = state.codes.map((code) =>
            code.id === description_id ? { ...code, like_count, dislike_count } : code
          );
        })
        .addCase(addReaction.rejected, (state, action) => {
          const { description_id } = action.meta.arg;
          // Roll back the optimistic update
          delete state.userReactions[description_id];
          state.status = "failed";
          state.error = action.error.message || "Failed to add reaction";
        })
  
  },
});
export const { clearReactionMessage, setUserReaction, clearUserReactions } = codeSlice.actions; // Export action
export default codeSlice.reducer;