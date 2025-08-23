import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../API/authApi";
import { act, useCallback } from "react";

// 🔹 Register User & Send OTP (combined)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.registerUser(userData);
      //console.log("🔍 Registration API Response:", response.data);

      if (response.data.user_id) {
        return response.data; // { user_id: "3" }
      } else {
        return rejectWithValue("Failed to register user");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// 🔹 Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      //console.log("🔍 OTP Verification Response:", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginUser(credentials);
      //console.log("🔹 Login Response:", response.data);

      if (!response.data || !response.data.token || !response.data.user) {
        return rejectWithValue("Invalid login response");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Send Reset OTP
export const sendResetOTP = createAsyncThunk(
  "auth/sendResetOTP",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await authAPI.sendResetOTP(emailData);
      return {
        success: true,
        message: response.data?.message || "OTP sent successfully",
        email: emailData.email,
        data: response.data
      };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data.error || "Failed to send OTP",
        error: error.response?.data
      });
    }
  }
);

// Verify Reset OTP
export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authAPI.verfiyResetOTP(otpData);
      return {
        success: true,
        message: response.data?.message || "OTP verified successfully",
        data: response.data
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message ||
          error.response?.data.error || "OTP verification failed",
        error: error.response?.data
      });
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.ResetPassword(passwordData);
      return {
        success: true,
        message: response.data?.message || "Password reset successful",
        data: response.data
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message ||
          error.response?.data.error || "Password reset failed",
        error: error.response?.data
      });
    }
  }
);

//Counsellor thunk
export const CompleteCounsellorProfile = createAsyncThunk(
  "auth/completeCounsellorProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.CompleteCounsellor(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed to complete profile");
    }
  }
);

//update counsellor thunk
export const UpdateCounsellorProfile = createAsyncThunk(
  "auth/updateCounsellorProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await authAPI.UpdateCounsellorProfile(id, data);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.GetDashboard();
      return response.data; // ✅ directly returning stats data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch dashboard stats"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"), // Load from localStorage
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    userId: null,
    counsellorProfile: {
      loading: false,
      success: false,
      error: null
    },
    resetPassword: {
      loading: false,
      error: null,
      success: false,
      email: null,
      step: 1 // 1 = email, 2 = OTP, 3 = new password
    },
    updateCounsellorProfile: {
      loading: false,
      success: false,
      error: null
    },

  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    resetPasswordState: (state) => {
      state.resetPassword = {
        loading: false,
        error: null,
        success: false,
        email: null,
        step: 1
      };
    },
    setResetPasswordStep: (state, action) => {
      state.resetPassword.step = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.user_id; // Save user_id for OTP verification
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.currentUserId = action.payload.id;

        //console.log("🔹 Login Successful:", action.payload); // Debugging Log

        localStorage.setItem("token", action.payload.token); // 🛠 Ensure token is stored
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        // 🏥 Store hospital ID
        localStorage.setItem("role", action.payload.user.role);

        window.location.href = "/"; // 🔥 Force Redirect After Login
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Reset OTP
      .addCase(sendResetOTP.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(sendResetOTP.fulfilled, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.email = action.payload.email;
        state.resetPassword.step = 2;
      })
      .addCase(sendResetOTP.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "Failed to send OTP";
      })

      // Verify Reset OTP
      .addCase(verifyResetOTP.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.step = 3;
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "OTP verification failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "Password reset failed";
      })

      //counsellor profile
      .addCase(CompleteCounsellorProfile.pending, (state) => {
        state.counsellorProfile.loading = true;
        state.counsellorProfile.error = null;
        state.counsellorProfile.success = false;
      })
      .addCase(CompleteCounsellorProfile.fulfilled, (state) => {
        state.counsellorProfile.loading = false;
        state.counsellorProfile.success = true;
      })
      .addCase(CompleteCounsellorProfile.rejected, (state, action) => {
        state.counsellorProfile.loading = false;
        state.counsellorProfile.error = action.payload || "failed to complete profile";
      })

      .addCase(UpdateCounsellorProfile.pending, (state) => {
        state.updateCounsellorProfile.loading = true;
        state.updateCounsellorProfile.error = null;
        state.updateCounsellorProfile.success = false;
      })
      .addCase(UpdateCounsellorProfile.fulfilled, (state) => {
        state.updateCounsellorProfile.loading = false;
        state.updateCounsellorProfile.success = true;
      })
      .addCase(UpdateCounsellorProfile.rejected, (state, action) => {
        state.updateCounsellorProfile.loading = false;
        state.updateCounsellorProfile.error = action.payload || "Failed to update profile";
      })

      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { logout, loginSuccess, resetPasswordState, setResetPasswordStep } = authSlice.actions;
export default authSlice.reducer;
