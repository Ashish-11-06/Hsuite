import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthApi from "../API/AuthApi";
import { message } from "antd";

// User Registration Thunk
export const postUserRegistration = createAsyncThunk(
  "auth/postUserRegistration",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await AuthApi.UserRegistration(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error during registration");
    }
  }
);

// User Login Thunk
export const postUserLogin = createAsyncThunk(
  "auth/postUserLogin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await AuthApi.UserLogin(formData);
      message.success(response.data.message || "Login successful!");
      return response.data;
    } catch (error) {
       const backendError =
        error?.response?.data?.error ||
        "Login failed. Please try again.";
      return rejectWithValue(backendError);
    }
  }
);

// Hospital and Admin Post Thunk
export const postHospitalAndAdmin = createAsyncThunk(
  "auth/postHospitalAndAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthApi.PostHospitalAndAdmin();
       message.success(response.data.message || "Hospital and Admin posted successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error posting hospital and admin");
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    hms_user: null,
    token: null,
    error: null,
    hospital: null, // Added hospital state
  },
  reducers: {
    logout: (state) => {
      state.hms_user = null;
      state.token = null;
      state.error = null;
      state.hospital = null; 
    },
  },
  extraReducers: (builder) => {
    // Registration
    builder
      .addCase(postUserRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUserRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
      })
      .addCase(postUserRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(postUserLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.hms_user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.hospital = action.payload?.hospital || null;
      })
      .addCase(postUserLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Hospital and Admin Post
      .addCase(postHospitalAndAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postHospitalAndAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the response as needed, e.g., store hospital data
      })
      .addCase(postHospitalAndAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;
