// src/Redux/slices/mhAuthSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mhAuthAPI from "../API/MHAuthApi";
import { message } from "antd";

// ✅ Register thunk
export const registerMedical = createAsyncThunk(
  "mhAuth/registerMedical",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await mhAuthAPI.Register(formData);
      message.success(response.data.message || "Register successful!");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed!");
      return rejectWithValue(
        error.response?.data || "Something went wrong during registration"
      );
    }
  }
);

// ✅ Verify OTP thunk
export const verifyOtp = createAsyncThunk(
  "mhAuth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await mhAuthAPI.VerifyOTP(otpData);
      message.success(response.data.message || "OTP verified successfully!");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "OTP verification failed!");
      return rejectWithValue(
        error.response?.data || "Something went wrong during OTP verification"
      );
    }
  }
);

// ✅ Login thunk
export const loginMedical = createAsyncThunk(
  "mhAuth/loginMedical",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mhAuthAPI.Login(credentials);
      message.success(response.data.message || "Login successful!");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed!");
      return rejectWithValue(
        error.response?.data || "Something went wrong during login"
      );
    }
  }
);

const mhAuthSlice = createSlice({
  name: "mhAuth",
  initialState: {
    loading: false,
    success: false,
    error: null,
    user: null,
    token: null,
    otpVerified: false,
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.user = null;
      state.token = null;
      state.otpVerified = false;
      localStorage.removeItem("medicalUser");
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerMedical.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerMedical.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(registerMedical.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.success = true;
        state.user = { ...state.user, otp_verified: true }; // merge if user exists
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginMedical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginMedical.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
          localStorage.setItem(
          "medicalUser",
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        );
      })
      .addCase(loginMedical.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState } = mhAuthSlice.actions;
export default mhAuthSlice.reducer;
