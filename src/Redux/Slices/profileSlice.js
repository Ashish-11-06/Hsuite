import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../API/authApi"

// 🔹 Async thunk to update profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData); // calls /accounts/update-profile/
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile.");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user; // ✅ Store only the user object
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserData } = profileSlice.actions;
export default profileSlice.reducer;
